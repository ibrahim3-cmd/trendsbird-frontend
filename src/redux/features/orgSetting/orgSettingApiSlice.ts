import { baseApi } from "@/redux/baseApi";

export const orgSettingsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgSettingById: builder.query({
      query: (orgId) => ({
        url: `/org-settings/setting/${orgId}`,
      }),
      providesTags: ["ORG_SETTINGS"],
    }),

    createMyOrgSetting: builder.mutation({
      query: (orgData) => ({
        url: "/org-settings/create-my-setting",
        method: "POST",
        data: orgData,
      }),
      invalidatesTags: ["ORG_SETTINGS"],
    }),
    updateMyOrgSetting: builder.mutation({
      query: (updatedOrgSetting) => ({
        url: `/org-settings/update-my-setting`,
        method: "PATCH",
        data: updatedOrgSetting,
      }),
      invalidatesTags: ["ORG_SETTINGS"],
    }),
  }),
});

export const { useGetOrgSettingByIdQuery, useCreateMyOrgSettingMutation, useUpdateMyOrgSettingMutation } = orgSettingsApiSlice;
