import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CauseCard from "@/components/CauseCard";

const metodologia = [
  {
    titulo: "Diagnóstico",
    texto: "Dónde estamos hoy: fuerzas, debilidades y contexto real de la causa.",
    color: "#40573F",
    fondo: "#E7EDE4",
  },
  {
    titulo: "Diseño",
    texto: "A dónde queremos llegar: objetivos, públicos y mensajes.",
    color: "#C25F32",
    fondo: "#FBEAE0",
  },
  {
    titulo: "Plan de acción",
    texto: "Cómo lo logramos: tácticas, indicadores y equipo que ejecuta.",
    color: "#3D6B96",
    fondo: "#E4EDF6",
  },
];

const causasHistoricas = [
  "Abolición de la esclavitud",
  "Sufragio femenino",
  "Independencia de las naciones",
  "Igualdad de derechos",
];

export default async function LandingPage() {
  const supabase = await createClient();

  const { data: causas, error } = await supabase
    .from("causes")
    .select(
      "id, titulo, descripcion, ciudad, estado, tiene_meta_economica, voluntarios_requeridos, imagen_url, categories(nombre), applications(estado)"
    )
    .eq("estado", "activa")
    .order("creado_en", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error cargando causas:", error);
  }

  const hayCausas = !!causas && causas.length > 0;

  return (
    <div className="relative left-1/2 -my-8 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-hidden bg-[#F7F5EE] text-[#2B2B26]">
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=75"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#20291D]/70" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pb-40 pt-24 sm:pt-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Hay causas que parecen perdidas.
              <br />
              Solo les falta gente.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#E4E2D6]">
              El sufragio femenino fue una causa perdida. La abolición de la esclavitud fue una
              causa perdida. Lo que las volvió posibles no fue el dinero: fue la sinergia de mucha
              gente trabajando por lo mismo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/causas"
                className="inline-flex items-center gap-2 rounded-full bg-[#F7F5EE] px-7 py-3 font-medium text-[#2B2B26] transition hover:bg-white"
              >
                Súmate
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#2B2B26] text-sm">
                  +
                </span>
              </Link>
              <Link
                href="/registro"
                className="rounded-full border border-white/60 px-7 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Publica tu causa
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 mx-auto -mt-28 max-w-6xl px-5">
        <div>
          <div className="rounded-2xl border border-[#E3DFD2] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-end justify-between">
              <h2 className="text-xl font-semibold">Causas en progreso</h2>
              <Link href="/causas" className="text-sm text-[#40573F] underline">
                Ver todas
              </Link>
            </div>

            {hayCausas ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {causas.map((causa: any) => (
                  <CauseCard key={causa.id} cause={causa} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#CFC9B8] p-8 text-center">
                <p className="font-medium">Aún no hay causas publicadas</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-[#6B6B60]">
                  La primera causa marca el inicio. Si tienes una que parece perdida, publícala y
                  empieza a sumar gente.
                </p>
                <Link
                  href="/causas/nueva"
                  className="mt-5 inline-block rounded-full bg-[#40573F] px-6 py-2.5 text-sm font-medium text-[#F7F5EE] transition hover:bg-[#33472F]"
                >
                  Publicar la primera causa
                </Link>
              </div>
            )}
          </div>

        </div>
      </section>


      <section className="mx-auto mt-20 max-w-6xl px-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-[#E3DFD2] bg-white p-7">
            <p className="text-xs font-medium uppercase tracking-wide text-[#9A9A8E]">
              Para expertos
            </p>
            <h3 className="mt-2 text-xl font-semibold text-[#2B2B26]">Panel de expertos</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-[#6B6B60]">
              Una causa sin criterio técnico se queda en buena intención. El panel valida
              diagnósticos, aterriza los diseños y revisa que el plan de acción sea viable.
            </p>
            <Link
              href="/expertos"
              className="mt-6 inline-block self-start rounded-full bg-[#40573F] px-6 py-2.5 text-sm font-medium text-[#F7F5EE] transition hover:bg-[#33472F]"
            >
              Conocer el panel
            </Link>
          </div>

          <div className="flex flex-col rounded-2xl border border-[#E3DFD2] bg-white p-7">
            <p className="text-xs font-medium uppercase tracking-wide text-[#9A9A8E]">
              Para organizaciones
            </p>
            <h3 className="mt-2 text-xl font-semibold text-[#2B2B26]">Entidades aliadas</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-[#6B6B60]">
              Empresas, universidades y fundaciones que ponen recursos, conocimiento o
              convocatoria. De forma visible con tu marca, o invisible si tu interés es
              puramente social.
            </p>
            <Link
              href="/aliados"
              className="mt-6 inline-block self-start rounded-full border border-[#CFC9B8] px-6 py-2.5 text-sm font-medium text-[#4A4A42] transition hover:bg-[#EDEADF]"
            >
              Quiero aliarme
            </Link>
          </div>
        </div>
      </section>
      <section id="nosotros" className="scroll-mt-20 px-5 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-wider text-[#7B8B6F]">Nosotros</p>
          <h2 className="mt-2 text-3xl font-semibold">Nos dedicamos a ver donde nadie ve</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-[#4A4A42]">
            Add + no administra dinero. Es una fábrica de sinergias: conecta a quien vive un
            problema con quien tiene el conocimiento, el tiempo o la voluntad de ayudar a
            resolverlo. Las causas se descubren, se hacen visibles y se trabajan en equipo hasta
            volverlas posibles.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {causasHistoricas.map((c) => (
              <span
                key={c}
                className="rounded-full border border-[#CFC9B8] bg-white px-4 py-1.5 text-sm text-[#4A4A42]"
              >
                {c}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#9A9A8E]">
            Todas fueron causas perdidas. Todas se volvieron posibles.
          </p>
        </div>
      </section>

      <section id="colaborar" className="scroll-mt-20 border-y border-[#E3DFD2] bg-[#EDEADF] px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium uppercase tracking-wider text-[#7B8B6F]">Colaborar</p>
          <h2 className="mt-2 text-3xl font-semibold">Cada causa se trabaja con método</h2>
          <p className="mt-4 max-w-2xl text-[#4A4A42]">
            No son buenas intenciones sueltas. Cada causa recorre tres etapas hasta convertirse en
            una propuesta viable que un aliado pueda ejecutar.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {metodologia.map((m, i) => (
              <div key={m.titulo} className="rounded-2xl border border-[#E3DFD2] bg-white p-6">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-semibold"
                  style={{ background: m.fondo, color: m.color }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{m.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B6B60]">{m.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="px-5 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl bg-[#2E3A29] px-8 py-14 text-center">
          <h2 className="text-3xl font-semibold text-white">Súmate con el +</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-[#C9CFC0]">
            Nadie puede participar en lo que no conoce. Empieza por descubrir las causas que ya
            están en marcha, o publica la que a ti te quita el sueño.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/causas"
              className="rounded-full bg-[#F7F5EE] px-7 py-3 font-medium text-[#2B2B26] transition hover:bg-white"
            >
              Explorar causas
            </Link>
            <Link
              href="/registro"
              className="rounded-full border border-white/40 px-7 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Crear mi cuenta
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E3DFD2] px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[#9A9A8E] sm:flex-row">
          <p>Motiv Comunicaciones · Add + © 2026</p>
          <nav className="flex gap-5">
            <Link href="/causas" className="transition hover:text-[#40573F]">Causas</Link>
            <Link href="/#colaborar" className="transition hover:text-[#40573F]">Colaborar</Link>
            <Link href="/expertos" className="transition hover:text-[#40573F]">Expertos</Link>
            <Link href="/aliados" className="transition hover:text-[#40573F]">Aliados</Link>
            <Link href="/#nosotros" className="transition hover:text-[#40573F]">Nosotros</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
