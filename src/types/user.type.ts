
export type IsActive = "ACTIVE" | "PENDING" | "BLOCKED" | "SUSPENDED";

export type StorageUnit = "MB" | "GB";

export interface IWallet {
  _id?: string;
  user?: string;
  balance?: number;
}

export interface IAction {
  description: string;
  value: string;
  isActive: boolean;
}

export interface IUserFeatureAccess {
  name: string;
  key: string;
  actions: IAction[];
  subFeatures: IUserFeatureAccess[];
}

export interface IStorageUsage {
  value: number;
  unit: StorageUnit;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: IsActive;
  isVerified?: boolean;
  picture?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  wallet?: IWallet;
  featureAccess?: IUserFeatureAccess[];
  org?:{
    _id: string;
    orgName: string;
  };
  isAvailable?: boolean;
  hasCompletedOnboarding?: boolean;
  isOrgOwner?: boolean;
  storageUsage?: IStorageUsage;
  categories?: string[] | Array<{ _id: string; categoryName: string; averageValue?: number }>;
  hourlyRate?: number;
}

export interface IPaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  totalPage?: number;
}

export type ApiEnvelope<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: IPaginatedMeta;
};

export type GetUserQuery = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isActive?: IsActive | "ALL";
  role?: string;
  sortBy?: "createdAt" | "name" | "email" | "isActive";
  sortOrder?: "asc" | "desc";
  orgId?: string;
};

export type UserListResponse = {
  data: IUser[];
  meta: IPaginatedMeta;
};

export type UpdateMePayload = Partial<
  Pick<IUser, "name" | "email" | "phone" | "picture" | "address" | "hasCompletedOnboarding">
> & { password?: string };

export type UpdateMeResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: IUser;
};