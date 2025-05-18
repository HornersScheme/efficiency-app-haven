export interface App {
  id: string;
  name: string;
  slogan: string;
  description: string;
  logo_url: string;
  app_link: string;
  platform: 'PC' | 'Mobile';
  category_id: string;
  category?: Category;
  user_id: string;
  user_email?: string;
  upvotes_count: number;
  is_upvoted?: boolean;
  is_sponsored?: boolean;
  images?: {
    id: string;
    image_url: string;
    display_order: number;
  }[];
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  apps?: { count: number }[];
} 