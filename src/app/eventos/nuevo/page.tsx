import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createEvent } from "@/lib/actions";

export default async function NuevoEventoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; causa?: string }>;
}) {
  const { error, causa } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: causas } = await supabase
    .from("causes")
    .select("id, titulo")
    .eq("gestor_id", user.id)
    .order("creado_en", { ascending: false });

  if (!causas || causas.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-2xl font-bold">Crear evento</h1>
        <p className="mt-4 text-[#6B6B60]">
          Los eventos se agendan dentro de una causa. Publica tu primera causa y vuelve aquí.
        </p>
        <a
          href="/causas/nueva"
          className="mt-6 inline-block rounded-full bg-[#40573F] px-6 py-2.5 text-sm font-medium text-[#F7F5EE]"
        >
          Publicar una causa
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">Crear evento</h1>
      <p className="mt-1 text-sm text-[#6B6B60]">
        Agenda una sesión para explicar tu causa y convocar voluntarios.
      </p>

      {error && <p className="mt-3 rounded bg-[#FBEAE0] p-2 text-sm text-[#C25F32]">{error}</p>}

      <form action={createEvent} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Causa</label>
          <select
            name="cause_id"
            defaultValue={causa}
            required
            className="mt-1 w-full rounded border border-[#CFC9B8] bg-white p-2"
          >
            {causas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.titulo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Título del evento</label>
          <input
            name="titulo"
            required
            placeholder="Sesión abierta: cómo vamos con Transmilenio"
            className="mt-1 w-full rounded border border-[#CFC9B8] bg-white p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">De qué se trata</label>
          <textarea
            name="descripcion"
            required
            rows={5}
            placeholder="Qué vas a explicar, para quién es y qué se espera de quien asista."
            className="mt-1 w-full rounded border border-[#CFC9B8] bg-white p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Fecha</label>
            <input
              type="date"
              name="fecha"
              required
              className="mt-1 w-full rounded border border-[#CFC9B8] bg-white p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Hora</label>
            <input
              type="time"
              name="hora"
              defaultValue="18:00"
              required
              className="mt-1 w-full rounded border border-[#CFC9B8] bg-white p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Duración (minutos)</label>
            <input
              type="number"
              name="duracion_min"
              min={15}
              step={15}
              defaultValue={60}
              className="mt-1 w-full rounded border border-[#CFC9B8] bg-white p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Ciudad</label>
            <input
              name="ciudad"
              defaultValue="Bogotá"
              className="mt-1 w-full rounded border border-[#CFC9B8] bg-white p-2"
            />
          </div>
        </div>

        <div className="rounded border border-[#E3DFD2] p-4">
          <label className="block text-sm font-medium">Modalidad</label>
          <select
            name="modalidad"
            defaultValue="virtual"
            className="mt-1 w-full rounded border border-[#CFC9B8] bg-white p-2"
          >
            <option value="virtual">Virtual</option>
            <option value="presencial">Presencial</option>
          </select>

          <div className="mt-4">
            <label className="block text-xs text-[#6B6B60]">Si es presencial: lugar</label>
            <input
              name="lugar"
              placeholder="Universidad EAN - Edificio Legacy"
              className="mt-1 w-full rounded border border-[#CFC9B8] bg-white p-2"
            />
          </div>
        </div>

        <div className="rounded border border-[#E3DFD2] p-4">
          <label className="block text-sm font-medium">Enlace de Luma</label>
          <input
            name="luma_url"
            placeholder="https://luma.com/..."
            className="mt-1 w-full rounded border border-[#CFC9B8] bg-white p-2"
          />
          <p className="mt-2 text-xs text-[#9A9A8E]">
            Crea el evento en Luma y pega aquí su enlace. Luma gestiona inscripciones,
            recordatorios y calendario. Si lo dejas vacío, el evento queda como
            &quot;por agendar&quot; y podrás pegarlo después.
          </p>
        </div>

        <button className="rounded-full bg-[#40573F] px-6 py-2.5 font-medium text-[#F7F5EE] transition hover:bg-[#33472F]">
          Publicar evento
        </button>
      </form>
    </div>
  );
}
