export interface GradientStop {
  color: string;
}

export interface Gradient {
  stops: GradientStop[];
  direction: string;
}

export interface ColorSpot {
  id: string;
  x: number;
  y: number;
  color: string;
  opacity: number;
  size: number; // percentage of viewport
}

export interface PageData {
  id: string;
  slug: string;
  title: string;
  sitetitle: string;
  created_at: string;
  is_static?: boolean;
  background: {
    gradient?: Gradient;
    image_url?: string;
    colorSpots?: ColorSpot[];
  } | null;
}

