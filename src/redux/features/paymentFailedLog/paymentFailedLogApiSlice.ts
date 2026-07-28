import { baseApi } from "@/redux/baseApi";
import {
  IPaymentFailedLog,
  PaymentFailedLogQuery,
  PaymentFailedLogStats,
  UpdatePaymentFailedLogInput,
} from "@/types/paymentFailedLog.type";

export const paymentFailedLogApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all payment failed logs with filtering
    getPaymentFailedLogs: builder.query<
      {
        success: boolean;
        message: string;
        data: IPaymentFailedLog[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPage: number;
        };
      },
      PaymentFailedLogQuery
    >({
      query: (params) => ({
        url: "/payment-failed-logs",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.data.map(({ _id }) => ({
              type: "PaymentFailedLog" as const,
              id: _id,
            })),
            { type: "PaymentFailedLog", id: "LIST" },
          ]
          : [{ type: "PaymentFailedLog", id: "LIST" }],
    }),

    // Get single payment failed log by ID
    getPaymentFailedLogById: builder.query<
      {
        success: boolean;
        message: string;
        data: IPaymentFailedLog;
      },
      string
    >({
      query: (id) => ({
        url: `/payment-failed-logs/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [
        { type: "PaymentFailedLog", id },
      ],
    }),

    // Get payment failed log statistics
    getPaymentFailedLogStats: builder.query<
      {
        success: boolean;
        message: string;
        data: PaymentFailedLogStats;
      },
      string | void
    >({
      query: (orgId) => ({
        url: "/payment-failed-logs/stats",
        method: "GET",
        params: orgId ? { orgId } : undefined,
      }),
      providesTags: ["PaymentFailedLogStats"],
    }),

    // Update payment failed log (mark as resolved, etc.)
    updatePaymentFailedLog: builder.mutation<
      {
        success: boolean;
        message: string;
        data: IPaymentFailedLog;
      },
      { id: string; data: UpdatePaymentFailedLogInput }
    >({
      query: ({ id, data }) => ({
        url: `/payment-failed-logs/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "PaymentFailedLog", id },
        { type: "PaymentFailedLog", id: "LIST" },
        "PaymentFailedLogStats",
      ],
    }),

    // Delete payment failed log
    deletePaymentFailedLog: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      string
    >({
      query: (id) => ({
        url: `/payment-failed-logs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "PaymentFailedLog", id: "LIST" },
        "PaymentFailedLogStats",
      ],
    }),
  }),
});

export const {
  useGetPaymentFailedLogsQuery,
  useGetPaymentFailedLogByIdQuery,
  useGetPaymentFailedLogStatsQuery,
  useUpdatePaymentFailedLogMutation,
  useDeletePaymentFailedLogMutation,
} = paymentFailedLogApiSlice;
