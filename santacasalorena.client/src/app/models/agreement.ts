export interface Agreement {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'pending';
  category: string;
  partner: string;
  value: number;
  createdAt?: string;
  updatedAt?: string;
  imageUrl: string;
}
