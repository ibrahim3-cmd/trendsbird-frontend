import { ComponentType, ReactNode } from "react";

export type { ISendOtp, IVerifyOtp, ILogin, ForgotPasswordPayload, ResetPasswordPayload, ChangePasswordBody, ChangePasswordResponse, VerifyResetOtpPayload } from "./auth.type";
export type { IsActive, IWallet, IUser, IUserFeatureAccess, IPaginatedMeta, ApiEnvelope, GetUserQuery, UserListResponse, UpdateMePayload, UpdateMeResponse, StorageUnit, IStorageUsage } from "./user.type";
export type { IDashboardAnalytics, IAnalyticsQuery, IDashboardAnalyticsResponse, IConfigurationStatus, IConfigurationStatusResponse } from "./analytics.type";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
    key: string
    icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  }[];
}

export type TRole = "SUPER_ADMIN" | "ADMIN" | "ORG_ADMIN" | "MANAGER" | "CREW" | "CLIENT";

export interface IProps {
  children: ReactNode;
}