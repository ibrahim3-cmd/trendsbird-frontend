// password.schema.ts
import { z } from "zod";

// ObjectId validation regex (simplified for frontend)
const objectIdRegex = /^[a-f\d]{24}$/i;

// Credential schema
export const credentialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
  description: z.string().optional(),
  sharedWith: z.array(
    z.object({
      type: z.enum(["all", "user"]),
      targetId: z.string().regex(objectIdRegex, "Invalid target ID").optional(),
      sharedAt: z.string().datetime().optional(),
    })
  ).default([]),
});

// Create project schema
export const createProjectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  credentials: z.array(credentialSchema).default([]),
  sharedWith: z.array(
    z.object({
      type: z.enum(["all", "user"]),
      targetId: z.string().regex(objectIdRegex, "Invalid target ID").optional(),
      sharedAt: z.string().datetime().optional(),
    })
  ).default([]),
});

// Update credential schema
export const updateCredentialSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  email: z.string().email("Valid email is required").optional(),
  password: z.string().optional(),
  description: z.string().optional(),
});

// Update sharing schema
export const updateSharingSchema = z.object({
  sharedWith: z.array(
    z.object({
      type: z.enum(["all", "user"]),
      targetId: z.string().regex(objectIdRegex, "Invalid target ID").optional(),
      sharedAt: z.string().datetime().optional(),
      sharedBy: z.string().regex(objectIdRegex, "Invalid sharer ID").optional(),
      targetName: z.string().optional(),
      targetEmail: z.string().email().optional(),
    })
  ),
});

// Project query schema
export const projectQuerySchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.enum(['projectName', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  orgId: z.string().regex(objectIdRegex, "Invalid organization ID").optional(),
});

// Update project schema
export const updateProjectSchema = z.object({
  projectName: z.string().min(1, "Project name is required").optional(),
});

// Form schemas for UI validation (simplified versions)
export const credentialFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const projectFormSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  title: z.string().optional(),
  description: z.string().optional(),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  password: z.string().optional(),
});

// Share modal schema
export const shareModalSchema = z.object({
  sharedWith: z.array(
    z.object({
      type: z.enum(["all", "user"]),
      targetId: z.string().regex(objectIdRegex, "Invalid target ID").optional(),
      targetName: z.string().optional(),
      targetEmail: z.string().email().optional(),
    })
  ),
});

export const createCredentialFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

// For editing credentials (password optional)
export const editCredentialFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Valid email is required"),
  password: z.string().optional(), // Optional for edits
});

export type CreateCredentialFormInput = z.infer<typeof createCredentialFormSchema>;
export type EditCredentialFormInput = z.infer<typeof editCredentialFormSchema>;

// Type inferences
export type CredentialInput = z.infer<typeof credentialSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateCredentialInput = z.infer<typeof updateCredentialSchema>;
export type UpdateSharingInput = z.infer<typeof updateSharingSchema>;
export type ProjectQuery = z.infer<typeof projectQuerySchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CredentialFormInput = z.infer<typeof credentialFormSchema>;
export type ProjectFormInput = z.infer<typeof projectFormSchema>;
export type ShareModalInput = z.infer<typeof shareModalSchema>;