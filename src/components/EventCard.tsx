import Link from "next/link";

type Evento = {
  id: string;
  titulo: string;
  descripcion: string | null;
  modalidad: string;
  ciudad: string | null;
  lugar: string | null;
  luma_url: string | null;
  inicia_en: string;
  duracion_min: number;
  estado: string;
  causes?: { id: string; titulo: string } | null;
};

export function formatoFecha(iso: string) {
  return new Date(iso).toLocaleString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EventCard({ evento }: { evento: Evento }) {
  const pasado = new Date(evento.inicia_en) < new Date();
  const cancelado = evento.estado === "cancelado";
  const porAgendar = evento.estado === "por_agendar";

  return (
    <Link
      href={`/eventos/${evento.id}`}
      className="flex flex-col rounded-2xl border border-[#E3DFD2] bg-white p-5 transition hover:border-[#CFC9B8] hover:shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-2">
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
        {porAgendar && !cancelado && (
          <span className="rounded-full bg-[#FAEEDA] px-2.5 py-1 text-[11px] font-medium text-[#854F0B]">
            Por agendar
          </span>
        )}
        {!cancelado && !porAgendar && pasado && (
          <span className="rounded-full bg-[#EDEADF] px-2.5 py-1 text-[11px] font-medium text-[#6B6B60]">
            Ya ocurrió
          </span>
        )}
      </div>

      <p className="mt-3 text-sm font-medium capitalize text-[#40573F]">
        {formatoFecha(evento.inicia_en)}
      </p>
      <h3 className="mt-1 text-base font-semibold leading-snug text-[#2B2B26]">{evento.titulo}</h3>

      {evento.causes && (
        <p className="mt-1 text-xs text-[#9A9A8E]">Causa: {evento.causes.titulo}</p>
      )}

      {evento.descripcion && (
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[#6B6B60]">
          {evento.descripcion}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-[#EDEADF] pt-3 text-xs">
        <span className="truncate text-[#6B6B60]">
          {evento.modalidad === "presencial"
            ? evento.lugar || evento.ciudad || "Lugar por definir"
            : "En línea"}
        </span>
        <span className={evento.luma_url ? "font-medium text-[#40573F]" : "text-[#9A9A8E]"}>
          {evento.luma_url ? "Inscripciones abiertas" : "Sin inscripciones"}
        </span>
      </div>
    </Link>
  );
}
