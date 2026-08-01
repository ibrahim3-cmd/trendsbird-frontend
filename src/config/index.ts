import { isLive } from "@/constants/constant";

const liveApiBaseUrl = "https://trendsbird-backend-1.onrender.com/api/v1";

const config = {
  baseUrl: isLive
    ? import.meta.env.VITE_BASE_URL_PROD || liveApiBaseUrl
    : import.meta.env.VITE_BASE_URL || "http://localhost:5000/api/v1",
};

export const baseURL = isLive
  ? import.meta.env.VITE_BASE_URL_PROD || liveApiBaseUrl
  : import.meta.env.VITE_BASE_URL || "http://localhost:5000/api/v1";

export const isLiveEnv = isLive;

export default config;