export interface IPermissionRef {
  id: number;
  name: string;
  description?: string | null;
}

export interface IRole {
  id: number;
  name: string;
  description?: string | null;
  isActive: boolean;
  isSystem: boolean;
  createdAt?: string;
  updatedAt?: string;
  rolePerms?: Array<{
    id: number;
    permissionId: number;
    permission: IPermissionRef;
  }>;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permissionIds?: number[];
  isActive?: boolean;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permissionIds?: number[];
  isActive?: boolean;
}
