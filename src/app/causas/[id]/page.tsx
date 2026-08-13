import { createClient } from "@/lib/supabase/server";
import { applyToCause } from "@/lib/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import EventCard from "@/components/EventCard";

export default async function CauseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { id } = await params;
  const { ok, error } = await searchParams;
  const supabase = await createClient();

  const { data: cause } = await supabase
    .from("causes")
    .select("*, categories(nombre), profiles!causes_gestor_id_fkey(nombre, ciudad)")
    .eq("id", id)
    .single();

  if (!cause) notFound();

  const { data: { user } } = await supabase.auth.getUser();

  let yaPostulado = false;
  if (user) {
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("cause_id", id)
      .eq("voluntario_id", user.id)
      .maybeSingle();
    yaPostulado = !!existing;
  }

  const { data: eventos } = await supabase
    .from("events")
    .select("*, causes(id, titulo)")
    .eq("cause_id", id)
    .neq("estado", "cancelado")
    .order("inicia_en", { ascending: true });

  const esGestorDeLaCausa = !!user && user.id === cause.gestor_id;

  const applyAction = applyToCause.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <span className="text-xs font-medium uppercase tracking-wide text-orange-600">
        {cause.categories?.nombre ?? "General"}
      </span>
      <h1 className="mt-1 text-2xl font-bold">{cause.titulo}</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Gestor: {cause.profiles?.nombre} · {cause.ciudad || "Sin ciudad"} · estado: {cause.estado.replace("_", " ")}
      </p>

      <p className="mt-4 whitespace-pre-line text-neutral-800">{cause.descripcion}</p>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <span className="rounded bg-neutral-100 px-3 py-1">
          {cause.voluntarios_requeridos} voluntarios requeridos
        </span>
        {cause.tiene_meta_economica && (
          <span className="rounded bg-amber-100 px-3 py-1 text-amber-700">
            Meta económica: {cause.monto_meta ? `$${cause.monto_meta}` : "definida por el gestor"}
            {cause.enlace_aporte ? (
              <>
                {" · "}
                <a href={cause.enlace_aporte} target="_blank" className="underline">
                  Enlace para aportar
                </a>
              </>
            ) : null}
          </span>
        )}
      </div>

      <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="mb-2 font-semibold">Postularme como voluntario</h2>

        {ok && (
          <p className="mb-3 rounded bg-emerald-50 p-2 text-sm text-emerald-700">
            ¡Postulación enviada! El gestor revisará tu solicitud.
          </p>
        )}
        {error && (
          <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>
        )}

        {!user ? (
          <p className="text-sm text-neutral-600">
            Debes{" "}
            <a href="/login" className="text-orange-600 underline">
              iniciar sesión
            </a>{" "}
            para postularte.
          </p>
        ) : yaPostulado ? (
          <p className="text-sm text-neutral-600">Ya te postulaste a esta causa.</p>
        ) : cause.estado !== "activa" ? (
          <p className="text-sm text-neutral-600">Esta causa ya no recibe nuevos voluntarios.</p>
        ) : (
          <form action={applyAction} className="space-y-3">
            <textarea
              name="mensaje"
              placeholder="Cuéntale al gestor por qué quieres sumarte (opcional)"
              className="w-full rounded border border-neutral-300 p-2 text-sm"
              rows={3}
            />
            <button className="rounded bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">
              Sumarme +
            </button>
          </form>
        )}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-semibold">Eventos de esta causa</h2>
          {esGestorDeLaCausa && (
            <Link
              href={`/eventos/nuevo?causa=${id}`}
              className="text-sm text-[#40573F] underline"
            >
              + Agendar evento
            </Link>
          )}
        </div>

        {eventos && eventos.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {eventos.map((e: any) => (
              <EventCard key={e.id} evento={e} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-[#CFC9B8] p-6 text-center text-sm text-[#6B6B60]">
            Todavía no hay eventos agendados para esta causa.
          </p>
        )}
      </section>
    </div>
  );
}
