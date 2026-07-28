import { z } from "zod";

export const vendorCreateSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  logo: z.string().optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.string().email("Enter a valid email address").optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
  documents: z.array(z.string()).optional(),
});

export type VendorCreate = z.infer<typeof vendorCreateSchema>;

export default vendorCreateSchema;
