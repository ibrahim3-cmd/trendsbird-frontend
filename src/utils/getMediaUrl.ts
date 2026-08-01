import { isLive } from "@/constants/constant";

const LIVE_BACKEND_URL = "https://trendsbird-backend-1.onrender.com";
const LOCAL_BACKEND_URL = "http://localhost:5000";

export const getMediaUrl = (url?: string | null): string => {
  if (!url) return "";

  const targetBase = isLive
    ? import.meta.env.VITE_BACKEND_URL_PROD || LIVE_BACKEND_URL
    : import.meta.env.VITE_BACKEND_URL || LOCAL_BACKEND_URL;

  // If url is a relative path starting with /
  if (url.startsWith("/")) {
    return `${targetBase}${url}`;
  }

  // If isLive is true and URL contains localhost/127.0.0.1, convert host to live backend
  if (isLive && (url.includes("localhost") || url.startsWith("http://127.0.0.1"))) {
    return url.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, targetBase);
  }

  return url;
};
