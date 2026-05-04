export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
}
