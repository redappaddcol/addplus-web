import { createClient } from "@/lib/supabase/server";
import CauseCard from "@/components/CauseCard";

export default async function CausasPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, nombre")
    .order("nombre");

  let query = supabase
    .from("causes")
    .select("id, titulo, descripcion, ciudad, estado, tiene_meta_economica, voluntarios_requeridos, imagen_url, categories(nombre), applications(estado)")
    .order("creado_en", { ascending: false });

  if (categoria) {
    query = query.eq("categoria_id", categoria);
  }

  const { data: causes } = await query;

  return (
    <div>
      <div className="mb-8 rounded-xl bg-gradient-to-r from-[#40573F] to-[#2E3A29] p-8 text-white">
        <h1 className="text-2xl font-bold">Causas que necesitan voluntarios</h1>
        <p className="mt-2 max-w-2xl text-[#D8DDD2]">
          Descubre iniciativas creadas por gestores de causas, súmate como voluntario y ayuda a
          convertir causas &quot;perdidas&quot; en causas posibles.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <a
          href="/causas"
          className={`rounded-full border px-3 py-1 text-sm ${
            !categoria ? "border-[#40573F] bg-[#40573F] text-white" : "border-[#CFC9B8] text-[#4A4A42]"
          }`}
        >
          Todas
        </a>
        {categories?.map((c) => (
          <a
            key={c.id}
            href={`/causas?categoria=${c.id}`}
            className={`rounded-full border px-3 py-1 text-sm ${
              categoria === String(c.id)
                ? "border-[#40573F] bg-[#40573F] text-white"
                : "border-[#CFC9B8] text-[#4A4A42]"
            }`}
          >
            {c.nombre}
          </a>
        ))}
      </div>

      {causes && causes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {causes.map((cause: any) => (
            <CauseCard key={cause.id} cause={cause} />
          ))}
        </div>
      ) : (
        <p className="text-neutral-500">
          Todavía no hay causas publicadas. Si eres gestor, inicia sesión y crea la primera.
        </p>
      )}
    </div>
  );
}
