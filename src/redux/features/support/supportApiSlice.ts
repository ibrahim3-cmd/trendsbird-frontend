import { baseApi } from "@/redux/baseApi";

const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Segment endpoints
    createSupportTicket: builder.mutation({
      query: (data) => {
        // Check if data is FormData
        if (data instanceof FormData) {
          return {
            url: `support/tickets`,
            method: "POST",
            data: data,
            headers: {
              // Let axios automatically set the Content-Type with boundary for FormData
              // Don't set Content-Type manually
            },
          };
        } else {
          return {
            url: `support/tickets`,
            method: "POST",
            data: data,
          };
        }
      },
      invalidatesTags: ["SUPPORT"],
    }),
    createPublicSupportTicket: builder.mutation({
      query: (data) => ({
        url: `support/public/tickets`,
        method: "POST",
        data: data,
        // formData: true,
      }),
      invalidatesTags: ["SUPPORT"],
    }),
    getAllSupportTickets: builder.query({
      query: (params) => ({
        url: "support/tickets",
        params,
      }),
      providesTags: ["SUPPORT"],
    }),
    getUserSupportTickets: builder.query({
      query: ({ userId, ...params }) => ({
        url: `support/users/${userId}/tickets`,
        params,
      }),
      providesTags: ["SUPPORT"],
    }),
    getSingleSupportTicket: builder.query({
      query: (id) => ({
        url: `support/tickets/${id}`,
      }),
      providesTags: ["SUPPORT"],
    }),
    updateSupportTicketStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `support/tickets/${id}/status`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["SUPPORT"],
    }),
    deleteSupportTicket: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `support/tickets/${id}`,
        method: "DELETE",
        data: data,
      }),
      invalidatesTags: ["SUPPORT"],
    }),
    assignSupportTicket: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `support/tickets/${id}/assign`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["SUPPORT"],
    }),

    // Comment APIs
    addCommentToTicket: builder.mutation({
      query: ({ ticketId, ...data }) => ({
        url: `support-comments/tickets/${ticketId}/comments`,
        method: "POST",
        data: data,
      }),
      // invalidatesTags: ["SUPPORT"],
    }),
    getTicketComments: builder.query({
      query: (ticketId) => ({
        url: `support-comments/tickets/${ticketId}/comments`,
      }),
      // providesTags: ["SUPPORT"],
    }),

    updateComment: builder.mutation({
      query: ({ commentId, ...data }) => ({
        url: `support-comments/comments/${commentId}`,
        method: "PUT",
        data: data,
      }),
      // invalidatesTags: ["SUPPORT"],
    }),
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `support-comments/comments/${commentId}`,
        method: "DELETE",
      }),
      // invalidatesTags: ["SUPPORT"],
    }),

    // Support Category APIs
    createSupportCategory: builder.mutation({
      query: ({ data }) => ({
        url: "support-category/add-category",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["SUPPORTCATEGORIES"],
    }),

    getSupportCategories: builder.query<any, void>({
      query: () => ({
        url: `support-category/categories`,
      }),
      providesTags: ["SUPPORTCATEGORIES"],
    }),

    updateSupportCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `support-category/update-category/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["SUPPORTCATEGORIES"],
    }),

    deleteSupportCategory: builder.mutation({
      query: (id) => ({
        url: `support-category/delete-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SUPPORTCATEGORIES"],
    }),

    updateSupportTicketCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `support/tickets/${id}/category`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["SUPPORT"],
    }),
    // Delete support ticket attachment
    deleteSupportTicketAttachment: builder.mutation({
      query: ({ ticketId, fileName }) => ({
        url: `support/tickets/${ticketId}/attachment/${fileName}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SUPPORT"],
    }),

    // getTicketActivities: builder.query({
    //   query: ({ ticketId, page = 1, limit = 20, search = "" }) => ({
    //     url: `support/tickets/${ticketId}/activities`,
    //     params: { page, limit, search },
    //   }),
    // }),

    requestTicketTransfer: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `support/tickets/${id}/transfer`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["SUPPORT"],
    }),
    manageTicketTransfer: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `support/tickets/${id}/transfer/manage`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["SUPPORT"],
    }),
    cancelTicketTransfer: builder.mutation({
      query: ({ id }) => ({
        url: `support/tickets/${id}/transfer/cancel`,
        method: "PUT",
      }),
      invalidatesTags: ["SUPPORT"],
    }),
    // getTicketActivities: builder.query({
    //   query: ({ ticketId, page = 1, limit = 20, search = "" }) => {
    //     console.log("ti = ",ticketId)
    //     // Ensure ticketId is valid
    //     if (!ticketId) {
    //       throw new Error("ticketId is required");
    //     }
        
    //     return {
    //       url: `support-activity-log/tickets/${ticketId}/activities`,
    //       params: { 
    //         page, 
    //         limit, 
    //         search: typeof search === "string" ? search : "" 
    //       },
    //     };
    //   },
    // }),
    getTicketActivities: builder.query({
      query: ({ ticketId, page = 1, limit = 20, filterType = "all" }) => {
        if (!ticketId) {
          throw new Error("ticketId is required");
        }
        
        return {
          url: `support-activity-log/tickets/${ticketId}/activities`,
          params: { 
            page, 
            limit, 
            filterType,
          },
        };
      },
      providesTags: ["SUPPORT", "SUPPORTCATEGORIES"]

    })
  }),
});

export const {
  useCreateSupportTicketMutation,
  useCreatePublicSupportTicketMutation,
  useGetAllSupportTicketsQuery,
  useGetUserSupportTicketsQuery,
  useAddCommentToTicketMutation,
  useDeleteCommentMutation,
  useGetTicketCommentsQuery,
  useUpdateCommentMutation,
  useGetSingleSupportTicketQuery,
  useUpdateSupportTicketStatusMutation,
  useDeleteSupportTicketMutation,
  useAssignSupportTicketMutation,
  useGetSupportCategoriesQuery,
  useCreateSupportCategoryMutation,
  useUpdateSupportCategoryMutation,
  useDeleteSupportCategoryMutation,
  useUpdateSupportTicketCategoryMutation,
  useDeleteSupportTicketAttachmentMutation,
  useGetTicketActivitiesQuery,

  useCancelTicketTransferMutation,
  useManageTicketTransferMutation,
  useRequestTicketTransferMutation
} = supportApi;
