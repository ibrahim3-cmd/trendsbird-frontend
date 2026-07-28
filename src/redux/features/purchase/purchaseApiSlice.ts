/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";

interface CreatePurchasePayload {
  orgEmail: string;
  orgName: string;
  orgPhone: string;
  planId: string;
  billingInfo: {
    paymentMethodId: string;
  };
}

interface UpdatePlanPurchasePayload {
  orgId: string;
  planId: string;
  billingInfo?: {
    paymentMethodId: string;
  };
  userId?: string;
}

export const purchaseApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPurchase: builder.mutation<any, CreatePurchasePayload>({
      query: (purchaseData) => ({
        url: "/purchase",
        method: "POST",
        data: purchaseData,
      }),
    }),

    updatePlanPurchase: builder.mutation<any, UpdatePlanPurchasePayload>({
      query: (purchaseData) => ({
        url: "/purchase/change-plan",
        method: "POST",
        data: purchaseData,
      }),
    }),
  }),
});

export const { useCreatePurchaseMutation, useUpdatePlanPurchaseMutation } =
  purchaseApiSlice;
