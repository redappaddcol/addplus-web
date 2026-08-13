import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import EventCard from "@/components/EventCard";

export default async function EventosPage({
  searchParams,
}: {
  searchParams: Promise<{ modalidad?: string }>;
}) {
  const { modalidad } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  let esGestor = false;
  if (user) {
    const { data } = await supabase.from("profiles").select("rol").eq("id", user.id).single();
    esGestor = data?.rol === "gestor";
  }

  const ahora = new Date().toISOString();

  let q = supabase
    .from("events")
    .select("*, causes(id, titulo)")
    .gte("inicia_en", ahora)
    .neq("estado", "cancelado")
    .order("inicia_en", { ascending: true });

  if (modalidad) q = q.eq("modalidad", modalidad);

  const { data: proximos } = await q;

  const { data: pasados } = await supabase
    .from("events")
    .select("*, causes(id, titulo)")
    .lt("inicia_en", ahora)
    .order("inicia_en", { ascending: false })
    .limit(3);

  return (
    <div>
      <div className="mb-8 rounded-xl bg-gradient-to-r from-[#40573F] to-[#2E3A29] p-8 text-white">
        <h1 className="text-2xl font-bold">Eventos</h1>
        <p className="mt-2 max-w-2xl text-[#D8DDD2]">
          Los gestores explican sus causas en vivo: qué problema atacan, en qué van y cómo puedes
          sumarte. Las inscripciones se gestionan en Luma.
        </p>
        {esGestor && (
          <Link
            href="/eventos/nuevo"
            className="mt-5 inline-block rounded-full bg-[#F7F5EE] px-5 py-2 text-sm font-medium text-[#2B2B26] transition hover:bg-white"
          >
            + Crear evento
          </Link>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { k: "", n: "Todos" },
          { k: "virtual", n: "Virtuales" },
          { k: "presencial", n: "Presenciales" },
        ].map((f) => (
          <a
            key={f.n}
            href={f.k ? `/eventos?modalidad=${f.k}` : "/eventos"}
            className={`rounded-full border px-3 py-1 text-sm ${
              (modalidad || "") === f.k
                ? "border-[#40573F] bg-[#40573F] text-white"
                : "border-[#CFC9B8] text-[#4A4A42]"
            }`}
          >
            {f.n}
          </a>
        ))}
      </div>

      {proximos && proximos.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {proximos.map((e: any) => (
            <EventCard key={e.id} evento={e} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#CFC9B8] p-10 text-center">
          <p className="font-medium">No hay eventos programados</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#6B6B60]">
            Cuando un gestor agende una sesión para explicar su causa, aparecerá aquí.
          </p>
        </div>
      )}

      {pasados && pasados.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-lg font-semibold text-[#4A4A42]">Eventos anteriores</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pasados.map((e: any) => (
              <EventCard key={e.id} evento={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
