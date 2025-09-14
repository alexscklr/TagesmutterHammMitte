import type { BackgroundStyle } from "../types/types";

export function backgroundStyleToCSS(bg: BackgroundStyle): string {
  if (!bg) return "linear-gradient(0deg, rgba(255,255,255,0.6), rgba(255,255,255,0.6))";

  const gradient =
    bg.gradient && bg.gradient.stops && bg.gradient.stops.length > 0
      ? `linear-gradient(${bg.gradient.direction || "to bottom"}, ${bg.gradient.stops
          .map(s => (s.position ? `${s.color} ${s.position}` : s.color))
          .join(", ")})`
      : "";

  const image = bg.image_url ? `url(${bg.image_url})` : "";

  // Wenn beides leer, Fallback
  if (!gradient && !image) {
    return "linear-gradient(0deg, rgba(255,255,255,0.6), rgba(255,255,255,0.6))";
  }

  return [gradient, image].filter(Boolean).join(", ");
}