/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";
import { ChangePasswordBody, ChangePasswordResponse, CreateSupportAgentPayload, ForgotPasswordPayload, IResponse, ISendOtp, IVerifyOtp, ResetPasswordPayload, SupportAgentResponse, UpdateSupportAgentPayload, VerifyResetOtpPayload } from "@/types";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
login: builder.mutation({
  query: (userInfo) => ({
    url: "/auth/login",
    method: "POST",
    data: userInfo,
  }),
  invalidatesTags: ["USER"],
  async onQueryStarted(_, { queryFulfilled }) {
    // Clear any old data before login
    localStorage.removeItem("features");
    sessionStorage.removeItem("features");
    
    await queryFulfilled;
  },
}),
loginByEmailAndRole: builder.mutation({
  query: (userInfo) => ({
    url: "/auth/login-by-email-role",
    method: "POST",
    data: userInfo,
  }),
  invalidatesTags: ["USER"],
  async onQueryStarted(_, { queryFulfilled }) {
    // Clear any old data before login
    localStorage.removeItem("features");
    sessionStorage.removeItem("features");
    
    await queryFulfilled;
  },
}),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["USER"],
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
    }),
    sendOtp: builder.mutation<IResponse<null>, ISendOtp>({
      query: (userInfo) => ({
        url: "/otp/send",
        method: "POST",
        data: userInfo,
      }),
    }),
    verifyOtp: builder.mutation<IResponse<null>, IVerifyOtp>({
      query: (userInfo) => ({
        url: "/otp/verify",
        method: "POST",
        data: userInfo,
      }),
    }),
    userInfo: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["USER"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // API returns { statusCode, success, message, data }
          const features = data?.data?.featureAccess ?? [];
          localStorage.setItem("features", JSON.stringify(features));
        } catch (error) {
          console.error("Failed to fetch user info:", error);
          localStorage.removeItem("features"); // reset if error
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
    verifyResetOtp: builder.mutation<IResponse<null>, VerifyResetOtpPayload>({
      query: (body) => ({
        url: "/auth/verify-reset-otp",
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

    // Create Support Agent
    createSupportAgent: builder.mutation<SupportAgentResponse, CreateSupportAgentPayload>({
      query: (body) => ({
        url: "/user/create-support-agent",
        method: "POST",
        data:body,
      }),
      invalidatesTags: ["USER"],
    }),
    updateSupportAgent: builder.mutation<
      SupportAgentResponse,
      { id: string; body: UpdateSupportAgentPayload }
    >({
      query: ({ id, body }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        data:body,
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLoginByEmailAndRoleMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useUserInfoQuery,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useLazyUserInfoQuery,
  useChangePasswordMutation,
  useCreateSupportAgentMutation,
  useUpdateSupportAgentMutation
} = authApi;
