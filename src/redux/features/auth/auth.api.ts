/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";
import {
  ChangePasswordBody,
  ChangePasswordResponse,
  ForgotPasswordPayload,
  IResponse,
  ResetPasswordPayload,
} from "@/types";
import { IAuthUser } from "@/types/user.type";

const persistSession = (user?: IAuthUser) => {
  if (!user) return;
  localStorage.setItem("permissions", JSON.stringify(user.permissions ?? []));
  if (user.role) localStorage.setItem("role", user.role);
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, { email: string; password: string }>({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: userInfo,
      }),
      invalidatesTags: ["USER"],
      async onQueryStarted(_, { queryFulfilled }) {
        localStorage.removeItem("permissions");
        localStorage.removeItem("role");
        await queryFulfilled;
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["USER"],
    }),
    resetDatabase: builder.mutation<IResponse<{ permissionsSeeded: number; adminRoleName: string; userWasCreated: boolean }>, { secret: string }>({
      query: (body) => ({
        url: "/maintenance/reset-database",
        method: "POST",
        data: body,
      }),
    }),
    userInfo: builder.query<IResponse<IAuthUser>, null | undefined>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["USER"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          persistSession(data?.data);
        } catch {
          localStorage.removeItem("permissions");
          localStorage.removeItem("role");
        }
      },
    }),
    forgotPassword: builder.mutation<IResponse<null>, ForgotPasswordPayload>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        data: body,
      }),
    }),
    resetPassword: builder.mutation<IResponse<null>, ResetPasswordPayload>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        data: body,
      }),
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordBody>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        data: body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useResetDatabaseMutation,
  useUserInfoQuery,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLazyUserInfoQuery,
  useChangePasswordMutation,
} = authApi;
