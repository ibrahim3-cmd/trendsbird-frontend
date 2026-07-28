import z from "zod";

// Password validation regex patterns
const passwordUppercase = /^(?=.*[A-Z])/;
const passwordSpecialChar = /^(?=.*[!@#$%^&*])/;
const passwordNumber = /^(?=.*\d)/;

// Create Support Agent Schema
export const createSupportAgentZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters long")
    .max(100, "Email cannot exceed 100 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(passwordUppercase, "Password must contain at least 1 uppercase letter")
    .regex(passwordSpecialChar, "Password must contain at least 1 special character (!@#$%^&*)")
    .regex(passwordNumber, "Password must contain at least 1 number"),
  phone: z.string().optional(),
  address: z.string().max(200, "Address cannot exceed 200 characters").optional(),
  storageValue: z.string().optional(),
  storageUnit: z.enum(["MB", "GB"]).optional(),
});

// Update Support Agent Schema
export const updateSupportAgentZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .optional(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional(),
  password: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.length === 0) return true; // Allow empty for optional
        return val.length >= 8;
      },
      { message: "Password must be at least 8 characters long" }
    )
    .refine(
      (val) => {
        if (!val || val.length === 0) return true;
        return passwordUppercase.test(val);
      },
      { message: "Password must contain at least 1 uppercase letter" }
    )
    .refine(
      (val) => {
        if (!val || val.length === 0) return true;
        return passwordSpecialChar.test(val);
      },
      { message: "Password must contain at least 1 special character (!@#$%^&*)" }
    )
    .refine(
      (val) => {
        if (!val || val.length === 0) return true;
        return passwordNumber.test(val);
      },
      { message: "Password must contain at least 1 number" }
    ),
  phone: z.string().optional(),
  address: z.string().max(200, "Address cannot exceed 200 characters").optional(),
  storageValue: z.string().optional(),
  storageUnit: z.enum(["MB", "GB"]).optional(),
});

export type CreateSupportAgentFormData = z.infer<typeof createSupportAgentZodSchema>;
export type UpdateSupportAgentFormData = z.infer<typeof updateSupportAgentZodSchema>;