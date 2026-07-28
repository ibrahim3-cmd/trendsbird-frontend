import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const referenceProductSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional().or(z.literal("")),
  type: z.string().regex(objectIdRegex, { message: "Type must be a valid ObjectId" }),
  price: z.number().min(0, { message: "Price must be at least 0" }).optional().default(0),
});

export const referenceProductsArraySchema = z.array(referenceProductSchema);

export type ReferenceProductInput = z.infer<typeof referenceProductSchema>;
export type ReferenceProductsArray = z.infer<typeof referenceProductsArraySchema>;

export default referenceProductSchema;
