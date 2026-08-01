import { baseApi } from "@/redux/baseApi";

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query<any, void>({
      query: () => ({ url: "/permissions", method: "GET" }),
      providesTags: ["PERMISSION"],
    }),
    getPermissionGroups: builder.query<any, { search?: string; page?: number; limit?: number }>({
      query: ({ search, page, limit } = {}) => ({
        url: "/permissions/groups",
        method: "GET",
        params: { search, page, limit },
      }),
      providesTags: ["PERMISSION"],
    }),
    createPermissionGroup: builder.mutation<any, any>({
      query: (body) => ({ url: "/permissions/groups", method: "POST", data: body }),
      invalidatesTags: ["PERMISSION"],
    }),
    updatePermissionGroup: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({ url: `/permissions/groups/${id}`, method: "PUT", data: body }),
      invalidatesTags: ["PERMISSION"],
    }),
    deletePermissionGroup: builder.mutation<void, number>({
      query: (id) => ({ url: `/permissions/groups/${id}`, method: "DELETE" }),
      invalidatesTags: ["PERMISSION"],
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useGetPermissionGroupsQuery,
  useCreatePermissionGroupMutation,
  useUpdatePermissionGroupMutation,
  useDeletePermissionGroupMutation,
} = permissionApi;
