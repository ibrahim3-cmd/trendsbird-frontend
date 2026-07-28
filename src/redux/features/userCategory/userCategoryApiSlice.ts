import { baseApi } from "@/redux/baseApi";
import { CreateUserCategoryInput, IUserCategory, PaginatedUserCategories, UpdateUserCategoryInput, UserCategoryQuery, UserCategoryStats } from "@/types/userCategory.types";

export const userCategoryApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all user categories with pagination and search
    getUserCategories: builder.query<PaginatedUserCategories, UserCategoryQuery | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params?.page) queryParams.set("page", String(params.page));
        if (params?.limit) queryParams.set("limit", String(params.limit));
        if (params?.search) queryParams.set("search", params.search);

        return {
          url: `/user-categories?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["USER_CATEGORY"],
    }),

    // Get single user category by ID
    getUserCategory: builder.query<IUserCategory, string>({
      query: (id) => ({
        url: `/user-categories/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "USER_CATEGORY", id }],
    }),

    // Get user category statistics
    getUserCategoryStats: builder.query<UserCategoryStats, void>({
      query: () => ({
        url: "/user-categories/stats",
        method: "GET",
      }),
      providesTags: ["USER_CATEGORY"],
    }),

    // Create a new user category
    createUserCategory: builder.mutation<IUserCategory, CreateUserCategoryInput>({
      query: (data) => ({
        url: "/user-categories",
        method: "POST",
        data,
      }),
      invalidatesTags: ["USER_CATEGORY"],
    }),

    // Update a user category
    updateUserCategory: builder.mutation<IUserCategory, { id: string; data: UpdateUserCategoryInput }>({
      query: ({ id, data }) => ({
        url: `/user-categories/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "USER_CATEGORY",
        { type: "USER_CATEGORY", id },
      ],
    }),

    // Delete a user category
    deleteUserCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/user-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["USER_CATEGORY"],
    }),
  }),
});

export const {
  useGetUserCategoriesQuery,
  useGetUserCategoryQuery,
  useGetUserCategoryStatsQuery,
  useCreateUserCategoryMutation,
  useUpdateUserCategoryMutation,
  useDeleteUserCategoryMutation,
} = userCategoryApiSlice;
