import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let perfil = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("nombre, rol")
      .eq("id", user.id)
      .single();
    perfil = data;
  }

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-orange-600">
          Add <span className="text-orange-500">+</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-neutral-700 hover:text-orange-600">
            Causas
          </Link>
          {user ? (
            <>
              {perfil?.rol === "gestor" && (
                <Link href="/causas/nueva" className="text-neutral-700 hover:text-orange-600">
                  Crear causa
                </Link>
              )}
              <Link href="/dashboard" className="text-neutral-700 hover:text-orange-600">
                Mi panel
              </Link>
              <Link href="/mis-postulaciones" className="text-neutral-700 hover:text-orange-600">
                Mis postulaciones
              </Link>
              <span className="text-neutral-400">{perfil?.nombre}</span>
              <form action={signOut}>
                <button className="rounded bg-neutral-800 px-3 py-1.5 text-white hover:bg-neutral-700">
                  Salir
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-neutral-700 hover:text-orange-600">
                Ingresar
              </Link>
              <Link
                href="/registro"
                className="rounded bg-orange-600 px-3 py-1.5 text-white hover:bg-orange-700"
              >
                Registrarme
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
