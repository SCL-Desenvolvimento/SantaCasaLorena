export interface News {
  id?: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  category: string;
  image_url?: string;
  is_published: boolean;
  created_at?: string;
}
