export type Role = string | null;

const isAdmin = (role: Role) => role === "admin";


// Edit/create/delete are admin-only on the UI; backend RLS must still enforce
export const canEdit = (role: Role) => isAdmin(role);