export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  photoUrl: string | null;
  role: string;
  status: string;
  createdAt: string;
}
