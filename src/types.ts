export interface GameItem {
  id: string;
  title: string;
  subtitle?: string;
  platform: string;
  genre: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  publisher: string;
  developer: string;
  releaseYear: string;
  isSpotlight?: boolean;
  coverImage?: string;
  tag?: string;
}

export interface GameEdition {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  features: string[];
  popular?: boolean;
}
