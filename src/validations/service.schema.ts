import { z } from "zod";

const durationSchema = z
  .number({ message: "Duration is required" })
  .min(1, "Duration must be at least 1 hour")
  .max(1000, "Duration cannot exceed 1000 hours");

// Task schema for service tasks
const serviceTaskSchema = z.object({
  _id: z.string().optional(),
  name: z
    .string()
    .min(1, "Task name is required")
    .max(200, "Task name cannot exceed 200 characters"),
  description: z
    .string()
    .max(500, "Task description cannot exceed 500 characters")
    .optional(),
});

export const createServiceSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),
  category: z
    .string()
    .min(2, "Category must be at least 2 characters long")
    .max(50, "Category cannot exceed 50 characters")
    .trim(),
  cost: z
    .number()
    .min(0, "Cost cannot be negative")
    .max(999999.99, "Cost cannot exceed 999,999.99")
    .optional(),
  duration: durationSchema,
  tags: z
    .array(z.string())
    .max(10, "Cannot have more than 10 tags")
    .optional(),
  tasks: z
    .array(serviceTaskSchema)
    .max(50, "Cannot have more than 50 tasks")
    .optional(),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  org: z
    .string()
    .optional(),
});

export const updateServiceSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters")
    .trim()
    .optional(),
  category: z
    .string()
    .min(2, "Category must be at least 2 characters long")
    .max(50, "Category cannot exceed 50 characters")
    .trim()
    .optional(),
  cost: z
    .number()
    .min(0, "Cost cannot be negative")
    .max(999999.99, "Cost cannot exceed 999,999.99")
    .optional(),
  duration: durationSchema,
  tags: z
    .array(z.string())
    .max(10, "Cannot have more than 10 tags")
    .optional(),
  tasks: z
    .array(serviceTaskSchema)
    .max(50, "Cannot have more than 50 tasks")
    .optional(),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});