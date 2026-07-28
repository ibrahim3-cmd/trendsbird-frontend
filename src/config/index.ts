import { production, staging } from "@/constants";

const config = {
  baseUrl: production
    ? import.meta.env.VITE_BASE_URL_PROD
    : staging
      ? import.meta.env.VITE_BASE_URL_STAGING
      : import.meta.env.VITE_BASE_URL,
};

export const baseURL = production
  ? "https://server.tainc.org"
  : staging
    ? "https://crmbackend.octopi-digital.com"
    : "http://localhost:5000";

export default config;