import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Please enter a role name." })
    .max(50, { message: "Role name cannot exceed 50 characters." }),

  key: z
    .string()
    .trim()
    .min(1, { message: "Please enter a role key." })
    .regex(/^[A-Z_]+$/, {
      message:
        "Role key must contain only uppercase letters and underscores (e.g. ADMIN_USER).",
    })
    .max(50, { message: "Role key cannot exceed 50 characters." }),

  description: z
    .string()
    .max(200, { message: "Description cannot exceed 200 characters." })
    .optional()
    .or(z.literal("")), // allow empty string for cleared input
});
