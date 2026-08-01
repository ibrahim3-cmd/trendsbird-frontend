import type { ComponentType, ReactNode } from "react";

export interface IResponse<T> {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data: T;
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
    key: string;
    permission?: string;
    icon?: ComponentType<{ className?: string; strokeWidth?: number }>;
  }[];
}

export type { ISendOtp, IVerifyOtp, ILogin, ForgotPasswordPayload, ResetPasswordPayload, ChangePasswordBody, ChangePasswordResponse, VerifyResetOtpPayload } from "./auth.type";
export type { IUser, IAuthUser, CreateUserPayload, UpdateUserPayload } from "./user.type";
export type { IRole, CreateRolePayload, UpdateRolePayload } from "./role.type";
export type { IPermission, CreatePermissionPayload, UpdatePermissionPayload } from "./permission.type";

export interface IProps {
  children: ReactNode;
}
