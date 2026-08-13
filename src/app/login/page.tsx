import { signIn } from "@/lib/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reset?: string }>;
}) {
  const { error, reset } = await searchParams;

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold">Ingresar</h1>

      {reset && (
        <p className="mt-3 rounded bg-emerald-50 p-2 text-sm text-emerald-700">
          Tu contraseña se actualizó. Ingresa con la nueva.
        </p>
      )}
      {error && <p className="mt-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      <form action={signIn} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Correo</label>
          <input name="email" type="email" required className="mt-1 w-full rounded border border-neutral-300 p-2" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Contraseña</label>
            <a href="/recuperar" className="text-xs text-orange-600 underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <input name="password" type="password" required className="mt-1 w-full rounded border border-neutral-300 p-2" />
        </div>
        <button className="w-full rounded bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-700">
          Ingresar
        </button>
      </form>

      <p className="mt-4 text-sm text-neutral-600">
        ¿No tienes cuenta?{" "}
        <a href="/registro" className="text-orange-600 underline">
          Regístrate
        </a>
      </p>
    </div>
  );
}
