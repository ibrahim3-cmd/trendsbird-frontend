import { z } from "zod";

// ✅ Create Template Category
export const createTemplateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters long")
    .max(100, "Category name cannot exceed 100 characters")
    .trim(),

  description: z
    .string()
    .max(300, "Description cannot exceed 300 characters")
    .optional()
    .or(z.literal("")),
});

// ✅ Update Template Category
export const updateTemplateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters long")
    .max(100, "Category name cannot exceed 100 characters")
    .optional(),

  description: z
    .string()
    .max(300, "Description cannot exceed 300 characters")
    .optional()
    .or(z.literal("")),
});

export const createEmailTemplateSchema = z.object({
  // org is resolved on the backend via auth; not required on the client payload
  org: z.string().optional(),

  title: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .max(150, "Title cannot exceed 150 characters")
    .trim(),

  subject: z
    .string()
    .min(2, "Subject must be at least 2 characters long")
    .max(200, "Subject cannot exceed 200 characters")
    .trim(),

  body: z
    .string()
    .min(5, "Body must be at least 5 characters long"),

  placeholders: z.array(z.string()).default([]),

  des: z
    .string()
    .max(300, "Description cannot exceed 300 characters")
    .optional()
    .or(z.literal("")),

  category: z.string().optional().nullable(),
});


export const updateEmailTemplateSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .max(150, "Title cannot exceed 150 characters")
    .optional(),

  subject: z
    .string()
    .min(2, "Subject must be at least 2 characters long")
    .max(200, "Subject cannot exceed 200 characters")
    .optional(),

  body: z
    .string()
    .min(5, "Body must be at least 5 characters long")
    .optional(),

  placeholders: z.array(z.string()).optional(),

  des: z
    .string()
    .max(300, "Description cannot exceed 300 characters")
    .optional()
    .or(z.literal("")),

  category: z.string().optional().nullable(),
});
