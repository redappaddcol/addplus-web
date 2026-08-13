import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateUserRole } from "@/lib/actions";
import { TODOS_LOS_ROLES } from "@/lib/roles";

export default async function PanelAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: perfil } = await supabase
    .from("profiles")
    .select("nombre, rol")
    .eq("id", user.id)
    .single();

  if (!perfil || perfil.rol !== "admin") {
    redirect("/");
  }

  const { data: perfiles } = await supabase
    .from("profiles")
    .select("id, nombre, rol, ciudad")
    .order("nombre", { ascending: true });

  const { count: totalCausas } = await supabase
    .from("causes")
    .select("id", { count: "exact", head: true });

  const { count: totalEventos } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true });

  const conteoPorRol = (perfiles ?? []).reduce<Record<string, number>>((acc, p: any) => {
    acc[p.rol] = (acc[p.rol] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-2xl font-bold">Panel de administración</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-xs uppercase text-neutral-500">Usuarios</p>
          <p className="text-2xl font-bold">{perfiles?.length ?? 0}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-xs uppercase text-neutral-500">Causas</p>
          <p className="text-2xl font-bold">{totalCausas ?? 0}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-xs uppercase text-neutral-500">Eventos</p>
          <p className="text-2xl font-bold">{totalEventos ?? 0}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-sm text-neutral-600">
        {Object.entries(conteoPorRol).map(([rol, n]) => (
          <span key={rol} className="rounded-full border border-neutral-300 px-3 py-1">
            {rol}: {n}
          </span>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-semibold">Usuarios y roles</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Cambia el rol de un usuario y guarda; se moverá al panel correspondiente en su próximo
        ingreso.
      </p>

      <div className="mt-3 divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
        {(perfiles ?? []).map((p: any) => (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm font-medium">{p.nombre}</p>
              <p className="text-xs text-neutral-500">{p.ciudad || "Sin ciudad"}</p>
            </div>
            <form action={updateUserRole.bind(null, p.id)} className="flex items-center gap-2">
              <select
                name="rol"
                defaultValue={p.rol}
                className="rounded border border-neutral-300 p-1 text-xs"
              >
                {TODOS_LOS_ROLES.map((rol) => (
                  <option key={rol.value} value={rol.value}>
                    {rol.label}
                  </option>
                ))}
              </select>
              <button className="rounded bg-neutral-800 px-3 py-1 text-xs text-white hover:bg-neutral-900">
                Guardar
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
