import { z } from "zod"

export const createExpenseItemSchema = z.object({
    name: z.string().min(1, { message: "Expense name is required" }).max(200, { message: "Name cannot exceed 200 characters" }),
    value: z.number().min(0, { message: "Value must be a positive number" }),
    image: z.instanceof(File).optional().or(z.string().optional()),
})

export type CreateExpenseItemFormData = z.infer<typeof createExpenseItemSchema>
