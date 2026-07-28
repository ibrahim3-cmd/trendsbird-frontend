// validations/payment.schema.ts
import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createPaymentSchema = z.object({
  org: z.string().regex(objectIdRegex, { message: "Organization must be a valid ObjectId" }),
  plan: z.string().regex(objectIdRegex, { message: "Plan must be a valid ObjectId" }),
  transactionId: z.string().min(1, { message: "Transaction ID is required" }),
  invoiceId: z.string().min(1, { message: "Invoice ID is required" }),
  amount: z.number().positive({ message: "Amount must be positive" }),
  status: z.enum(["PENDING", "SUCCESS", "FAILED", "REFUNDED"]).optional(),
});

export const updatePaymentSchema = z.object({
  transactionId: z.string().min(1, { message: "Transaction ID is required" }).optional(),
  amount: z.number().positive({ message: "Amount must be positive" }).optional(),
  status: z.enum(["PENDING", "SUCCESS", "FAILED", "REFUNDED"]).optional(),
});

export const paymentQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    status: z.enum(["PENDING", "SUCCESS", "FAILED", "REFUNDED", "ALL"]).optional(),
    orgId: z.string().regex(objectIdRegex).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;