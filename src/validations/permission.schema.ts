import { z } from "zod";

export const createPermissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Permission name must be at least 3 characters")
    .max(100)
    .regex(/^[a-z0-9:_-]+$/, "Use lowercase letters, numbers, colons, underscores, or hyphens"),
  description: z.string().trim().max(255).optional(),
});

export const updatePermissionSchema = createPermissionSchema.partial();

export type CreatePermissionFormValues = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionFormValues = z.infer<typeof updatePermissionSchema>;
