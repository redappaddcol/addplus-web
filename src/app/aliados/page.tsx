import Link from "next/link";

const formas = [
  {
    titulo: "Alianza visible",
    texto:
      "Tu marca aparece junto a la causa que acompañas. Sirve cuando la organización quiere que su compromiso sea público y verificable, no un renglón en un informe de sostenibilidad.",
    detalle: ["Logo en la causa y en los eventos", "Mención en las convocatorias", "Reporte de impacto al cierre"],
    destacada: true,
  },
  {
    titulo: "Alianza invisible",
    texto:
      "Aportas sin figurar. Para entidades cuyo interés es puramente social, o que por su naturaleza prefieren no asociar su nombre públicamente a una causa.",
    detalle: ["Aporte sin exposición de marca", "Acceso al mismo reporte de impacto", "Confidencialidad del acuerdo"],
    destacada: false,
  },
];

const aportes = [
  {
    titulo: "Recursos",
    texto: "Financiación directa de una causa con meta económica, o cubrir un costo puntual del plan de acción.",
  },
  {
    titulo: "Conocimiento",
    texto: "Prestar el equipo técnico que ya tienes: datos, laboratorios, asesoría legal, diseño.",
  },
  {
    titulo: "Convocatoria",
    texto: "Movilizar a tus colaboradores, estudiantes o afiliados como voluntarios de la causa.",
  },
  {
    titulo: "Infraestructura",
    texto: "Espacios para los eventos, logística, herramientas o plataformas que la causa necesite.",
  },
];

export default function AliadosPage() {
  return (
    <div>
      <section className="mx-auto max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-wide text-[#9A9A8E]">
          Entidades aliadas
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-[#2B2B26] sm:text-4xl">
          Ninguna causa grande
          <br />
          <span className="text-[#40573F]">la sostuvo una sola persona.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[#4A4A42]">
          Empresas, universidades, fundaciones y entidades públicas que ponen algo concreto sobre la
          mesa: recursos, conocimiento, convocatoria o infraestructura. No patrocinio de logo; una
          causa específica con un plan que puedes seguir.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/registro"
            className="rounded-full bg-[#40573F] px-6 py-2.5 text-sm font-medium text-[#F7F5EE] transition hover:bg-[#33472F]"
          >
            Quiero aliarme
          </Link>
          <Link
            href="/causas"
            className="rounded-full border border-[#CFC9B8] px-6 py-2.5 text-sm font-medium text-[#4A4A42] transition hover:bg-[#EDEADF]"
          >
            Ver causas abiertas
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-lg font-semibold text-[#2B2B26]">Dos formas de aliarse</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {formas.map((f) => (
            <div
              key={f.titulo}
              className={`rounded-2xl border p-7 ${
                f.destacada
                  ? "border-[#40573F] bg-[#E7EDE4]"
                  : "border-[#E3DFD2] bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold text-[#2B2B26]">{f.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4A4A42]">{f.texto}</p>
              <ul className="mt-5 space-y-2">
                {f.detalle.map((d) => (
                  <li key={d} className="flex gap-2.5 text-sm text-[#6B6B60]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#40573F]" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-lg font-semibold text-[#2B2B26]">Qué puedes aportar</h2>
        <p className="mt-1 text-sm text-[#6B6B60]">
          No siempre es plata. A veces lo que desatasca una causa es una llamada o un espacio.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {aportes.map((a) => (
            <div key={a.titulo} className="rounded-2xl border border-[#E3DFD2] bg-white p-6">
              <h3 className="font-semibold text-[#2B2B26]">{a.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6B6B60]">{a.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl rounded-2xl border border-[#E3DFD2] bg-white p-10">
        <h2 className="text-lg font-semibold text-[#2B2B26]">Cómo funciona</h2>
        <ol className="mt-6 space-y-5">
          {[
            "Nos cuentas qué puede aportar tu entidad y qué temas le interesan.",
            "Te mostramos las causas abiertas donde ese aporte hace la diferencia.",
            "Eliges una causa y definimos juntos el alcance y la modalidad de la alianza.",
            "Al cierre recibes el reporte de qué se logró y con qué recursos.",
          ].map((paso, i) => (
            <li key={paso} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EDEADF] text-xs font-semibold text-[#40573F]">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-[#4A4A42]">{paso}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-16 max-w-4xl rounded-2xl bg-[#40573F] p-10 text-center">
        <h2 className="text-2xl font-bold text-white">Hablemos de una causa concreta</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#D8DDD2]">
          Regístrate como entidad aliada y te contactamos con las causas donde tu aporte tiene el
          mayor efecto.
        </p>
        <Link
          href="/registro"
          className="mt-7 inline-block rounded-full bg-[#F7F5EE] px-7 py-3 text-sm font-medium text-[#2B2B26] transition hover:bg-white"
        >
          Quiero aliarme
        </Link>
      </section>
    </div>
  );
}
