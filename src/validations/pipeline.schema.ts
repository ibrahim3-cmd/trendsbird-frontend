import { z } from "zod";

export const createPipelineSchema = z.object({
  name: z
    .string()
    .min(1, "Pipeline name is required")
    .max(200, "Pipeline name cannot exceed 200 characters"),

  key: z
    .string()
    .min(1, "Pipeline key is required")
    .max(100, "Pipeline key cannot exceed 100 characters")
    .regex(
      /^[a-z0-9_-]+$/,
      "Key must contain only lowercase letters, numbers, hyphens, and underscores"
    )
    .optional(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  type: z.string(), // keep it string-based for frontend (you can map to enum on backend)

  stages: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, "Stage name is required")
          .max(100, "Stage name cannot exceed 100 characters"),

        key: z
          .string()
          .min(1, "Stage key is required")
          .max(50, "Stage key cannot exceed 50 characters")
          .regex(
            /^[a-z0-9_-]+$/,
            "Key must contain only lowercase letters, numbers, hyphens, and underscores"
          ),

        description: z
          .string()
          .max(500, "Stage description cannot exceed 500 characters")
          .optional(),

        type: z.string(), // same reasoning — keep as string for frontend

        position: z.number().min(0, "Position must be a non-negative number").optional(),

        color: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code (e.g., #FFFFFF)")
          .optional(),
      })
    )
    .optional(),

  org: z.string().optional(),
});


export const updatePipelineSchema = z.object({
  name: z
    .string()
    .min(1, "Pipeline name must be at least 1 character long")
    .max(200, "Pipeline name cannot exceed 200 characters")
    .optional(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  status: z
    .string()
    .optional(), // frontend just uses string, map to enum backend side

  stages: z
    .array(
      z.object({
        _id: z
          .string()
          .regex(/^[a-f\d]{24}$/i, "Invalid stage ID format") // simple ObjectId regex
          .optional(), // optional for new stages

        name: z
          .string()
          .min(1, "Stage name must be at least 1 character long")
          .max(100, "Stage name cannot exceed 100 characters")
          .optional(),

        key: z
          .string()
          .min(1, "Stage key must be at least 1 character long")
          .max(50, "Stage key cannot exceed 50 characters")
          .regex(
            /^[a-z0-9_-]+$/,
            "Key must contain only lowercase letters, numbers, hyphens, and underscores"
          )
          .optional(),

        description: z
          .string()
          .max(500, "Description cannot exceed 500 characters")
          .optional(),

        type: z
          .string() // simplified for frontend — enum handled backend side
          .optional(),

        position: z
          .number()
          .min(0, "Position must be a non-negative number")
          .optional(),

        color: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code (e.g., #FFFFFF)")
          .optional(),
      })
    )
    .optional(),

  org: z.string().optional(),
});