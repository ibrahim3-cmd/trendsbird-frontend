import { baseApi } from "@/redux/baseApi";
import { ApiEnvelope, GetUserQuery, IsActive, IUser, UpdateMePayload, UpdateMeResponse, UserListResponse } from "@/types";

interface UserAvailabilityResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    totalUsers: number;
    summary: {
      totalTasks: number;
      totalCompletedTasks: number;
      totalPendingTasks: number;
      totalOverdueTasks: number;
    };
    users: {
      _id: string;
      name: string;
      email: string;
      role: string;
      totalTasks: number;
      completedTasks: number;
      pendingTasks: number;
      overdueTasks: number;
    }[];
  };
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserListResponse, GetUserQuery | void>({
      query: (q) => {
        const params = new URLSearchParams();
        if (q?.page) params.set("page", String(q.page));
        if (q?.limit) params.set("limit", String(q.limit));
        if (q?.searchTerm) params.set("searchTerm", q.searchTerm);
        if (q?.isActive && q.isActive !== "ALL") params.set("isActive", q.isActive);
        if (q?.role && q.role !== "ALL") params.set("role", q.role);
        if (q?.orgId) params.set("orgId", q.orgId);
        return {
          url: `/user/all-users?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiEnvelope<IUser[]>) => ({
        data: res.data,
        meta: res.meta || { page: 1, limit: res.data?.length ?? 0, total: res.data?.length ?? 0 },
      }),
      providesTags: ["USER"]
    }),

    approveRejectUser: builder.mutation<IUser, { id: string; isActive: IsActive }>({
      query: ({ id, isActive }) => ({
        url: `/user/approve-reject/${id}`,
        method: "PATCH",
        data: { isActive },
      }),
      transformResponse: (res: ApiEnvelope<IUser>) => res.data,
    }),

    updateMe: builder.mutation<UpdateMeResponse, UpdateMePayload>({
      query: (body) => ({
        url: "/user/update-me",
        method: "PATCH",
        data: body,
      }),
    }),

    getUserById: builder.query<IUser, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      transformResponse: (res: ApiEnvelope<IUser>) => res.data,
      providesTags: ["SINGLE_USER"]
    }),

    getAllSupportAgents: builder.query<UserListResponse, GetUserQuery>({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/user/support-agents",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["USER"]
    }),

    updateUser: builder.mutation<IUser, { id: string; body: Partial<IUser> }>({
      query: ({ id, body }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        data: body,
      }),
      // transformResponse: (res: ApiEnvelope<IUser>) => res.data,
      // invalidatesTags: (_, __, { id }) => [{ type: 'USER', id }],
    }),

    getUserAvailability: builder.query<UserAvailabilityResponse, { orgId: string }>({
      query: ({ orgId }) => ({
        url: `/user/availability/status?orgId=${orgId}`,
        method: "GET",
      }),
      providesTags: ["USER"]
    }),
  }),
});

export const { useGetUsersQuery, useApproveRejectUserMutation, useUpdateMeMutation, useUpdateUserMutation, useGetUserByIdQuery, useGetUserAvailabilityQuery, useGetAllSupportAgentsQuery } = userApi;
