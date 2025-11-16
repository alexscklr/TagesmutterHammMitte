import { getImageUrl } from "@/shared/lib/imageQueries";
import type { BackgroundStyle } from "../types/types";

export async function backgroundStyleToCSS(bg: BackgroundStyle): Promise<string> {
  if (!bg) return Promise.resolve("linear-gradient(0deg, rgba(255,255,255,0.6), rgba(255,255,255,0.6))");

  const gradient =
    bg.gradient && bg.gradient.stops && bg.gradient.stops.length > 0
      ? `linear-gradient(${bg.gradient.direction || "to bottom"}, ${bg.gradient.stops
          .map(s => (s.position ? `${s.color} ${s.position}` : s.color))
          .join(", ")})`
      : "";

  const image = bg.image_url ? `url(${await getImageUrl(bg.image_url, "public_images", 60)})` : "";

  // Wenn beides leer, Fallback
  if (!gradient && !image) {
    return Promise.resolve("linear-gradient(0deg, rgba(255,255,255,0.6), rgba(255,255,255,0.6))");
  }

  return Promise.resolve([gradient, image].filter(Boolean).join(", "));
}