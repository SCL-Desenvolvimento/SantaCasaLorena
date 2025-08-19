export interface Convenio {
  id?: number;
  name: string;
  description: string;
  category: string;
  phone?: string;
  email?: string;
  website_url?: string;
  logo_url?: string;
  is_active: boolean;
  order_index?: number;
}
