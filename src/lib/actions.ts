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

  revalidatePath("/");
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
