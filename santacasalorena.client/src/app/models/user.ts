export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  photoUrl: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}
