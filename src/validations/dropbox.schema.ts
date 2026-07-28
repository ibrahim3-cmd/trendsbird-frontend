import { z } from "zod";

// File item schema
export const fileItemSchema = z.object({
  _id: z.string().min(1, "File ID is required"),
  fileName: z.string().min(1, "File name is required"),
  fileUrl: z.string().url("Invalid file URL"),
  docType: z.string().min(1, "Document type is required"),
  fileSize: z.number().positive("File size must be positive"),
});

// Create dropbox entry schema
export const createDropboxSchema = z.object({
  docName: z.string().min(1, "Document name is required").max(100, "Document name too long"),
  files: z.array(fileItemSchema).min(1, "At least one file is required"),
});

// Update dropbox entry schema
export const updateDropboxSchema = z.object({
  docName: z.string().min(1, "Document name is required").max(100, "Document name too long").optional(),
  files: z.array(fileItemSchema).optional(),
}).refine((data) => data.docName || data.files, {
  message: "At least one field (docName or files) must be provided",
});

// Share dropbox schema
export const shareDropboxSchema = z.object({
  sharedWith: z.array(
    z.object({
      type: z.enum(["user", "all"]),
      targetId: z.string().optional(),
    })
  ).min(1, "At least one share target is required"),
});

export type CreateDropboxInput = z.infer<typeof createDropboxSchema>;
export type UpdateDropboxInput = z.infer<typeof updateDropboxSchema>;
export type ShareDropboxInput = z.infer<typeof shareDropboxSchema>;
