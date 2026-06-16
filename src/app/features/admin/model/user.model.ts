export interface User {
  userId: number;
  name: string;
  emailId: string;
  passwordHash: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  isAdmin: boolean;
}

