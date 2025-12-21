import type { Gradient } from "./types";

export const gradientToCss = (gradient?: Gradient | null): string => {
  if (!gradient || !gradient.stops || gradient.stops.length === 0) return "";
  const colors = gradient.stops.map(stop => stop.color).join(", ");
  return `linear-gradient(${gradient.direction || "0deg"}, ${colors})`;
};
