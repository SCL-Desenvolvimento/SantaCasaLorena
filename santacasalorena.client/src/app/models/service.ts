export interface Service {
  id?: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  is_active: boolean;
  order_index?: number;
}
