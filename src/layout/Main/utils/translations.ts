import { getImageUrl } from "@/shared/lib/imageQueries";
import type { BackgroundStyle } from "../types/types";

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [200, 240, 248]; // fallback pastel blue
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ];
}

export async function backgroundStyleToCSS(bg: BackgroundStyle): Promise<string> {
  if (!bg) return Promise.resolve("linear-gradient(0deg, rgba(255,255,255,0.6), rgba(255,255,255,0.6))");

  const gradient =
    bg.gradient && bg.gradient.stops && bg.gradient.stops.length > 0
      ? `linear-gradient(${bg.gradient.direction || "to bottom"}, ${bg.gradient.stops
          .map(s => (s.position ? `${s.color} ${s.position}` : s.color))
          .join(", ")})`
      : "";

  const image = bg.image_url ? `url('${await getImageUrl(bg.image_url, "public_images")}')` : "";

  // Build color spots gradients
  const colorSpots = bg.colorSpots
    ? bg.colorSpots.map(spot => {
        const [r, g, b] = hexToRgb(spot.color);
        return `radial-gradient(at ${spot.x}% ${spot.y}%, rgba(${r}, ${g}, ${b}, ${spot.opacity}) 0%, rgba(${r}, ${g}, ${b}, 0) ${spot.size}%)`;
      })
    : [];

  // Combine all layers - Image über Gradient, aber unter Color Spots
  const layers = [...colorSpots, image, gradient].filter(Boolean);

  // Wenn alles leer, Fallback
  if (layers.length === 0) {
    return Promise.resolve("linear-gradient(0deg, rgba(255,255,255,0.6), rgba(255,255,255,0.6))");
  }

  return Promise.resolve(layers.join(", "));
}

