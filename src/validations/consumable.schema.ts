import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createConsumableSchema = z.object({
  type: z.string().regex(objectIdRegex, { message: "Type must be a valid ObjectId" }),
  quantity: z.number().min(0, { message: "Quantity must be >= 0" }),
  price: z.number().min(0).optional(),
  orgId: z.string().regex(objectIdRegex).optional(),
});

export const updateConsumableSchema = z.object({
  type: z.string().regex(objectIdRegex).optional(),
  quantity: z.number().min(0).optional(),
  price: z.number().min(0).optional(),
  params: z
    .object({ id: z.string().min(1, "Consumable ID is required").regex(objectIdRegex) })
    .optional(),
});

export const consumableQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const useConsumableSchema = z.object({
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  userId: z.string().min(1, { message: "User ID is required" }),
});

export const addConsumableStockSchema = z.object({
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  price: z.number().min(0).optional(),
  actionBy: z.string().min(1, { message: "ActionBy is required" }),
});

export type CreateConsumableInput = z.infer<typeof createConsumableSchema>;
export type UpdateConsumableInput = z.infer<typeof updateConsumableSchema>;
export type UseConsumableInput = z.infer<typeof useConsumableSchema>;
export type AddConsumableStockInput = z.infer<typeof addConsumableStockSchema>;

export default createConsumableSchema;
