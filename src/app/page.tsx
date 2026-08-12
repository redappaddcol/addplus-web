import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CauseCard from "@/components/CauseCard";

const etapas = [
  {
    numero: "01",
    titulo: "Diagnóstico",
    texto: "Dónde estamos. Se analiza la situación de la causa y se identifican sus fuerzas y debilidades.",
  },
  {
    numero: "02",
    titulo: "Diseño",
    texto: "A dónde queremos llegar. Se definen objetivos, públicos y mensajes de la causa.",
  },
  {
    numero: "03",
    titulo: "Plan de acción",
    texto: "Cómo lo logramos. Tácticas, indicadores y un equipo de voluntarios que lo ejecuta.",
  },
];

const causasHistoricas = [
  "Abolición de la esclavitud",
  "Sufragio femenino",
  "Independencia de las naciones",
  "Lucha por la igualdad de derechos",
];

export default async function LandingPage() {
  const supabase = await createClient();

  const { data: causas } = await supabase
    .from("causes")
    .select(
      "id, titulo, descripcion, ciudad, estado, tiene_meta_economica, voluntarios_requeridos, categories(nombre)"
    )
    .eq("estado", "activa")
    .order("creado_en", { ascending: false })
    .limit(3);

  return (
    <div className="-mx-4 -my-8">
      <section className="bg-gradient-to-b from-orange-600 to-red-600 px-4 py-20 text-center text-white">
        <p className="mb-4 text-sm uppercase tracking-widest text-orange-100">
          Comunicación que cambia el mundo
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          Hay causas que parecen perdidas.
          <br />
          Solo les falta gente.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-orange-50">
          El sufragio femenino fue una causa perdida. La abolición de la esclavitud fue una causa
          perdida. Lo que las volvió posibles no fue el dinero: fue la sinergia de mucha gente
          trabajando por lo mismo.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/causas"
            className="rounded-lg bg-white px-6 py-3 font-medium text-orange-700 transition hover:bg-orange-50"
          >
            Súmate a una causa
          </Link>
          <Link
            href="/registro"
            className="rounded-lg border border-white/70 px-6 py-3 font-medium text-white transition hover:bg-white/10"
          >
            Publica la tuya
          </Link>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold">Nos dedicamos a ver donde nadie ve</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-neutral-700">
            Add + no administra dinero. Es una fábrica de sinergias: conecta a quien vive un
            problema con quien tiene el conocimiento, el tiempo o la voluntad de ayudar a
            resolverlo. Las causas se descubren, se hacen visibles y se trabajan en equipo hasta
            volverlas posibles.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {causasHistoricas.map((c) => (
              <span
                key={c}
                className="rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-600"
              >
                {c}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            Todas fueron causas perdidas. Todas se volvieron posibles.
          </p>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-neutral-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold">Cada causa se trabaja con método</h2>
          <p className="mt-3 max-w-2xl text-neutral-600">
            No son buenas intenciones sueltas. Cada causa recorre tres etapas hasta convertirse en
            una propuesta viable.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {etapas.map((e) => (
              <div key={e.numero} className="rounded-lg border border-neutral-200 bg-white p-5">
                <span className="text-sm font-medium text-orange-600">{e.numero}</span>
                <h3 className="mt-2 text-lg font-semibold">{e.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{e.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {causas && causas.length > 0 && (
        <section className="border-b border-neutral-200 bg-white px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-2xl font-bold">Causas que necesitan voluntarios</h2>
              <Link href="/causas" className="text-sm text-orange-600 underline">
                Ver todas
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {causas.map((causa: any) => (
                <CauseCard key={causa.id} cause={causa} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-neutral-900 px-4 py-16 text-center text-white">
        <h2 className="text-2xl font-bold">Súmate con el +</h2>
        <p className="mx-auto mt-3 max-w-xl leading-relaxed text-neutral-300">
          Nadie puede participar en lo que no conoce. Empieza por descubrir las causas que ya están
          en marcha, o publica la que a ti te quita el sueño.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/causas"
            className="rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition hover:bg-orange-700"
          >
            Explorar causas
          </Link>
          <Link
            href="/registro"
            className="rounded-lg border border-neutral-600 px-6 py-3 font-medium text-white transition hover:bg-neutral-800"
          >
            Crear mi cuenta
          </Link>
        </div>
      </section>
    </div>
  );
}
