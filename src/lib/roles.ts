export type Rol = "voluntario" | "gestor" | "experto" | "aliado" | "admin";

// Roles que un usuario puede elegir al registrarse. "admin" no se ofrece
// aquí: se asigna manualmente desde el panel de administración.
export const ROLES_PUBLICOS: { value: Rol; label: string }[] = [
  { value: "voluntario", label: "Voluntario" },
  { value: "gestor", label: "Gestor / creador de causas" },
  { value: "experto", label: "Experto" },
  { value: "aliado", label: "Aliado (empresa u organización)" },
];

export const TODOS_LOS_ROLES: { value: Rol; label: string }[] = [
  ...ROLES_PUBLICOS,
  { value: "admin", label: "Administrador" },
];

// A qué panel llega cada rol después de iniciar sesión o registrarse.
export const RUTA_PANEL: Record<Rol, string> = {
  voluntario: "/mis-postulaciones",
  gestor: "/dashboard",
  experto: "/panel-experto",
  aliado: "/panel-aliado",
  admin: "/panel-admin",
};

export function rutaPanelPara(rol: string | null | undefined): string {
  if (rol && rol in RUTA_PANEL) {
    return RUTA_PANEL[rol as Rol];
  }
  return "/mis-postulaciones";
}
