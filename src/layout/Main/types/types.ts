export interface GradientStop {
    color: string;
    position?: string;
}

export interface LinearGradient {
    direction?: string;
    stops: GradientStop[];
}

export interface BackgroundStyle {
    image_url?: string;
    gradient?: LinearGradient;
}

export interface PageMeta {
  id: string;
  slug: string;
  title: string;
  created_at: string;
  background: BackgroundStyle;
}