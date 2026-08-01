import config from "@/config";
import axios from "axios";
import { triggerSystemError } from "./errorHandler";

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
});

const authClient = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("permissions");
  localStorage.removeItem("role");
};

const publicAuthPaths = ["/auth/login", "/auth/refresh", "/auth/logout", "/maintenance/reset-database"];

const isPublicAuthRequest = (url?: string) =>
  Boolean(url && publicAuthPaths.some((path) => url.includes(path)));

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = authClient
      .post("/auth/refresh")
      .then((response) => {
        const payload = response.data?.data ?? response.data;
        const accessToken = payload?.accessToken;
        if (accessToken) {
          localStorage.setItem("token", accessToken);
          return accessToken;
        }
        return null;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("token");
    if (token && !isPublicAuthRequest(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add Calendly token for Calendly endpoints
    if (config.url?.includes("/calendly/")) {
      const calendlyToken = localStorage.getItem("calendly_access_token");
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
  async function onRejected(error) {
    if (error.response?.status >= 500 && error.config?.method?.toUpperCase() !== "GET") {
      triggerSystemError();
    }

    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";
    const isAuthRequest = isPublicAuthRequest(requestUrl);

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const newToken = await refreshAccessToken();
    if (!newToken) {
      clearSession();
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
      return Promise.reject(error);
    }

    originalRequest.headers = {
      ...(originalRequest.headers || {}),
      Authorization: `Bearer ${newToken}`,
    };

    return axiosInstance(originalRequest);
  }
);