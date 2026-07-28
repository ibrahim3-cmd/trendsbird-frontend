import { baseApi } from "@/redux/baseApi";
import {
	CategoryListResponse,
	IEmailTemplate,
	ITemplateCategory,
	ITemplateQuery,
	TemplateListResponse,
} from "@/types/emailTemplate.type";

// Notes:
// - Backend routes as provided:
//   Categories: /email-templates/categories [GET, POST]; /email-templates/categories/:id [PUT, DELETE]
//   Templates:  /email-templates [GET, POST]; /email-templates/:id [GET, PUT, DELETE]
// - These endpoints return envelope { statusCode, success, message, data, meta? }

export const emailTemplateApiSlice = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Categories
		getTemplateCategories: builder.query<CategoryListResponse, { page: number , limit: number } | null>({
			query: (params) => ({
				url: "/email-templates/categories",
				method: "GET",
				params: params || undefined,
			}),
			providesTags: ["TEMPLATE_CATEGORY"],
			transformResponse: (response: CategoryListResponse) => response,
		}),

		createTemplateCategory: builder.mutation<ITemplateCategory, Partial<ITemplateCategory>>({
			query: (body) => ({
				url: "/email-templates/categories",
				method: "POST",
				data: body,
			}),
			invalidatesTags: ["TEMPLATE_CATEGORY"],
			transformResponse: (response: { data: ITemplateCategory }) => response.data,
		}),

		updateTemplateCategory: builder.mutation<ITemplateCategory, { id: string } & Partial<ITemplateCategory>>({
			query: ({ id, ...body }) => ({
				url: `/email-templates/categories/${id}`,
				method: "PUT",
				data: body,
			}),
			invalidatesTags: ["TEMPLATE_CATEGORY", "EMAIL_TEMPLATE"],
			transformResponse: (response: { data: ITemplateCategory }) => response.data,
		}),

		deleteTemplateCategory: builder.mutation<{ deletedId: string }, string>({
			query: (id) => ({
				url: `/email-templates/categories/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["TEMPLATE_CATEGORY", "EMAIL_TEMPLATE"],
			transformResponse: (response: { data: { deletedId: string } }) => response.data,
		}),

		// Templates
		getTemplates: builder.query<TemplateListResponse, ITemplateQuery | void>({
			query: (params = {}) => ({
				url: "/email-templates",
				method: "GET",
				params,
			}),
			providesTags: ["EMAIL_TEMPLATE"],
			transformResponse: (response: TemplateListResponse) => response,
		}),

		getTemplateById: builder.query<IEmailTemplate, string>({
			query: (id) => ({
				url: `/email-templates/${id}`,
				method: "GET",
			}),
			providesTags: ["EMAIL_TEMPLATE"],
			transformResponse: (response: { data: IEmailTemplate }) => response.data,
		}),

		createTemplate: builder.mutation<
			IEmailTemplate,
			Partial<IEmailTemplate & { orgId?: string | null; targetOrgId?: string | null; org?: string | null }>
		>({
			query: (body) => ({
				url: "/email-templates",
				method: "POST",
				data: body,
			}),
			invalidatesTags: ["EMAIL_TEMPLATE"],
			transformResponse: (response: { data: IEmailTemplate }) => response.data,
		}),

		updateTemplate: builder.mutation<
			IEmailTemplate,
			{ id: string } & Partial<IEmailTemplate & { orgId?: string | null; targetOrgId?: string | null; org?: string | null }>
		>({
			query: ({ id, ...body }) => ({
				url: `/email-templates/${id}`,
				method: "PUT",
				data: body,
			}),
			invalidatesTags: ["EMAIL_TEMPLATE"],
			transformResponse: (response: { data: IEmailTemplate }) => response.data,
		}),

		deleteTemplate: builder.mutation<{ deletedId: string }, string>({
			query: (id) => ({
				url: `/email-templates/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["EMAIL_TEMPLATE"],
			transformResponse: (response: { data: { deletedId: string } }) => response.data,
		}),

		// Test send a template by id
		testSendTemplate: builder.mutation<
			// The backend returns an envelope; for now expose the inner `data` as unknown
			unknown,
			{ id: string; to: string | string[]; data?: Record<string, unknown>; subjectOverride?: string; orgId?: string }
		>({
			query: ({ id, ...body }) => ({
				url: `/email-templates/${id}/test-send`,
				method: "POST",
				data: body,
			}),
			// No cache tags affected; this triggers an action, not a resource change
			transformResponse: (response: { data: unknown }) => response.data,
		}),
	}),
});

export const {
	useGetTemplateCategoriesQuery,
	useCreateTemplateCategoryMutation,
	useUpdateTemplateCategoryMutation,
	useDeleteTemplateCategoryMutation,
	useGetTemplatesQuery,
	useGetTemplateByIdQuery,
	useCreateTemplateMutation,
	useUpdateTemplateMutation,
	useDeleteTemplateMutation,
	useTestSendTemplateMutation,
} = emailTemplateApiSlice;
