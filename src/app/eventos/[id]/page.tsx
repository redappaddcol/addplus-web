import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { vincularLuma, cancelEvent } from "@/lib/actions";
import { formatoFecha } from "@/components/EventCard";

export default async function EventoDetallePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const { id } = await params;
  const { ok } = await searchParams;
  const supabase = await createClient();

  const { data: evento } = await supabase
    .from("events")
    .select("*, causes(id, titulo), profiles(nombre)")
    .eq("id", id)
    .single();

  if (!evento) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  const esDueno = !!user && user.id === evento.gestor_id;
  const pasado = new Date(evento.inicia_en) < new Date();
  const cancelado = evento.estado === "cancelado";

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/eventos" className="text-sm text-[#40573F] underline">
        ← Todos los eventos
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
            evento.modalidad === "virtual"
              ? "bg-[#E4EDF6] text-[#3D6B96]"
              : "bg-[#E7EDE4] text-[#40573F]"
          }`}
        >
          {evento.modalidad === "virtual" ? "Virtual" : "Presencial"}
        </span>
        {cancelado && (
          <span className="rounded-full bg-[#FBEAE0] px-2.5 py-1 text-[11px] font-medium text-[#C25F32]">
            Cancelado
          </span>
        )}
      </div>

      <h1 className="mt-3 text-2xl font-bold">{evento.titulo}</h1>
      <p className="mt-1 text-sm capitalize text-[#40573F]">{formatoFecha(evento.inicia_en)}</p>
      <p className="mt-1 text-sm text-[#9A9A8E]">
        Dura {evento.duracion_min} minutos · Organiza {evento.profiles?.nombre}
      </p>

      {evento.causes && (
        <Link
          href={`/causas/${evento.causes.id}`}
          className="mt-4 block rounded-xl border border-[#E3DFD2] bg-white p-4 transition hover:border-[#CFC9B8]"
        >
          <p className="text-[11px] uppercase tracking-wider text-[#9A9A8E]">Causa</p>
          <p className="mt-1 font-medium text-[#2B2B26]">{evento.causes.titulo}</p>
        </Link>
      )}

      {evento.descripcion && (
        <p className="mt-6 whitespace-pre-line leading-relaxed text-[#4A4A42]">
          {evento.descripcion}
        </p>
      )}

      <div className="mt-6 rounded-xl border border-[#E3DFD2] bg-white p-4 text-sm">
        {evento.modalidad === "presencial" ? (
          <>
            <p className="font-medium">{evento.lugar || "Lugar por confirmar"}</p>
            <p className="text-[#6B6B60]">{evento.ciudad}</p>
          </>
        ) : (
          <>
            <p className="font-medium">Evento en línea</p>
            <p className="text-[#6B6B60]">
              El enlace de conexión se comparte al inscribirte en Luma.
            </p>
          </>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-[#E3DFD2] bg-white p-5">
        {ok && (
          <p className="mb-3 rounded bg-[#E7EDE4] p-2 text-sm text-[#40573F]">
            Evento vinculado a Luma. Ya se pueden inscribir.
          </p>
        )}

        {cancelado ? (
          <p className="text-sm text-[#6B6B60]">Este evento fue cancelado.</p>
        ) : pasado ? (
          <p className="text-sm text-[#6B6B60]">Este evento ya ocurrió.</p>
        ) : evento.luma_url ? (
          <>
            <p className="font-semibold">Reserva tu cupo</p>
            <p className="mt-1 text-sm text-[#6B6B60]">
              La inscripción, los recordatorios y el calendario los gestiona Luma.
            </p>
            <a
              href={evento.luma_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-full bg-[#40573F] px-6 py-2.5 text-sm font-medium text-[#F7F5EE] transition hover:bg-[#33472F]"
            >
              Inscribirme en Luma
            </a>
          </>
        ) : (
          <>
            <p className="font-semibold">Inscripciones aún no abiertas</p>
            <p className="mt-1 text-sm text-[#6B6B60]">
              Este evento todavía no tiene página de registro en Luma.
            </p>
          </>
        )}
      </div>

      {esDueno && (
        <div className="mt-6 rounded-xl border border-[#E3DFD2] bg-white p-5">
          <p className="font-semibold">Panel del organizador</p>

          <form action={vincularLuma.bind(null, id)} className="mt-4">
            <label className="block text-xs text-[#6B6B60]">
              Enlace del evento en Luma
            </label>
            <input
              name="luma_url"
              defaultValue={evento.luma_url ?? ""}
              placeholder="https://luma.com/..."
              className="mt-1 w-full rounded border border-[#CFC9B8] bg-white p-2 text-sm"
            />
            <button className="mt-3 rounded-full bg-[#40573F] px-5 py-2 text-xs font-medium text-[#F7F5EE] transition hover:bg-[#33472F]">
              Guardar enlace
            </button>
          </form>

          {!cancelado && !pasado && (
            <form action={cancelEvent.bind(null, id)} className="mt-4 border-t border-[#EDEADF] pt-4">
              <button className="rounded-full border border-[#CFC9B8] px-4 py-2 text-xs text-[#4A4A42] transition hover:bg-[#EDEADF]">
                Cancelar evento
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
