import { baseApi } from "@/redux/baseApi";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (params) => ({
        url: "/categories",
        method: "GET",
        params,
      }),
      providesTags: ["CATEGORY"],
    }),
    getCategoryById: builder.query({
      query: (id: number) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "CATEGORY", id }],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        data,
      }),
      invalidatesTags: ["CATEGORY"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["CATEGORY"],
    }),
    deleteCategory: builder.mutation({
      query: (id: number) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CATEGORY"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
