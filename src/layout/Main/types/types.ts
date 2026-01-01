export interface GradientStop {
    color: string;
    position?: string;
}

export interface LinearGradient {
    direction?: string;
    stops: GradientStop[];
}

export interface ColorSpot {
    id: string;
    x: number;
    y: number;
    color: string;
    opacity: number;
    size: number;
}

export interface BackgroundStyle {
    image_url?: string;
    gradient?: LinearGradient;
    colorSpots?: ColorSpot[];
}

export interface PageMeta {
  id: string;
  slug: string;
  title: string;
  sitetitle: string;
  created_at: string;
  background: BackgroundStyle;
}
