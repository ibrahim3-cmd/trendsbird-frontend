import { z } from "zod";

const attachmentSchema = z.object({
  filename: z.string(),
  url: z.string().url(),
  size: z.number().optional(),
  mimeType: z.string().optional(),
});

export const SendNowEmailCampaignSchema = z.object({
  subject: z.string().min(1, "Subject line is required"),
  contactIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  attachments: z.array(attachmentSchema).optional(),
}).refine(
  (data) => (data.contactIds && data.contactIds.length > 0) || (data.tags && data.tags.length > 0),
  { message: "Either contactIds or tags must be provided" }
).refine(
  (data) => !(data.contactIds && data.contactIds.length > 0 && data.tags && data.tags.length > 0),
  { message: "Cannot provide both contactIds and tags" }
);

export const ScheduleEmailCampaignSchema = z.object({
  subject: z.string().min(1, "Subject line is required"),
  contactIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  scheduleDate: z.coerce.date({ message: "Schedule date is required" }),
  timezone: z.string().optional(),
  attachments: z.array(attachmentSchema).optional(),
}).refine(
  (data) => (data.contactIds && data.contactIds.length > 0) || (data.tags && data.tags.length > 0),
  { message: "Either contactIds or tags must be provided" }
).refine(
  (data) => !(data.contactIds && data.contactIds.length > 0 && data.tags && data.tags.length > 0),
  { message: "Cannot provide both contactIds and tags" }
);

export const BatchEmailCampaignSchema = z.object({
  subject: z.string().min(1, "Subject line is required"),
  contactIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  scheduleDate: z.coerce.date({ message: "Schedule date is required" }),
  timezone: z.string().optional(),
  batchSize: z.number({ message: "Batch size is required" }).min(1),
  batchInterval: z.number({ message: "Batch interval is required" }).min(1),
  batchIntervalUnit: z.enum(["minute", "hour", "day", "month"], { message: "Batch interval unit is required" }),
  attachments: z.array(attachmentSchema).optional(),
}).refine(
  (data) => (data.contactIds && data.contactIds.length > 0) || (data.tags && data.tags.length > 0),
  { message: "Either contactIds or tags must be provided" }
).refine(
  (data) => !(data.contactIds && data.contactIds.length > 0 && data.tags && data.tags.length > 0),
  { message: "Cannot provide both contactIds and tags" }
);

export type SendNowEmailCampaignInput = z.infer<typeof SendNowEmailCampaignSchema>;
export type ScheduleEmailCampaignInput = z.infer<typeof ScheduleEmailCampaignSchema>;
export type BatchEmailCampaignInput = z.infer<typeof BatchEmailCampaignSchema>;
