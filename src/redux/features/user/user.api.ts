import { baseApi } from "@/redux/baseApi";
import { IResponse, IUser, CreateUserPayload, UpdateUserPayload } from "@/types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<any, any>({
      query: (params) => ({ url: "/users", method: "GET", params }),
      transformResponse: (res: any) => res.data,
      providesTags: ["USER"],
    }),
    getUserById: builder.query<IUser, number>({
      query: (id) => ({ url: `/users/${id}`, method: "GET" }),
      transformResponse: (res: IResponse<IUser>) => res.data,
      providesTags: (_result, _error, id) => [{ type: "USER", id }],
    }),
    createUser: builder.mutation<IUser, CreateUserPayload>({
      query: (body) => ({ url: "/users", method: "POST", data: body }),
      transformResponse: (res: IResponse<IUser>) => res.data,
      invalidatesTags: ["USER"],
    }),
    updateUser: builder.mutation<IUser, { id: number; body: UpdateUserPayload }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: "PUT", data: body }),
      transformResponse: (res: IResponse<IUser>) => res.data,
      invalidatesTags: ["USER"],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
