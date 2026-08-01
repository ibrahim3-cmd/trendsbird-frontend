import { baseApi } from "@/redux/baseApi";

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadMedia: builder.mutation({
      query: (formData: FormData) => ({
        url: "/media/upload",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["MEDIA"],
    }),
    getMedia: builder.query({
      query: (params) => ({
        url: "/media",
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.media.map((media: any) => ({ type: "MEDIA" as const, id: media.id })),
              { type: "MEDIA", id: "LIST" },
            ]
          : [{ type: "MEDIA", id: "LIST" }],
    }),
    deleteMedia: builder.mutation({
      query: (id: number) => ({
        url: `/media/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MEDIA"],
    }),
    updateMedia: builder.mutation({
      query: ({ id, data }) => ({
        url: `/media/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["MEDIA"],
    }),
  }),
});

export const {
  useUploadMediaMutation,
  useGetMediaQuery,
  useDeleteMediaMutation,
  useUpdateMediaMutation,
} = mediaApi;
