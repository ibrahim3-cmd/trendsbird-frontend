import { z } from "zod";

const serviceItemSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  quantity: z
    .number()
    .int()
    .min(1, { message: "Quantity must be at least 1" }),
});

export const createPackageSchema = z.object({
  org: z
    .string()
    .optional(),
  packageName: z
    .string()
    .min(1, { message: "Package name is required" })
    .max(200, { message: "Package name cannot exceed 200 characters." })
    .trim(),
  serviceItems: z
    .array(serviceItemSchema)
    .min(1, "At least one service item is required")
    .max(20, "Cannot have more than 20 service items"),
  description: z
    .string()
    .max(1000, { message: "Description cannot exceed 1000 characters." })
    .optional(),
});

export const updatePackageSchema = z.object({
  packageName: z
    .string()
    .min(1, { message: "Package name is required" })
    .max(200, { message: "Package name cannot exceed 200 characters." })
    .trim()
    .optional(),
  serviceItems: z
    .array(serviceItemSchema)
    .max(20, "Cannot have more than 20 service items")
    .optional(),
  description: z
    .string()
    .max(1000, { message: "Description cannot exceed 1000 characters." })
    .optional(),
});