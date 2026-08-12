import { createClient } from "@/lib/supabase/server";
import { createCause } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function NuevaCausaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: categories } = await supabase.from("categories").select("id, nombre").order("nombre");

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">Crear causa</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Publica tu causa para que voluntarios puedan sumarse a ejecutarla.
      </p>

      {error && <p className="mt-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      <form action={createCause} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Título</label>
          <input name="titulo" required className="mt-1 w-full rounded border border-neutral-300 p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Descripción</label>
          <textarea
            name="descripcion"
            required
            rows={5}
            className="mt-1 w-full rounded border border-neutral-300 p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Categoría</label>
            <select name="categoria_id" className="mt-1 w-full rounded border border-neutral-300 p-2">
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Ciudad</label>
            <input name="ciudad" className="mt-1 w-full rounded border border-neutral-300 p-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Voluntarios requeridos</label>
          <input
            type="number"
            name="voluntarios_requeridos"
            min={1}
            defaultValue={1}
            className="mt-1 w-32 rounded border border-neutral-300 p-2"
          />
        </div>

        <div className="rounded border border-neutral-200 p-4">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="tiene_meta_economica" id="meta" className="peer" />
            Esta causa también tiene una meta económica
          </label>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-500">Monto meta (opcional)</label>
              <input name="monto_meta" type="number" className="mt-1 w-full rounded border border-neutral-300 p-2" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500">Enlace externo de aporte (opcional)</label>
              <input name="enlace_aporte" placeholder="https://..." className="mt-1 w-full rounded border border-neutral-300 p-2" />
            </div>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            Add + no procesa pagos: los aportes se hacen a través del enlace o dato que definas aquí.
            Los voluntarios siempre pueden sumarse, tenga o no meta económica.
          </p>
        </div>

        <button className="rounded bg-orange-600 px-5 py-2 font-medium text-white hover:bg-orange-700">
          Publicar causa
        </button>
      </form>
    </div>
  );
}
