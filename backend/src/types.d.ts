export interface User {
  id: number;
  email: string;
  password_hash?: string;
  organization_id: number;
}
