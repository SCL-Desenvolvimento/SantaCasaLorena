export interface User {
  id: string;
  username: string;
  email: string;
  userType: string;
  department: string | null;
  photoUrl: string | null;
}
