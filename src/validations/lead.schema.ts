import { z } from "zod";

export const createLeadSchema = z.object({
  org: z.string().optional(),
  leadId: z.string().min(1, "Work Order is required. Please generate a work order"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .trim(),
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone must be 10 digits")
    .min(10, "Phone is required"),
  address: z
    .string()
    .min(3, "Address is required")
    .max(200, "Address cannot exceed 200 characters"),
  city: z
    .string()
    .max(100, "City cannot exceed 100 characters")
    .optional(),
  state: z
    .string()
    .max(100, "State cannot exceed 100 characters")
    .optional(),
  zipcode: z
    .string()
    // .max(20, "Zipcode cannot exceed 20 characters")
    .optional(),
  company: z.string().optional(),
  serviceType: z.string().optional(),
  source: z.string().optional(),
  owner: z.string().optional(),
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
  estimationCost: z
    .object({
      total: z
        .number()
        .min(0, "Total cost cannot be negative")
        .optional(),

      services: z.array(z.string()).optional(),
      packages: z.array(z.string()).optional(),
    })
    .optional(),
  stage: z
    .string()
    .min(1, "Stage is required"),
  pipeline: z.string().optional(),
  currentStage: z.string().optional(),
  tags: z.array(z.string()).optional(),
});


export const updateLeadSchema = z.object({
  leadId: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),

  email: z.string().email("Invalid email address").optional(),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone must be 10 digits")
    .optional(),

  address: z
    .string()
    .min(3, "Address is required")
    .max(200, "Address cannot exceed 200 characters")
    .optional(),

  city: z
    .string()
    .max(100, "City cannot exceed 100 characters")
    .optional(),

  state: z
    .string()
    .max(100, "State cannot exceed 100 characters")
    .optional(),

  zipcode: z.preprocess((val) => (typeof val === 'number' ? String(val) : val),
    z.string()
      .regex(/^[0-9]{5}(?:-[0-9]{4})?$/, "Invalid zipcode format")
      .optional(),
  ),

  company: z.string().optional(),

  serviceType: z.string().optional(),

  source: z.string().optional(),

  owner: z
    .string()
    .optional(),

  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),

  estimationCost: z
    .object({
      total: z.number().min(0, "Total cost cannot be negative").optional(),

      services: z.array(z.string()).optional(),
      packages: z.array(z.string()).optional(),
    })
    .optional(),

  stage: z
    .string()
    .min(1, "Stage is required"),

  pipeline: z.string().optional(),

  currentStage: z.string().optional(),

  tags: z.array(z.string()).optional(),

  isDeleted: z.boolean().optional(),
});

