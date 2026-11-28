import type { UserRole } from "../schemas/user.schema";

export type User = {
  id: string;
  name?: string | null;
  email: string;
  isActive: boolean;
  role: {
    id: string;
    name: UserRole;
  };
  createdAt: string;
  updatedAt: string;
};

export type CreateUserInput = {
  email: string;
  password: string;
  roleName: UserRole;
  isActive: boolean;
};

export type UpdateUserInput = {
  email?: string;
  roleName?: UserRole;
  isActive?: boolean;
};

export type ApiEnvelope<T> = {
  success: true;
  message: string;
  data: T;
  meta: unknown;
};
