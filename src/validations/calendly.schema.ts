import { z } from "zod";

// Simple validation for Calendly Event Types UI (used by CalendlyEventTypes.tsx)
// Keep schemas permissive where helpful but validate common fields.

export const CalendlyLocationSchema = z.object({
  kind: z.string().optional(),
  location: z.string().optional(),
  additional_info: z.string().optional(),
  phone_number: z.string().optional(),
});

export const CalendlyEventTypeSchema = z.object({
  uri: z.string().optional(),
  name: z.string().min(1, "Event type name is required"),
  duration: z.number().int().min(1).max(720).optional(),
  description_plain: z.string().optional(),
  color: z.string().optional(),
  active: z.boolean().optional(),
  kind: z.string().optional(),
  scheduling_url: z.string().url().optional(),
  locations: z.array(CalendlyLocationSchema).optional(),
}).passthrough();

export const CreateCalendlyEventTypeSchema = CalendlyEventTypeSchema.pick({ name: true }).extend({
  duration: z.number().int().min(1).max(720).optional(),
  description_plain: z.string().optional(),
  color: z.string().optional(),
  active: z.boolean().optional(),
  locations: z.array(CalendlyLocationSchema).optional(),
}).passthrough();

export const UpdateCalendlyEventTypeSchema = CalendlyEventTypeSchema.partial().passthrough();

export const CalendlyEventTypeArraySchema = z.array(CalendlyEventTypeSchema);

// Export TS types for convenience
export type CalendlyLocation = z.infer<typeof CalendlyLocationSchema>;
export type CalendlyEventType = z.infer<typeof CalendlyEventTypeSchema>;
export type CreateCalendlyEventType = z.infer<typeof CreateCalendlyEventTypeSchema>;
export type UpdateCalendlyEventType = z.infer<typeof UpdateCalendlyEventTypeSchema>;

// Convenience helper: validate an array response shape (if your API returns { collection: [...] })
export const CalendlyCollectionResponse = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({ data: z.object({ collection: z.array(itemSchema) }).optional() }).passthrough();

export default {
  CalendlyLocationSchema,
  CalendlyEventTypeSchema,
  CreateCalendlyEventTypeSchema,
  UpdateCalendlyEventTypeSchema,
  CalendlyEventTypeArraySchema,
  CalendlyCollectionResponse,
};
