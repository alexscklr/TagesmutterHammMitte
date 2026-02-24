import type { Gradient } from "./types";

export const gradientToCss = (gradient?: Gradient | null): string => {
  if (!gradient || !gradient.stops || gradient.stops.length === 0) return "";
  const colors = gradient.stops.map(stop => stop.color).join(", ");
  // CSS linear-gradient goes from first color to last in the direction specified
  // 0deg = bottom to top, 90deg = left to right, 180deg = top to bottom, 270deg = right to left
  return `linear-gradient(${gradient.direction || "180deg"}, ${colors})`;
};
