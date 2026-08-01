import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  roleId: z.coerce.number().int().positive("Select a role"),
  phone: z.string().trim().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().trim().email("Enter a valid email").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  roleId: z.coerce.number().int().positive("Select a role").optional(),
  phone: z.string().trim().optional(),
  isActive: z.boolean().optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
