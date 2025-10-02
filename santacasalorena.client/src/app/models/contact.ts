export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied?: boolean;
  createdAt: string;
  readAt?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  receivedAt: string;
}
