import { z } from "zod";

const requisitionItemSchema = z.object({
  _id: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  vendor: z.string().min(1, "Vendor is required"),
  quantityRequested: z.number().min(1, "Quantity must be at least 1"),
  estimatedCost: z.number().min(0),
  description: z.string().optional(),
  approvedVendor: z.string().optional(),
  quantityApproved: z.number().optional(),
  approvedCost: z.number().optional(),
});

export const requisitionCreateSchema = z.object({
  requisitionTitle: z.string().min(1, "Requisition title is required"),
  description: z.string().optional(),
  items: z.array(requisitionItemSchema).min(1, "At least one item is required"),
});

export type RequisitionCreate = z.infer<typeof requisitionCreateSchema>;

export default requisitionCreateSchema;
