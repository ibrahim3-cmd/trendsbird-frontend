import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  description: z.string().min(1, "Description is required").max(1000, "Description cannot exceed 1000 characters"),
  status: z.string().min(1, "Status is required"),
  lead: z.string().min(1, "Lead is required"),
  workOrder: z.string().min(1, "Work Order is required"),
  // services: z.array(z.string()).min(1, "At least one service is required"),
  services: z.array(z.string()).optional(),
  packages: z.array(z.string()).optional(),
  scheduledAt: z.string().optional(),
  org: z.string().optional(),
});

export const updateJobSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters").optional(),
  description: z.string().min(1, "Description is required").max(1000, "Description cannot exceed 1000 characters").optional(),
  status: z.string().min(1, "Status is required").optional(),
  jobId: z.string().min(1, "Job ID is required").optional(),
  services: z.array(z.string()).optional(),
  packages: z.array(z.string()).optional(),
  scheduledAt: z.string().optional(),
  progressPercentage: z.number().min(0, "Progress must be at least 0").max(100, "Progress cannot exceed 100").optional(),
});

export type CreateJobFormData = z.infer<typeof createJobSchema>;
export type UpdateJobFormData = z.infer<typeof updateJobSchema>;

// Extended interface for JobForm component
export interface JobFormDataInterface {
  title: string
  description: string
  status: string
  scheduledAt: string
  organizationName: string
  organizationEmail: string
  leadName: string
  leadEmail: string
  services: string[]
  packages: string[]
  progressPercentage?: number
  jobId?: string // Made optional since it's not required for creation
}