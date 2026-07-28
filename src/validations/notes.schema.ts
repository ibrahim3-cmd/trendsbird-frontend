import { z } from "zod";

export const createNoteSchema = z.object({
  message: z
    .string()
    .min(1, { message: "Message is required" })
    .max(5000, { message: "Message cannot exceed 5000 characters" }),
  tags: z.array(z.string()).optional(),
});

export const updateNoteSchema = z.object({
  message: z
    .string()
    .min(1, { message: "Message is required" })
    .max(5000, { message: "Message cannot exceed 5000 characters" })
    .optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateNoteFormData = z.infer<typeof createNoteSchema>;
export type UpdateNoteFormData = z.infer<typeof updateNoteSchema>;