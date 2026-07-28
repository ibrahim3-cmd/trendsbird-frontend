import { TRole } from "@/types";


export const role = {
  superAdmin: "SUPER_ADMIN",
  admin: "ADMIN",
  user: "USER",
} as unknown as { [key: string]: TRole };
