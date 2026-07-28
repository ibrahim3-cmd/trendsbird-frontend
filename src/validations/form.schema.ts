import { z } from "zod";
import { FormFieldType } from "@/types/form.type";

// Field Option Schema
const fieldOptionSchema = z.object({
    label: z.string().trim().min(1, "Option label is required"),
    value: z.string().trim().min(1, "Option value is required"),
});

// Field Validation Schema
const fieldValidationSchema = z.object({
    required: z.boolean().optional(),
    minLength: z.number().min(0).optional(),
    maxLength: z.number().min(1).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().trim().optional(),
    customMessage: z.string().trim().optional(),
});

// Conditional Logic Schema
const conditionalLogicSchema = z.object({
    field: z.string().trim().min(1, "Field reference is required"),
    operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than']),
    value: z.any(),
});

// Form Field Schema
const formFieldSchema = z.object({
    _id: z.string().optional(),
    label: z.string().trim().min(1, "Field label is required").max(200, "Label too long"),
    fieldType: z.nativeEnum(FormFieldType),
    placeholder: z.string().trim().max(200, "Placeholder too long").optional(),
    helpText: z.string().trim().max(500, "Help text too long").optional(),
    defaultValue: z.any().optional(),
    options: z.array(fieldOptionSchema).optional(),
    validation: fieldValidationSchema.optional(),
    isRequired: z.boolean(),
    position: z.number().min(0),
    isVisible: z.boolean().optional(),
    conditionalLogic: z.array(conditionalLogicSchema).optional(),
}).refine(() => {
    // Note: All field types (CHECKBOX, RADIO, SELECT, MULTI_SELECT)
    // validation is now handled in the frontend
    // This validation is no longer needed in the schema
    return true;
}, {
    message: "Options are required for this field type",
    path: ["options"],
});

// Form Settings Schema
const formSettingsSchema = z.object({
    allowMultipleSubmissions: z.boolean().optional(),
    requireAuthentication: z.boolean().optional(),
    submitButtonText: z.string().trim().max(50, "Button text too long").optional(),
    successMessage: z.string().trim().max(500, "Success message too long").optional(),
    redirectUrl: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
    notifyOnSubmission: z.boolean().optional(),
    notificationEmails: z.array(z.string().trim().email("Invalid email")).optional(),
});

// Create Form Schema
export const createFormSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title too long"),
    description: z
        .string()
        .trim()
        .max(1000, "Description too long")
        .optional(),
    category: z.string().trim().optional(),
    fields: z
        .array(formFieldSchema)
        .min(1, "At least one field is required"),
    settings: formSettingsSchema.optional(),
    isActive: z.boolean(),
    isPublic: z.boolean(),
    tags: z.array(z.string().trim().max(50, "Tag too long")).optional(),
    org: z.string().optional(),
});

// Update Form Schema
export const updateFormSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title too long")
        .optional(),
    description: z
        .string()
        .trim()
        .max(1000, "Description too long")
        .optional(),
    category: z.string().trim().optional(),
    fields: z
        .array(formFieldSchema)
        .min(1, "At least one field is required")
        .optional(),
    settings: formSettingsSchema.optional(),
    isActive: z.boolean().optional(),
    isPublic: z.boolean().optional(),
    tags: z.array(z.string().trim().max(50, "Tag too long")).optional(),
});

// Form Submission Schema
export const formSubmissionSchema = z.object({
    formId: z.string().min(1, "Form ID is required"),
    responses: z
        .array(
            z.object({
                fieldId: z.string().min(1, "Field ID is required"),
                value: z.any(),
            })
        )
        .min(1, "At least one response is required"),
});

// Export types
export type CreateFormInput = z.infer<typeof createFormSchema>;
export type UpdateFormInput = z.infer<typeof updateFormSchema>;
export type FormSubmissionInput = z.infer<typeof formSubmissionSchema>;
