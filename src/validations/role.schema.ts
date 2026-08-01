import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().trim().min(2, "Role name is required").max(100),
  description: z.string().trim().max(255).optional(),
  isActive: z.boolean().optional().default(true),
  permissionIds: z.array(z.number()).default([]),
});

export const updateRoleSchema = createRoleSchema.partial();

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;
export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;
