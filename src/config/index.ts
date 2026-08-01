import { isLive } from "@/constants/constant";

const config = {
  baseUrl: isLive
    ? import.meta.env.VITE_BASE_URL_PROD || import.meta.env.VITE_BASE_URL
    : import.meta.env.VITE_BASE_URL,
};

export const baseURL = isLive
  ? import.meta.env.VITE_BASE_URL_PROD || import.meta.env.VITE_BASE_URL
  : import.meta.env.VITE_BASE_URL;

export const isLiveEnv = isLive;

export default config;