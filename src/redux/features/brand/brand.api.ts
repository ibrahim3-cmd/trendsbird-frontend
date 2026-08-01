import { baseApi } from "@/redux/baseApi";

export const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: (params) => ({
        url: "/brands",
        method: "GET",
        params,
      }),
      providesTags: ["BRAND"],
    }),
    getBrandById: builder.query({
      query: (id: number) => ({
        url: `/brands/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "BRAND", id }],
    }),
    createBrand: builder.mutation({
      query: (data) => ({
        url: "/brands",
        method: "POST",
        data,
      }),
      invalidatesTags: ["BRAND"],
    }),
    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `/brands/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["BRAND"],
    }),
    deleteBrand: builder.mutation({
      query: (id: number) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BRAND"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
