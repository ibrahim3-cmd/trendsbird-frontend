import { baseApi } from "@/redux/baseApi";
import { ApiEnvelope } from "@/types";
import { IContact, IContactQuery } from "@/types/contact.type";

export const contactApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<
      ApiEnvelope<IContact[]> & { meta: { page: number; limit: number; total: number; totalPage: number } },
      IContactQuery
    >({
      query: (q) => {
        const params = new URLSearchParams();
        if (q?.page) params.set("page", String(q.page));
        if (q?.limit) params.set("limit", String(q.limit));
        if (q?.searchTerm) params.set("searchTerm", q.searchTerm);
        return {
          url: `/contacts?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["CONTACT"],
    }),

    getSingleContact: builder.query<IContact, string>({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: "GET",
      }),
      transformResponse: (res: ApiEnvelope<IContact>) => res.data,
      providesTags: ["SINGLE_CONTACT"],
    }),

    createContact: builder.mutation({
      query: (body) => ({
        url: `/contacts`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["CONTACT"],
    }),

    updateContact: builder.mutation<IContact, Partial<IContact> & Pick<IContact, "_id">>({
      query: (body) => ({
        url: `/contacts/${body._id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: ["CONTACT"],
    }),

    deleteContact: builder.mutation<string, string>({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CONTACT"],
    }),
    getAllTags: builder.query<string[], void>({
      query: () => ({
        url: `/contacts/tags/all`,
        method: "GET",
      }),
      providesTags: ["CONTACT"],
    }),
    getUsersCountByTags: builder.mutation<{ data: { count: number } }, { tags: string[] }>({
      query: (data) => ({
        url: "/contacts/tags/count-by",
        method: "POST",
        data: data,
      }),
    }),
  }),
});

export const {
  useGetContactsQuery,
  useGetSingleContactQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useGetAllTagsQuery,
  useGetUsersCountByTagsMutation
} = contactApiSlice;
