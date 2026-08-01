export interface IUser {
  id: number;
  name?: string | null;
  email: string;
  phone?: string | null;
  gender?: string | null;
  avatar?: string | null;
  roleId: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  role?: {
    id: number;
    name: string;
    description?: string | null;
  };
}

export interface IAuthUser {
  id: number;
  name?: string | null;
  email: string;
  role?: string;
  permissions?: string[];
  avatar?: string | null;
}

export interface CreateUserPayload {
  name?: string;
  email: string;
  password: string;
  roleId: number;
  phone?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  roleId?: number;
  phone?: string;
  isActive?: boolean;
}
