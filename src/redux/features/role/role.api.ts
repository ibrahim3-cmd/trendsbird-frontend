import { baseApi } from "@/redux/baseApi";
import { IResponse, IRole, CreateRolePayload, UpdateRolePayload } from "@/types";

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<any, any>({
      query: (params) => ({ url: "/roles", method: "GET", params }),
      transformResponse: (res: any) => res.data,
      providesTags: ["ROLE"],
    }),
    getRoleById: builder.query<IRole, number>({
      query: (id) => ({ url: `/roles/${id}`, method: "GET" }),
      transformResponse: (res: IResponse<IRole>) => res.data,
      providesTags: (_result, _error, id) => [{ type: "ROLE", id }],
    }),
    createRole: builder.mutation<IRole, CreateRolePayload>({
      query: (body) => ({ url: "/roles", method: "POST", data: body }),
      transformResponse: (res: IResponse<IRole>) => res.data,
      invalidatesTags: ["ROLE"],
    }),
    updateRole: builder.mutation<IRole, { id: number; body: UpdateRolePayload }>({
      query: ({ id, body }) => ({ url: `/roles/${id}`, method: "PUT", data: body }),
      transformResponse: (res: IResponse<IRole>) => res.data,
      invalidatesTags: ["ROLE"],
    }),
    deleteRole: builder.mutation<void, number>({
      query: (id) => ({ url: `/roles/${id}`, method: "DELETE" }),
      invalidatesTags: ["ROLE"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
