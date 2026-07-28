import { baseApi } from "@/redux/baseApi";
import { ApiEnvelope } from "@/types";
import { Org } from "@/types/org.type";

interface UpdateOrgBillingInfoPayload {
  orgId?: string;
  billingInfo: {
    paymentMethodId: string;
  };
}

// interface UpdateOrgBillingDatesPayload {
//   planStartDate?: string;
//   nextBillingDate?: string;
// }

export const orgApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrg: builder.query({
      query: (q) => {
        const params = new URLSearchParams();
        if (q?.page) params.set("page", String(q.page));
        if (q?.limit) params.set("limit", String(q.limit));
        if (q?.searchTerm) params.set("searchTerm", q.searchTerm);
        return {
          url: `/org?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ['ORG'],
    }),
    getSingleOrg: builder.query({
      query: (orgId) => ({
        url: `/org/${orgId}`,
      }),
      transformResponse: (res: ApiEnvelope<Org>) => res.data,
      providesTags: (_, __, orgId) => [{ type: 'ORG', id: orgId }],
    }),

    updateOrg: builder.mutation({
      query: (body) => ({
        url: `/org/${body.id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'ORG', id },
        'ORG',
      ],
    }),
    
    updateOrgBillingInfo: builder.mutation<ApiEnvelope<Org>, UpdateOrgBillingInfoPayload>({
      query: (body) => ({
        url: `/org/update-billing-info`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ['ORG'],
    }),

    // updateOrgBillingDates: builder.mutation<ApiEnvelope<Org>, UpdateOrgBillingDatesPayload>({
    //   query: (body) => ({
    //     url: `/org/update-date`,
    //     method: "PATCH",
    //     data: body,
    //   }),
    //   invalidatesTags: ['ORG'],
    // }),

  }),
});

export const { useGetSingleOrgQuery, useGetAllOrgQuery, useUpdateOrgMutation, useUpdateOrgBillingInfoMutation } = orgApiSlice;
