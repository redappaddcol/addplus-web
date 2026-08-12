import Link from "next/link";
import Salvavidas from "@/components/Salvavidas";

type Cause = {
  id: string;
  titulo: string;
  descripcion: string;
  ciudad: string | null;
  estado: string;
  tiene_meta_economica: boolean;
  voluntarios_requeridos: number;
  imagen_url?: string | null;
  categories: { nombre: string } | null;
  applications?: { estado: string }[];
};

const imagenesPorDefecto = [
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=70",
];

function hashIndice(id: string, total: number) {
  let suma = 0;
  for (let i = 0; i < id.length; i++) suma += id.charCodeAt(i);
  return suma % total;
}

export default function CauseCard({ cause }: { cause: Cause }) {
  const aceptados = (cause.applications ?? []).filter((a) => a.estado === "aceptada").length;
  const requeridos = Math.max(1, cause.voluntarios_requeridos);
  const progreso = cause.estado === "cerrada" ? 100 : (aceptados / requeridos) * 100;
  const imagen =
    cause.imagen_url || imagenesPorDefecto[hashIndice(cause.id, imagenesPorDefecto.length)];

  return (
    <Link
      href={`/causas/${cause.id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-[#E3DFD2] bg-white transition hover:border-[#CFC9B8] hover:shadow-sm"
    >
      <div className="relative h-36 w-full overflow-hidden bg-[#EDEADF]">
        <img src={imagen} alt="" className="h-full w-full object-cover" />
        {cause.tiene_meta_economica && (
          <span className="absolute right-2 top-2 rounded-full bg-[#E07A4F] px-2.5 py-1 text-[11px] font-medium text-white">
            Con aporte
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#7B8B6F]">
          {cause.categories?.nombre ?? "General"}
        </span>
        <h3 className="mt-1 text-base font-semibold leading-snug text-[#2B2B26]">{cause.titulo}</h3>

        <div className="mt-3 flex items-start justify-between gap-3">
          <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-[#6B6B60]">
            {cause.descripcion}
          </p>
          <Salvavidas progreso={progreso} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#EDEADF] pt-3 text-center">
          <div>
            <p className="text-sm font-semibold text-[#2B2B26]">{aceptados}</p>
            <p className="text-[10px] uppercase tracking-wider text-[#9A9A8E]">Voluntarios</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#2B2B26]">{requeridos}</p>
            <p className="text-[10px] uppercase tracking-wider text-[#9A9A8E]">Meta</p>
          </div>
          <div>
            <p className="truncate text-sm font-semibold text-[#2B2B26]">
              {cause.ciudad || "—"}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[#9A9A8E]">Ciudad</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
