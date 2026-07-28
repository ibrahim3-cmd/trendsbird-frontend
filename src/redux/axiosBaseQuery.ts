import { axiosInstance } from "@/lib/axios";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosError, AxiosRequestConfig } from "axios";

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
    async ({ url, method, data, params, headers }) => {
      try {
        console.log("Axios Base Query Request:", { url, method, data, params, headers });
        
        // If data is FormData, let axios handle the Content-Type automatically
        // by not setting the Content-Type header explicitly
        const config: AxiosRequestConfig = {
          url: url,
          method,
          params,
          headers,
        };
        
        // Only set data if it's not FormData, or let axios handle it naturally
        if (data instanceof FormData) {
          config.data = data;
          // Don't set Content-Type header - let axios handle it automatically
          // This ensures the boundary is included automatically
        } else {
          config.data = data;
        }
        
        const result = await axiosInstance(config);
        console.log("Axios Base Query Response:", result.data);
        return { data: result.data };
      } catch (axiosError) {
        const err = axiosError as AxiosError;
        return {
          error: {
            status: err.response?.status,
            data: err.response?.data || err.message,
          },
        };
      }
    };

export default axiosBaseQuery;
