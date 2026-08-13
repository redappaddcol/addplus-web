import { updatePassword } from "@/lib/actions";

export default async function ActualizarClavePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold">Crear nueva contraseña</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Debes llegar a esta página desde el enlace de recuperación que te enviamos por
        correo. Escribe tu nueva contraseña para continuar.
      </p>

      {error && <p className="mt-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      <form action={updatePassword} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Nueva contraseña</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded border border-neutral-300 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Confirmar contraseña</label>
          <input
            name="confirmar"
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded border border-neutral-300 p-2"
          />
        </div>
        <button className="w-full rounded bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-700">
          Guardar contraseña
        </button>
      </form>

      <p className="mt-4 text-sm text-neutral-600">
        ¿El enlace ya no funciona?{" "}
        <a href="/recuperar" className="text-orange-600 underline">
          Solicita uno nuevo
        </a>
        .
      </p>
    </div>
  );
}
