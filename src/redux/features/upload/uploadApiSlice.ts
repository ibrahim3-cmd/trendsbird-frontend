import { planApiSlice } from "../plan/planApiSlice";

export const uploadApiSlice = planApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        uploadFile: builder.mutation({
            query: (formData) => {
                console.log(formData)
                const url = `/upload/single`;

                return {
                    url,
                    method: "POST",
                    data: formData,
                    formData: true,  // Ensure correct content type
                };
            },
            invalidatesTags: ['FILES'], // Invalidate Files tag after upload
        }),

        deleteFile: builder.mutation({
            query: (fileId) => ({
                url: `/upload/${fileId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['FILES'],
        }),
    })
});


export const { useUploadFileMutation, useDeleteFileMutation } = uploadApiSlice;