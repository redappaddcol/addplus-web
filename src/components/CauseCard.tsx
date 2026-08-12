import Link from "next/link";

type Cause = {
  id: string;
  titulo: string;
  descripcion: string;
  ciudad: string | null;
  estado: string;
  tiene_meta_economica: boolean;
  voluntarios_requeridos: number;
  categories: { nombre: string } | null;
};

const estadoColor: Record<string, string> = {
  activa: "bg-emerald-100 text-emerald-700",
  en_curso: "bg-blue-100 text-blue-700",
  cerrada: "bg-neutral-200 text-neutral-600",
};

export default function CauseCard({ cause }: { cause: Cause }) {
  return (
    <Link
      href={`/causas/${cause.id}`}
      className="block rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-orange-600">
          {cause.categories?.nombre ?? "General"}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${estadoColor[cause.estado]}`}>
          {cause.estado.replace("_", " ")}
        </span>
      </div>
      <h3 className="text-lg font-semibold">{cause.titulo}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{cause.descripcion}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
        <span>{cause.ciudad || "Sin ciudad"}</span>
        <span>{cause.voluntarios_requeridos} voluntarios</span>
      </div>
      {cause.tiene_meta_economica && (
        <span className="mt-2 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
          Con aporte económico
        </span>
      )}
    </Link>
  );
}
