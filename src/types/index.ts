export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  created_at: string;
}

export interface App {
  id: string;
  name: string;
  slogan: string;
  description: string;
  logo_url: string;
  app_link: string;
  category_id: string;
  user_id: string;
  user_email?: string;
  upvotes_count: number;
  created_at: string;
  updated_at: string;
  platform: 'PC' | 'Mobile';
  category?: Category;
  images?: AppImage[];
  is_upvoted?: boolean;
}

export interface AppImage {
  id: string;
  app_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface Upvote {
  id: string;
  app_id: string;
  user_id: string;
  created_at: string;
}
