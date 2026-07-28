import z from "zod";

export const createPublicSupportTicketSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().trim().min(10, "Phone must be at least 10 characters"),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(100, "Subject must not exceed 100 characters"),
  description: z.string().trim().min(5, "Description must be at least 5 characters").max(1000, "Description must not exceed 1000 characters"),
});
