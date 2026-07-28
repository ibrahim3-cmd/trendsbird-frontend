import { z } from "zod";


export const createCategorySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional().or(z.literal("")),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  description: z.string().optional().or(z.literal("")),
  status: z.enum(["Active", "Inactive"]).optional(),
  params: z
    .object({
      id: z.string().min(1, "Category ID is required"),
    })
    .optional(),
});

export const categoryQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sort: z.string().optional(),
    fields: z.string().optional(),
    search: z.string().optional(),
    status: z.enum(["Active", "Inactive"]).optional(),
  }),
});

export const categoryByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Category ID is required"),
  }),
});

// Types inferred from schemas
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export default createCategorySchema;
