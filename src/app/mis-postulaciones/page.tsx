import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const estadoColor: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  aceptada: "bg-emerald-100 text-emerald-700",
  rechazada: "bg-neutral-200 text-neutral-600",
};

export default async function MisPostulacionesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: postulaciones } = await supabase
    .from("applications")
    .select("id, mensaje, estado, creado_en, causes(id, titulo, ciudad, estado)")
    .eq("voluntario_id", user.id)
    .order("creado_en", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold">Mis postulaciones</h1>

      {!postulaciones || postulaciones.length === 0 ? (
        <p className="mt-4 text-neutral-500">
          Todavía no te has postulado a ninguna causa.{" "}
          <Link href="/" className="text-orange-600 underline">
            Explora las causas activas
          </Link>
          .
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {postulaciones.map((p: any) => (
            <Link
              key={p.id}
              href={`/causas/${p.causes?.id}`}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 hover:shadow-sm"
            >
              <div>
                <p className="font-medium">{p.causes?.titulo}</p>
                <p className="text-xs text-neutral-500">{p.causes?.ciudad || "Sin ciudad"}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs ${estadoColor[p.estado]}`}>
                {p.estado}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
