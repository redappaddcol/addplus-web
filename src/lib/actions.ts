"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const nombre = String(formData.get("nombre"));
  const rol = String(formData.get("rol"));

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nombre, rol } },
  });

  if (error) {
    redirect(`/registro?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createCause(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const tieneMeta = formData.get("tiene_meta_economica") === "on";

  const { error } = await supabase.from("causes").insert({
    gestor_id: user.id,
    titulo: String(formData.get("titulo")),
    descripcion: String(formData.get("descripcion")),
    categoria_id: Number(formData.get("categoria_id")) || null,
    ciudad: String(formData.get("ciudad") || ""),
    tiene_meta_economica: tieneMeta,
    monto_meta: tieneMeta ? Number(formData.get("monto_meta")) || null : null,
    enlace_aporte: tieneMeta ? String(formData.get("enlace_aporte") || "") : null,
    voluntarios_requeridos: Number(formData.get("voluntarios_requeridos")) || 1,
  });

  if (error) {
    redirect(`/causas/nueva?error=${encodeURIComponent(error.message)}`);
  }

  const { data: nueva } = await supabase
    .from("causes")
    .select("id, titulo, ciudad")
    .eq("gestor_id", user.id)
    .order("creado_en", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (nueva) {
    const propuesta = new Date();
    propuesta.setDate(propuesta.getDate() + 10);
    propuesta.setHours(18, 0, 0, 0);

    await supabase.from("events").insert({
      cause_id: nueva.id,
      gestor_id: user.id,
      titulo: `Sesion abierta: ${nueva.titulo}`,
      descripcion:
        "Sesion para explicar la causa: que problema ataca, en que va y como sumarse. Edita este texto y publica el evento en Luma para abrir inscripciones.",
      modalidad: "virtual",
      ciudad: nueva.ciudad,
      inicia_en: propuesta.toISOString(),
      duracion_min: 60,
      estado: "por_agendar",
    });
  }

  revalidatePath("/");
  revalidatePath("/eventos");
  redirect("/dashboard");
}

export async function applyToCause(causeId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const mensaje = String(formData.get("mensaje") || "");

  const { error } = await supabase.from("applications").insert({
    cause_id: causeId,
    voluntario_id: user.id,
    mensaje,
  });

  if (error) {
    redirect(`/causas/${causeId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/causas/${causeId}`);
  redirect(`/causas/${causeId}?ok=1`);
}

export async function updateApplicationStatus(
  applicationId: string,
  estado: "aceptada" | "rechazada"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("applications").update({ estado }).eq("id", applicationId);

  revalidatePath("/dashboard");
}

export async function closeCause(causeId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("causes")
    .update({ estado: "cerrada", cerrado_en: new Date().toISOString() })
    .eq("id", causeId)
    .eq("gestor_id", user.id);

  revalidatePath("/dashboard");
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const modalidad = String(formData.get("modalidad") || "virtual");
  const fecha = String(formData.get("fecha"));
  const hora = String(formData.get("hora") || "18:00");
  const lumaUrl = String(formData.get("luma_url") || "").trim();

  const { error } = await supabase.from("events").insert({
    cause_id: String(formData.get("cause_id")),
    gestor_id: user.id,
    titulo: String(formData.get("titulo")),
    descripcion: String(formData.get("descripcion") || ""),
    modalidad,
    lugar: modalidad === "presencial" ? String(formData.get("lugar") || "") : null,
    ciudad: String(formData.get("ciudad") || ""),
    luma_url: lumaUrl || null,
    inicia_en: new Date(`${fecha}T${hora}`).toISOString(),
    duracion_min: Number(formData.get("duracion_min")) || 60,
    estado: lumaUrl ? "publicado" : "por_agendar",
  });

  if (error) {
    redirect(`/eventos/nuevo?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/eventos");
  redirect("/eventos");
}

export async function vincularLuma(eventId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const url = String(formData.get("luma_url") || "").trim();
  if (!url) redirect(`/eventos/${eventId}`);

  await supabase
    .from("events")
    .update({ luma_url: url, estado: "publicado" })
    .eq("id", eventId)
    .eq("gestor_id", user.id);

  revalidatePath(`/eventos/${eventId}`);
  redirect(`/eventos/${eventId}?ok=1`);
}

export async function cancelEvent(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("events")
    .update({ estado: "cancelado" })
    .eq("id", eventId)
    .eq("gestor_id", user.id);

  revalidatePath(`/eventos/${eventId}`);
}
