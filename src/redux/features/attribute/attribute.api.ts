import { baseApi } from "@/redux/baseApi";

export const attributeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttributes: builder.query({
      query: (params) => ({
        url: "/attributes",
        method: "GET",
        params,
      }),
      providesTags: ["ATTRIBUTE"],
    }),
    getAttributeById: builder.query({
      query: (id: number) => ({
        url: `/attributes/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "ATTRIBUTE", id }],
    }),
    createAttribute: builder.mutation({
      query: (data) => ({
        url: "/attributes",
        method: "POST",
        data,
      }),
      invalidatesTags: ["ATTRIBUTE"],
    }),
    updateAttribute: builder.mutation({
      query: ({ id, data }) => ({
        url: `/attributes/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["ATTRIBUTE"],
    }),
    deleteAttribute: builder.mutation({
      query: (id: number) => ({
        url: `/attributes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ATTRIBUTE"],
    }),
  }),
});

export const {
  useGetAttributesQuery,
  useGetAttributeByIdQuery,
  useCreateAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
} = attributeApi;
