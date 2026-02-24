export type Role = string | null;

export const isAdmin = (role: Role) => role === "admin";
export const isAuditor = (role: Role) => role === "auditor";

// Who can enter admin areas (read-only for auditors)
export const canAccessAdmin = (role: Role) => isAdmin(role) || isAuditor(role);

// Edit/create/delete are admin-only on the UI; backend RLS must still enforce
export const canEdit = (role: Role) => isAdmin(role);
export const canCreate = (role: Role) => isAdmin(role);
export const canDelete = (role: Role) => isAdmin(role);

// Optional convenience for gating specific actions
export const canPickImage = (role: Role) => isAdmin(role);
export const canSave = (role: Role) => isAdmin(role);
