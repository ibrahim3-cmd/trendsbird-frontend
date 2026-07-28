// redux/features/email/emailApiSlice.ts
import { baseApi } from "@/redux/baseApi";

export const emailApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Email Logs
    getEmailLogs: builder.query({
      query: (params: {
        page?: string; // Changed to string
        limit?: string; // Changed to string
        search?: string;
        status?: string;
        automation?: string;
        lead?: string;
        startDate?: string;
        endDate?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
      }) => ({
        url: "/email-logs",
        method: "GET",
        params,
      }),
      providesTags: ['EMAIL_LOGS'],
    }),

    getEmailLogById: builder.query({
      query: (id: string) => ({
        url: `/email-logs/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: 'EMAIL_LOG' as const, id }],
    }),

    getEmailAnalytics: builder.query({
      query: (params?: { startDate?: string; endDate?: string }) => ({
        url: "/email-logs/analytics",
        method: "GET",
        params,
      }),
      providesTags: ['EMAIL_ANALYTICS'],
    }),

    getEmailLogsByAutomation: builder.query({
      query: ({ automationId, ...params }: { 
        automationId: string; 
        page?: string; // Changed to string
        limit?: string; // Changed to string
        search?: string;
        status?: string;
      }) => ({
        url: `/email-logs/automation/${automationId}`,
        method: "GET",
        params,
      }),
      providesTags: (_result, _error, { automationId }) => [
        { type: 'AUTOMATION_EMAIL_LOGS' as const, id: automationId }
      ],
    }),

    getEmailLogsByLead: builder.query({
      query: ({ leadId, ...params }: { 
        leadId: string; 
        page?: string; // Changed to string
        limit?: string; // Changed to string
        search?: string;
        status?: string;
      }) => ({
        url: `/email-logs/lead/${leadId}`,
        method: "GET",
        params,
      }),
      providesTags: (_result, _error, { leadId }) => [
        { type: 'LEAD_EMAIL_LOGS' as const, id: leadId }
      ],
    }),

    retryFailedEmail: builder.mutation({
      query: (logId: string) => ({
        url: `/email-logs/${logId}/retry`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, logId) => [
        { type: 'EMAIL_LOG' as const, id: logId },
        'EMAIL_LOGS',
        'EMAIL_ANALYTICS'
      ],
    }),

    cleanupOldLogs: builder.mutation({
      query: (days: number) => ({
        url: "/email-logs/cleanup",
        method: "POST",
        body: { days },
      }),
      invalidatesTags: ['EMAIL_LOGS', 'EMAIL_ANALYTICS'],
    }),

    exportEmailLogs: builder.mutation({
      query: (params: {
        startDate?: string;
        endDate?: string;
        status?: string;
        automation?: string;
      }) => ({
        url: "/email-logs/export",
        method: "POST",
        body: params,
        responseHandler: async (response: Response) => {
          if (!response.ok) {
            throw new Error('Export failed');
          }
          return response.blob();
        },
      }),
    }),

    // Email Sending
    sendEmail: builder.mutation({
      query: (payload) => ({
        url: "/email/send",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ['EMAIL_LOGS', 'EMAIL_ANALYTICS'],
    }),

    queueEmail: builder.mutation({
      query: (payload) => ({
        url: "/email/queue",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ['EMAIL_LOGS'],
    }),

    // Email Configurations
    getAvailableEmailProviders: builder.query({
      query: () => ({
        url: "/email-config/providers",
        method: "GET",
      }),
      providesTags: ['EMAIL_CONFIG'],
    }),

    setupEmailConfig: builder.mutation({
      query: (payload) => ({
        url: "/email-config/setup",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ['EMAIL_CONFIG'],
    }),

    getEmailConfig: builder.query({
      query: () => ({
        url: "/email-config",
        method: "GET",
      }),
      providesTags: ['EMAIL_CONFIG'],
    }),

    testEmailConfig: builder.mutation({
      query: (payload) => ({
        url: "/email-config/test",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ['EMAIL_CONFIG'],
    }),
  }),
});

export const {
  // Email Logs
  useGetEmailLogsQuery,
  useGetEmailLogByIdQuery,
  useGetEmailAnalyticsQuery,
  useGetEmailLogsByAutomationQuery,
  useGetEmailLogsByLeadQuery,
  useRetryFailedEmailMutation,
  useCleanupOldLogsMutation,
  useExportEmailLogsMutation,
  
  // Email Sending
  useSendEmailMutation,
  useQueueEmailMutation,
  
  // Email Config
  useGetAvailableEmailProvidersQuery,
  useSetupEmailConfigMutation,
  useGetEmailConfigQuery,
  useTestEmailConfigMutation,
} = emailApiSlice;