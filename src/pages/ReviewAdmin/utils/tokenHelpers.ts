export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Unbegrenzt";
  const date = new Date(dateString);
  return date.toLocaleDateString("de-DE", { year: "numeric", month: "2-digit", day: "2-digit" });
};

export const isTokenExpired = (expiresAt: string | null): boolean => {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
};
