import { baseApi } from "@/redux/baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params,
      }),
      providesTags: ["PRODUCT"],
    }),
    getProductById: builder.query({
      query: (id: number) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "PRODUCT", id }],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        data,
      }),
      invalidatesTags: ["PRODUCT"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["PRODUCT"],
    }),
    deleteProduct: builder.mutation({
      query: (id: number) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRODUCT"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
