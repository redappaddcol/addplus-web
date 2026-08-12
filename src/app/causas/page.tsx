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
    .select("id, titulo, descripcion, ciudad, estado, tiene_meta_economica, voluntarios_requeridos, categories(nombre)")
    .order("creado_en", { ascending: false });

  if (categoria) {
    query = query.eq("categoria_id", categoria);
  }

  const { data: causes } = await query;

  return (
    <div>
      <div className="mb-8 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 p-8 text-white">
        <h1 className="text-2xl font-bold">Causas que necesitan voluntarios</h1>
        <p className="mt-2 max-w-2xl text-orange-50">
          Descubre iniciativas creadas por gestores de causas, súmate como voluntario y ayuda a
          convertir causas &quot;perdidas&quot; en causas posibles.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <a
          href="/causas"
          className={`rounded-full border px-3 py-1 text-sm ${
            !categoria ? "border-orange-600 bg-orange-600 text-white" : "border-neutral-300 text-neutral-700"
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
                ? "border-orange-600 bg-orange-600 text-white"
                : "border-neutral-300 text-neutral-700"
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
