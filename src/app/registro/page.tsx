import { signUp } from "@/lib/actions";

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold">Crear cuenta</h1>

      {error && <p className="mt-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      <form action={signUp} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input name="nombre" required className="mt-1 w-full rounded border border-neutral-300 p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Correo</label>
          <input name="email" type="email" required className="mt-1 w-full rounded border border-neutral-300 p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Contraseña</label>
          <input name="password" type="password" required minLength={6} className="mt-1 w-full rounded border border-neutral-300 p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Quiero registrarme como</label>
          <select name="rol" className="mt-1 w-full rounded border border-neutral-300 p-2">
            <option value="voluntario">Voluntario</option>
            <option value="gestor">Gestor / creador de causas</option>
          </select>
        </div>
        <button className="w-full rounded bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-700">
          Crear cuenta
        </button>
      </form>

      <p className="mt-4 text-sm text-neutral-600">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="text-orange-600 underline">
          Ingresa
        </a>
      </p>
    </div>
  );
}
