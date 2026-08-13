import { requestPasswordReset } from "@/lib/actions";

export default async function RecuperarPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold">Recuperar contraseña</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Ingresa el correo con el que te registraste. Si existe una cuenta asociada, te
        enviaremos un enlace para crear una nueva contraseña.
      </p>

      {ok && (
        <p className="mt-3 rounded bg-emerald-50 p-2 text-sm text-emerald-700">
          Revisa tu correo (y la carpeta de spam). El enlace es válido por poco tiempo.
        </p>
      )}
      {error && <p className="mt-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      <form action={requestPasswordReset} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Correo</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded border border-neutral-300 p-2"
          />
        </div>
        <button className="w-full rounded bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-700">
          Enviar enlace de recuperación
        </button>
      </form>

      <p className="mt-4 text-sm text-neutral-600">
        <a href="/login" className="text-orange-600 underline">
          Volver a ingresar
        </a>
      </p>
    </div>
  );
}
