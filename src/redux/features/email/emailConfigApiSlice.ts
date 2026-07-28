import { baseApi } from "@/redux/baseApi";

export const emailConfigApiSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendEmail: builder.mutation({
            query: (payload) => ({
                url: "/email",
                method: "POST",
                data: payload,
            }),
        }),
        getAvailableEmailProviders: builder.query({
            query: () => ({
                url: "/email-config/providers",
                method: "GET",
            }),
        }),

        setupEmailConfig: builder.mutation({
            query: (payload) => ({
                url: "/email-config/setup",
                method: "POST",
                data: payload,
            }),
        }),

        getEmailConfig: builder.query({
            query: () => ({
                url: "/email-config",
                method: "GET",
            }),
        }),

        // Check organization-level email configuration status
        getEmailOrganizationConfigurationStatus: builder.query<any, string>({
            query: (orgId: string) => ({
                url: `/email/organizations/${orgId}/configuration-status`,
                method: "GET",
            }),
        }),

        testEmailConfig: builder.mutation({
            query: (payload) => ({
                url: "/email-config/test",
                method: "POST",
                data: payload,
            }),
        }),
    }),
});

export const { useSendEmailMutation, useGetAvailableEmailProvidersQuery, useSetupEmailConfigMutation, useGetEmailConfigQuery, useTestEmailConfigMutation, useGetEmailOrganizationConfigurationStatusQuery } = emailConfigApiSlice;