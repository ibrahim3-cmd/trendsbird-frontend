export interface IPermission {
  id: number;
  name: string;
  description?: string | null;
  groupId?: number | null;
  createdAt?: string;
  updatedAt?: string;
  group?: {
    id: number;
    name: string;
  } | null;
}

export interface CreatePermissionPayload {
  name: string;
  description?: string;
  groupId?: number;
}

export interface UpdatePermissionPayload {
  name?: string;
  description?: string;
  groupId?: number | null;
}
