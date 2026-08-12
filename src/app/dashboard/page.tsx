import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateApplicationStatus, closeCause } from "@/lib/actions";

const estadoColor: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  aceptada: "bg-emerald-100 text-emerald-700",
  rechazada: "bg-neutral-200 text-neutral-600",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: causas } = await supabase
    .from("causes")
    .select("*, categories(nombre), applications(id, mensaje, estado, creado_en, profiles(nombre, ciudad))")
    .eq("gestor_id", user.id)
    .order("creado_en", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mi panel de gestor</h1>
        <a href="/causas/nueva" className="rounded bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">
          + Nueva causa
        </a>
      </div>

      {!causas || causas.length === 0 ? (
        <p className="text-neutral-500">Aún no has creado ninguna causa.</p>
      ) : (
        <div className="space-y-6">
          {causas.map((causa: any) => (
            <div key={causa.id} className="rounded-lg border border-neutral-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium uppercase text-orange-600">
                    {causa.categories?.nombre ?? "General"}
                  </span>
                  <h2 className="text-lg font-semibold">{causa.titulo}</h2>
                  <p className="text-sm text-neutral-500">
                    Estado: {causa.estado.replace("_", " ")} · {causa.applications?.length ?? 0} postulaciones
                  </p>
                </div>
                {causa.estado !== "cerrada" && (
                  <form action={closeCause.bind(null, causa.id)}>
                    <button className="rounded border border-neutral-300 px-3 py-1 text-xs text-neutral-600 hover:bg-neutral-100">
                      Cerrar causa
                    </button>
                  </form>
                )}
              </div>

              <div className="mt-4 divide-y divide-neutral-100">
                {(causa.applications ?? []).length === 0 && (
                  <p className="py-2 text-sm text-neutral-500">Sin postulaciones todavía.</p>
                )}
                {(causa.applications ?? []).map((app: any) => (
                  <div key={app.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">{app.profiles?.nombre}</p>
                      {app.mensaje && <p className="text-xs text-neutral-500">{app.mensaje}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${estadoColor[app.estado]}`}>
                        {app.estado}
                      </span>
                      {app.estado === "pendiente" && (
                        <>
                          <form action={updateApplicationStatus.bind(null, app.id, "aceptada")}>
                            <button className="rounded bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-700">
                              Aceptar
                            </button>
                          </form>
                          <form action={updateApplicationStatus.bind(null, app.id, "rechazada")}>
                            <button className="rounded bg-neutral-500 px-2 py-1 text-xs text-white hover:bg-neutral-600">
                              Rechazar
                            </button>
                          </form>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
