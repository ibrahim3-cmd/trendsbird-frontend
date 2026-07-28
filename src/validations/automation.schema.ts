import { z } from "zod";

export const automationActions = [
  "SEND_EMAIL",
  "SEND_SMS",
  "SEND_INVOICE",
  "SEND_ESTIMATE",
  "GET_ESTIMATE",
  "SCHEDULE_APPOINTMENT",
  "CREATE_TASK",
  "ASSIGN_USER",
  "MOVE_STAGE",
  "TAG_LEAD",
  "UPDATE_LEAD_STATUS",
  "SEND_NOTIFICATION",
  "CREATE_LEAD",
  "CREATE_CLIENT",
  "CREATE_JOB",
  "CREATE_CONTACT",
  "SEND_CREDENTIALS",
  "UPDATE_LEAD_CUSTOM_DATA",
  "WEBHOOK_CALL",
  "CONDITIONAL_ACTION",
  "WAIT",
  "SEND_PROPOSAL",
  "ADD_TO_PIPELINE", 
  "UPDATE_STAGE_IN_PIPELINE", 
] as const;


export const triggerEvents = [
  "STAGE_ENTRY",
  "STAGE_EXIT",
  "FIELD_CHANGE",
  "TIME_BASED",
  "LEAD_ASSIGNED",
  "MANUAL_TRIGGER",
  "STAGE_TRANSITION",
  "STAGE_APPROVAL",
  "STAGE_REJECTION",
  "DOCUMENT_APPROVED",
  "DOCUMENT_REJECTED",
  "PROPOSAL_SENDED",
  "FORM_SUBMITTED",
  "CONVERSATION_STARTED",
  "STAGE_STUCK" 
] as const;


const objectIdRegex = /^[a-f\d]{24}$/i;

// ✅ Trigger Schema
export const triggerFrontendSchema = z.object({
  event: z.enum(triggerEvents, {
    message: "Event type is required",
  }),

  pipeline: z
    .string()
    .regex(objectIdRegex, { message: "Invalid pipeline ID" })
    .optional(),

  conditions: z
    .array(
      z.object({
        field: z.string().optional(),
        operator: z.enum(
          ["equals", "not_equals", "contains", "greater_than", "less_than"],
          { message: "Invalid condition operator" }
        ),
        value: z.any(),
      })
    )
    .optional(),

  stage: z.string().regex(objectIdRegex, { message: "Invalid stage ID" }).optional(),
  fromStage: z.string().regex(objectIdRegex, { message: "Invalid fromStage ID" }).optional(),
  toStage: z.string().regex(objectIdRegex, { message: "Invalid toStage ID" }).optional(),
  timeDelay: z.number().min(0, { message: "Time delay cannot be negative" }).optional(),
  fieldName: z.string().optional(),
  formId: z.string().regex(objectIdRegex, { message: "Invalid form ID" }).optional(),
  
  // For STAGE_STUCK trigger
  durationMinutes: z.number().min(1, { message: "Duration must be at least 1 minute" }).optional(),
  durationHours: z.number().min(1, { message: "Duration must be at least 1 hour" }).optional(),
  checkAllStages: z.boolean().optional(),
  specificStages: z.array(z.string().regex(objectIdRegex, { message: "Invalid stage ID" })).optional(),
});

// ✅ Main Automation Schema (Frontend)
export const createAutomationSchema = z.object({
  pipeline: z
    .string()
    .regex(objectIdRegex, { message: "Invalid pipeline ID" })
    .optional(),

  name: z
    .string()
    .min(1, { message: "Automation name is required" })
    .max(200, { message: "Automation name cannot exceed 200 characters" }),

  description: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .optional(),

  triggers: z
    .array(triggerFrontendSchema)
    .min(1, { message: "At least one trigger is required" }),

  actions: z
    .array(
      z.object({
        type: z.enum(automationActions, { message: "Invalid action type" }),
        config: z.record(z.string(), z.any()),
        delay: z.number().min(0, { message: "Delay cannot be negative" }).default(0),
        priority: z
          .number()
          .min(1, { message: "Priority must be at least 1" })
          .max(10, { message: "Priority cannot exceed 10" })
          .default(5),
      })
    )
    .min(1, { message: "At least one action is required" }),

  isActive: z.boolean().default(true),
  isGlobal: z.boolean().default(false),
});
