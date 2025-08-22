export interface News {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  imageUrl: string;
  isPublished: boolean;
  createdAt?: string;
}
