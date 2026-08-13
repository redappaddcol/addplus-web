import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PanelExpertoPage() {
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

  if (!perfil || (perfil.rol !== "experto" && perfil.rol !== "admin")) {
    redirect("/");
  }

  const { data: causas } = await supabase
    .from("causes")
    .select("id, titulo, descripcion, ciudad, categories(nombre)")
    .eq("estado", "activa")
    .order("creado_en", { ascending: false })
    .limit(10);

  return (
    <div>
      <h1 className="text-2xl font-bold">Panel de experto</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Hola {perfil.nombre}. Estas son las causas activas que necesitan criterio técnico:
        validar el diagnóstico, aterrizar el diseño o revisar que el plan de acción sea viable.
      </p>

      <div className="mt-6 space-y-4">
        {!causas || causas.length === 0 ? (
          <p className="text-neutral-500">No hay causas activas por ahora.</p>
        ) : (
          causas.map((causa: any) => (
            <div key={causa.id} className="rounded-lg border border-neutral-200 bg-white p-5">
              <span className="text-xs font-medium uppercase text-orange-600">
                {causa.categories?.nombre ?? "General"}
              </span>
              <h2 className="text-lg font-semibold">{causa.titulo}</h2>
              <p className="text-sm text-neutral-500">{causa.ciudad || "Sin ciudad"}</p>
              <p className="mt-2 text-sm text-neutral-700">{causa.descripcion}</p>
              <a href={`/causas/${causa.id}`} className="mt-3 inline-block text-sm text-orange-600 underline">
                Ver causa completa
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
