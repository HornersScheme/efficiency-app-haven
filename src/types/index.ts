
export interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  rating: number;
  reviews: number;
  category: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}
