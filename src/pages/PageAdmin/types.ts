export interface GradientStop {
  color: string;
}

export interface Gradient {
  stops: GradientStop[];
  direction: string;
}

export interface PageData {
  id: string;
  slug: string;
  title: string;
  sitetitle: string;
  created_at: string;
  background: {
    gradient?: Gradient;
    image_url?: string;
  } | null;
}
