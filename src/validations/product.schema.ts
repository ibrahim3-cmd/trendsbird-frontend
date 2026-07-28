import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createProductSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional().or(z.literal("")),
  type: z.string().regex(objectIdRegex, { message: "Type must be a valid ObjectId" }),
  price: z.number().min(0, { message: "Price must be at least 0" }).optional().default(0),
  documents: z.array(z.string().url()).optional(),
  status: z.enum(["AVAILABLE", "ASSIGNED", "MAINTENANCE", "RETIRED"]).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  description: z.string().optional().or(z.literal("")),
  type: z.string().regex(objectIdRegex, { message: "Type must be a valid ObjectId" }).optional(),
  price: z.number().min(0, { message: "Price must be at least 0" }).optional(),
  documents: z.array(z.string().url()).optional(),
  status: z.enum(["AVAILABLE", "ASSIGNED", "MAINTENANCE", "RETIRED"]).optional(),
  params: z
    .object({
      id: z.string().min(1, "Product ID is required").regex(objectIdRegex, { message: "Product ID must be a valid ObjectId" }),
    })
    .optional(),
});

export const productQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sort: z.string().optional(),
    fields: z.string().optional(),
    search: z.string().optional(),
    status: z.enum(["AVAILABLE", "ASSIGNED", "MAINTENANCE", "RETIRED"]).optional(),
    type: z.string().regex(objectIdRegex).optional(),
    orgId: z.string().regex(objectIdRegex).optional(),
  }),
});

export const productByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Product ID is required").regex(objectIdRegex, { message: "Product ID must be a valid ObjectId" }),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export default createProductSchema;
