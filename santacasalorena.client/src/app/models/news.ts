export interface News {
  id?: string;
  title: string;
  description: string;
  content: string;
  category?: string;
  tags?: string[];
  imageUrl: string;
  isPublished: boolean;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
  views?: number;
  userId?: string;
}

