import { baseApi } from "@/redux/baseApi";
import { LogQuery } from "@/types/log.type";
import { ILog } from "@/types/log.type";

// Update the interface to match your API response
interface LogsResponse {
  data: ILog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

interface ActionTypesResponse {
  data: string[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export const logApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLogs: builder.query<LogsResponse, LogQuery>({
      query: (q) => {
        const params = new URLSearchParams();
        
        if (q?.page) params.set("page", String(q.page));
        if (q?.limit) params.set("limit", String(q.limit));
        if (q?.user) params.set("user", q.user);
        if (q?.action) params.set("action", q.action);
        if (q?.actions && q.actions.length > 0) params.set("actions", q.actions.join(','));
        if (q?.startDate) params.set("startDate", q.startDate);
        if (q?.endDate) params.set("endDate", q.endDate);
        if (q?.sortBy) params.set("sortBy", q.sortBy);
        if (q?.sortOrder) params.set("sortOrder", q.sortOrder);
        if (q?.search) params.set("search", q.search);
        if (q?.orgId) params.set("orgId", q.orgId);

        return {
          url: `/logs?${params.toString()}`,
          method: "GET",
        };
      },
      // Remove transformResponse to get the full response
      providesTags: ["LOG"],
    }),

    getAllActionTypes: builder.query<ActionTypesResponse, void>({
      query: () => ({
        url: `/logs/actions`,
        method: "GET",
      }),
      // Remove transformResponse to get the full response
      providesTags: ["LOG"],
    }),
  }),
});

export const {
  useGetLogsQuery,
  useGetAllActionTypesQuery,
} = logApiSlice;