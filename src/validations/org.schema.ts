import { z } from "zod";

export const updateOrgSchema = z.object({
  orgName: z
    .string()
    .min(2, "Organization name must be at least 2 characters long.")
    .max(120, "Organization name cannot exceed 120 characters.")
    .optional(),

  orgEmail: z
    .string()
    .email("Invalid email address format.")
    .optional(),

  plan: z
    .string()
    .optional(),

  orgPhone: z
    .string()
    .optional(),

  orgAddress: z
    .object({
      address: z.string().optional(),
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
    })
    .optional(),
});


export const updateOrgSettingsSchema = z.object({

  branding: z.object({
    logoUrl: z
      .string()
      .url("Please provide a valid logo.")
      .optional()
      .or(z.literal("")), // allow empty string
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    primaryTextColor: z.string().optional(),
    secondaryTextColor: z.string().optional(),
  }),

  businessHours: z
    .array(
      z.object({
        dow: z
          .number()
          .min(0, { message: "Invalid day of week (minimum 0)" })
          .max(6, { message: "Invalid day of week (maximum 6)" }),
        opens: z
          .string()
          .min(1, { message: "Opening time is required (format: HH:mm)" }),
        closes: z
          .string()
          .min(1, { message: "Closing time is required (format: HH:mm)" }),
      })
    )
    .optional()
    .default([]),

  holidays: z
    .array(
      z.object({
        date: z.string().min(1, { message: "Date is required." }),
        name: z.string().min(1, { message: "Holiday name is required." }),
      })
    )
    .optional()
    .default([]),

  timezone: z.string().min(1, { message: "Timezone is required." }).default("UTC"),
});
