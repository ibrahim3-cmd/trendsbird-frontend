// redux/features/payment/paymentApiSlice.ts
import { baseApi } from "@/redux/baseApi";
import { IPayment, PaymentQuery, PaginatedPayments, PaymentStats, CreatePaymentInput, UpdatePaymentInput } from "@/types/payment.type";

export const paymentApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<PaginatedPayments, PaymentQuery>({
      query: (queryParams) => ({
        url: "/payments/all",
        method: "GET",
        params: queryParams,
      }),
      providesTags: ["PAYMENT"],
    }),

    getPaymentById: builder.query<{ data: IPayment }, string>({
      query: (id) => ({
        url: `/payments/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "PAYMENT" as const, id }],
    }),

    getPaymentsByOrgId: builder.query<PaginatedPayments, { orgId: string; queryParams: PaymentQuery }>({
      query: ({ orgId, queryParams }) => ({
        url: `/payments/org/${orgId}`,
        method: "GET",
        params: queryParams,
      }),
      providesTags: ["PAYMENT"],
    }),

    getPaymentStats: builder.query<{ data: PaymentStats }, void>({
      query: () => ({
        url: "/payments/stats",
        method: "GET",
      }),
      providesTags: ["PAYMENT"],
    }),

    createPayment: builder.mutation<{ data: IPayment }, CreatePaymentInput>({
      query: (data) => ({
        url: "/payments",
        method: "POST",
        data,
      }),
      invalidatesTags: ["PAYMENT"],
    }),

    updatePayment: builder.mutation<{ data: IPayment }, { id: string; data: UpdatePaymentInput }>({
      query: ({ id, data }) => ({
        url: `/payments/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "PAYMENT",
        { type: "PAYMENT" as const, id },
      ],
    }),

    deletePayment: builder.mutation<{ data: IPayment }, string>({
      query: (id) => ({
        url: `/payments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PAYMENT"],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetPaymentsByOrgIdQuery,
  useGetPaymentStatsQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = paymentApiSlice;