import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createTypeZodSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  logo: z.string().optional(),
  categoryId: z.string().regex(objectIdRegex, { message: "categoryId must be a valid Mongo ObjectId" }).optional().nullable(),
  description: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  trackingMode: z.enum(["ASSET", "CONSUMABLE"]).default("ASSET"),
});

export const updateTypeZodSchema = createTypeZodSchema.partial().extend({
  name: z.string().min(1, { message: "Name is required" }).optional(),
});

export type CreateTypeInput = z.infer<typeof createTypeZodSchema>;
export type UpdateTypeInput = z.infer<typeof updateTypeZodSchema>;

export default createTypeZodSchema;
