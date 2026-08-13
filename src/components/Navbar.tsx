import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions";
import { rutaPanelPara } from "@/lib/roles";
import Logo from "@/components/Logo";

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
    <header className="sticky top-0 z-50 border-b border-[#E3DFD2] bg-[#F7F5EE]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="h-9 w-9 text-[#40573F]" />
          <span className="text-xl font-semibold tracking-tight text-[#2B2B26]">
            ADD<span className="text-[#40573F]">+</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[#4A4A42] md:flex">
          <Link href="/causas" className="transition hover:text-[#40573F]">Causas</Link>
          <Link href="/eventos" className="transition hover:text-[#40573F]">Eventos</Link>
          <Link href="/#colaborar" className="transition hover:text-[#40573F]">Colaborar</Link>
          <Link href="/expertos" className="transition hover:text-[#40573F]">Expertos</Link>
          <Link href="/aliados" className="transition hover:text-[#40573F]">Aliados</Link>
          <Link href="/#nosotros" className="transition hover:text-[#40573F]">Nosotros</Link>
        </nav>

        <div className="ml-auto flex items-center gap-2.5 text-sm">
          {user ? (
            <>
              {perfil?.rol === "gestor" && (
                <Link href="/causas/nueva" className="hidden text-[#4A4A42] transition hover:text-[#40573F] sm:block">
                  Crear causa
                </Link>
              )}
              <Link
                href={rutaPanelPara(perfil?.rol)}
                className="hidden text-[#4A4A42] transition hover:text-[#40573F] sm:block"
              >
                Mi panel
              </Link>
              {perfil?.rol !== "admin" && (
                <Link href="/mis-postulaciones" className="hidden text-[#4A4A42] transition hover:text-[#40573F] lg:block">
                  Mis postulaciones
                </Link>
              )}
              <span className="hidden text-[#9A9A8E] lg:block">{perfil?.nombre}</span>
              <form action={signOut}>
                <button className="rounded-full border border-[#CFC9B8] px-4 py-2 text-[#4A4A42] transition hover:bg-[#EDEADF]">
                  Salir
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-[#CFC9B8] px-4 py-2 text-[#4A4A42] transition hover:bg-[#EDEADF]"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="rounded-full bg-[#40573F] px-5 py-2 font-medium text-[#F7F5EE] transition hover:bg-[#33472F]"
              >
                Regístrate
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
