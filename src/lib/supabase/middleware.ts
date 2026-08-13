import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rutas que exigen sesión y, opcionalmente, un rol específico.
// El primer prefijo que haga match con la ruta solicitada manda.
const RUTAS_PROTEGIDAS: { prefix: string; roles: string[] }[] = [
  { prefix: "/panel-admin", roles: ["admin"] },
  { prefix: "/panel-experto", roles: ["experto", "admin"] },
  { prefix: "/panel-aliado", roles: ["aliado", "admin"] },
  { prefix: "/causas/nueva", roles: ["gestor", "admin"] },
  { prefix: "/eventos/nuevo", roles: ["gestor", "admin"] },
  { prefix: "/dashboard", roles: ["gestor", "admin"] },
  {
    prefix: "/mis-postulaciones",
    roles: ["voluntario", "gestor", "experto", "aliado", "admin"],
  },
];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const regla = RUTAS_PROTEGIDAS.find((r) => path.startsWith(r.prefix));

  if (regla) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "Debes iniciar sesión para ver esa sección.");
      return NextResponse.redirect(url);
    }

    const { data: perfil } = await supabase
      .from("profiles")
      .select("rol")
      .eq("id", user.id)
      .single();

    if (!perfil || !regla.roles.includes(perfil.rol)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("error", "No tienes permiso para ver esa sección.");
      return NextResponse.redirect(url);
    }
  }

  return response;
}
