import Link from "next/link";

const aportes = [
  {
    letra: "D",
    titulo: "Diagnóstico",
    texto:
      "Ayudas a separar el síntoma del problema. Revisas los datos que hay, señalas los que faltan y evitas que la causa arranque sobre un supuesto equivocado.",
  },
  {
    letra: "D",
    titulo: "Diseño",
    texto:
      "Aterrizas la solución: qué es viable con los recursos reales, qué se ha intentado antes, qué evidencia existe de que funciona.",
  },
  {
    letra: "P",
    titulo: "Plan de acción",
    texto:
      "Ordenas el camino en pasos ejecutables, con responsables y tiempos, para que la energía de los voluntarios no se disperse.",
  },
];

const perfiles = [
  "Academia e investigación",
  "Ingeniería y urbanismo",
  "Salud pública",
  "Derecho y política pública",
  "Ambiente y sostenibilidad",
  "Datos y analítica",
  "Economía y finanzas",
  "Comunicación y movilización",
];

export default function ExpertosPage() {
  return (
    <div>
      <section className="mx-auto max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-wide text-[#9A9A8E]">
          Panel de expertos
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-[#2B2B26] sm:text-4xl">
          Las causas no se ganan solo con voluntad.
          <br />
          <span className="text-[#40573F]">También con criterio.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[#4A4A42]">
          El panel de expertos es el grupo de personas que le pone rigor a lo que la comunidad le
          pone corazón. No ejecutan la causa: la validan, la ordenan y la devuelven convertida en un
          plan que sí se puede seguir.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/registro"
            className="rounded-full bg-[#40573F] px-6 py-2.5 text-sm font-medium text-[#F7F5EE] transition hover:bg-[#33472F]"
          >
            Postularme al panel
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
        <h2 className="text-lg font-semibold text-[#2B2B26]">Dónde entra un experto</h2>
        <p className="mt-1 text-sm text-[#6B6B60]">
          Nuestra metodología tiene tres momentos. Puedes entrar en uno o en los tres.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {aportes.map((a) => (
            <div
              key={a.titulo}
              className="rounded-2xl border border-[#E3DFD2] bg-white p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7EDE4] text-base font-semibold text-[#40573F]">
                {a.letra}
              </span>
              <h3 className="mt-4 font-semibold text-[#2B2B26]">{a.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6B6B60]">{a.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl">
        <div className="grid gap-8 rounded-2xl border border-[#E3DFD2] bg-white p-8 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-[#2B2B26]">Perfiles que buscamos</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B6B60]">
              No hace falta ser doctor en nada. Hace falta haber trabajado el problema de cerca.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {perfiles.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-[#EDEADF] px-3 py-1.5 text-xs font-medium text-[#4A4A42]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#2B2B26]">Qué implica en tiempo</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#6B6B60]">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#40573F]" />
                Revisar una causa y dejar tus observaciones por escrito.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#40573F]" />
                Participar en la sesión abierta donde el gestor explica la iniciativa.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#40573F]" />
                Estar disponible para consultas puntuales durante la ejecución.
              </li>
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-[#9A9A8E]">
              Es voluntario. Tú defines cuántas causas acompañas y en qué momento entras.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl rounded-2xl bg-[#40573F] p-10 text-center">
        <h2 className="text-2xl font-bold text-white">
          ¿Tienes el criterio que a una causa le falta?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#D8DDD2]">
          Regístrate y cuéntanos en qué has trabajado. Te contactamos cuando llegue una causa donde
          tu experiencia mueva la aguja.
        </p>
        <Link
          href="/registro"
          className="mt-7 inline-block rounded-full bg-[#F7F5EE] px-7 py-3 text-sm font-medium text-[#2B2B26] transition hover:bg-white"
        >
          Postularme al panel
        </Link>
      </section>
    </div>
  );
}
