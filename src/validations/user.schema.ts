import z from "zod";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .trim(),

  email: z
    .string()
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." })
    .email({ message: "Invalid email address format." })
    .trim(),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least one special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least one number.",
    })
    .optional(), // frontend: optional in edit mode, required only on create

  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]*$/, {
      message: "Please enter a valid phone number.",
    })
    .optional()
    .or(z.literal("")), // allow empty

  role: z.string().min(1, { message: "Role is required." }),

  org: z.string().optional(), // frontend: we usually inject org automatically, not user-provided
  address: z
    .string()
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
  
  storageValue: z
    .string()
    .min(1, { message: "Storage usage is required." })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Storage usage must be greater than 0.",
    }),
  
  storageUnit: z.enum(["MB", "GB"], {
    message: "Storage unit must be MB or GB.",
  }),
});

// Schema for editing user (password not required)
export const updateUserZodSchema = createUserZodSchema
  .omit({ password: true, storageValue: true, storageUnit: true })
  .extend({
    password: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          (val.length >= 8 &&
            /[A-Z]/.test(val) &&
            /[!@#$%^&*]/.test(val) &&
            /\d/.test(val)),
        {
          message:
            "Password must be at least 8 characters with uppercase, number, and special character.",
        }
      ),
    storageValue: z.string().optional(),
    storageUnit: z.enum(["MB", "GB"]).optional(),
  });


// Each Action (feature permission)
export const zUserFeatureAction = z.object({
  description: z.string().min(1, { message: "Please enter a description" }).optional(),
  value: z.string().min(1, { message: "Please enter a value" }).optional(),
  isActive: z.boolean().default(true),
});

// Sub-feature (group of actions)
export const zSubFeature = z.object({
  name: z.string().min(1, { message: "Please enter sub-feature name" }).optional(),
  key: z.string().min(1, { message: "Please enter sub-feature key" }).optional(),
  actions: z.array(zUserFeatureAction).default([]),
});

// Main feature (group of sub-features)
export const zFeature = z.object({
  name: z.string().min(1, { message: "Please enter feature name" }).optional(),
  key: z.string().min(1, { message: "Please enter feature key" }).optional(),
  actions: z.array(zUserFeatureAction).default([]),
  subFeatures: z.array(zSubFeature).default([]),
});

// Root schema for your feature access form
export const setFeatureAccessZod = z.object({
  featureAccess: z.array(zFeature).default([]),
});



export type CreateUserSchema = z.infer<typeof createUserZodSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserZodSchema>;
export type SetFeatureAccessForm = z.infer<typeof setFeatureAccessZod>;