import { IUser, StorageUnit } from "@/types/user.type";
import { ComponentType, ReactNode } from "react";

export type { ISendOtp, IVerifyOtp, ILogin, ForgotPasswordPayload, ResetPasswordPayload, ChangePasswordBody, ChangePasswordResponse, VerifyResetOtpPayload } from "./auth.type";

export type { IsActive, IWallet, IUser, IUserFeatureAccess, IPaginatedMeta, ApiEnvelope, GetUserQuery, UserListResponse, UpdateMePayload, UpdateMeResponse, StorageUnit, IStorageUsage } from "@/types/user.type";

export type { ILead, LeadStage, ILeadQuery, ICreateLead, IUpdateLead, IMoveStage } from "@/types/lead.type";

export type { ITask, ITaskQuery, TaskListResponse, ITaskCreate, ITaskUpdate } from "@/types/task.type";

export type { IRole, IRoleMeta, IRoleResponse, IRoleQuery, ICreateRole, IUpdateRole } from "@/types/role.type";

export type { IDashboardAnalytics, IAnalyticsQuery, IDashboardAnalyticsResponse, IConfigurationStatus, IConfigurationStatusResponse } from "@/types/analytics.type";

export type {
  IForm,
  IFormField,
  IFormFieldOption,
  IFormFieldValidation,
  IFormSettings,
  IConditionalLogic,
  IFormQuery,
  ICreateForm,
  IUpdateForm,
  IDuplicateForm,
  IFormResponse,
  IFormsListResponse,
  IFormSubmission,
  IFormSubmissionQuery,
  ICreateFormSubmission,
  IFormSubmissionResponse,
  IFormSubmissionsListResponse,
  IFormAnalytics,
  IFormAnalyticsResponse,
  FormFieldType,
  FormCategory,
  FORM_FIELD_TYPE_LABELS,
  FORM_CATEGORIES
} from "@/types/form.type";

export type { IService, IServiceQuery, IServiceCreate, IServiceUpdate, ServiceListResponse } from "@/types/service.type";

export type {
  JobPaymentStatus,
  JobPaymentMetadata,
  IJobPayment,
  CreateJobPaymentInput,
  ProcessJobPaymentInput,
  JobPaymentResponse,
  JobPaymentStats,
  PaginatedJobPayments,
  JobPaymentQuery
} from "@/types/jobPayment.type";

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

export interface CreateSupportAgentPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  isVerified?: boolean;
  storageUsage?: {
    value: number;
    unit: StorageUnit;
  };
}

export interface UpdateSupportAgentPayload {
  name?: string;
  password?: string;
  phone?: string;
  address?: string;
  isVerified?: boolean;
  storageUsage?: {
    value: number;
    unit: StorageUnit;
  };
}

export interface SupportAgentResponse {
  success: boolean;
  message: string;
  data: IUser;
}