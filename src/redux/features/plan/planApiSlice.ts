import { baseApi } from "@/redux/baseApi";
import { ApiEnvelope } from "@/types";
import { Plan } from "@/types/plan.type";

export const planApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<Plan[], void>({
      query: () => ({
        url: "/plan",
        method: "GET",
      }),
      transformResponse: (res: ApiEnvelope<Plan[]>) => res.data,
    }),
    createPlan: builder.mutation({
      query: (newPlan) => ({
        url: '/plan',
        method: 'POST',
        data: newPlan,
      }),
    }),
    updatePlan: builder.mutation({
      query: ({ id, ...updatedPlan }) => ({
        url: `/plan/${id}`,
        method: 'PATCH',
        data: updatedPlan,
      }),
    }),
    deletePlan: builder.mutation({
      query: (id) => ({
        url: `/plan/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = planApiSlice;
