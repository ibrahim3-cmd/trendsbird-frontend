import config from "@/config";
import axios from "axios";
import { triggerSystemError } from "./errorHandler";

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add Calendly token for Calendly endpoints
    if (config.url?.includes('/calendly/')) {
      const calendlyToken = localStorage.getItem('calendly_access_token');
      if (calendlyToken) {
        config.headers.Authorization = `Bearer ${calendlyToken}`;
      }
    }
    
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function onRejected(error) {
    if (error.response?.status >= 500 && error.config?.method?.toUpperCase() !== 'GET') {
      triggerSystemError();
    }
       // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);