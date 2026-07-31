export type Role = string | null;

const isAdmin = (role: Role) => role === "admin";


export const canEdit = (role: Role) => isAdmin(role);