import { z } from "zod";

const currentYear = new Date().getFullYear();

export const vehicleValueSchema = z.object({
  msrp: z.number().min(0, "MSRP cannot be negative").optional(),
  current: z.number().min(0, "Current value cannot be negative").optional(),
}).optional();

export const registrationDetailsSchema = z.object({
  validThru: z.string().optional(),
  renewalReceived: z.string().optional(),
  registrationFee: z.number().min(0, "Registration fee cannot be negative").optional(),
  notes: z.string().max(500, "Registration notes cannot exceed 500 characters").optional(),
}).optional();

export const insuranceSchema = z.object({
  covered: z.boolean().optional(),
  policyNumber: z.string().max(50, "Policy number cannot exceed 50 characters").optional(),
  validThru: z.string().optional(),
}).optional();

export const financingSchema = z.object({
  isFinanced: z.boolean().optional(),
  financedWith: z.string().max(100, "Financer name cannot exceed 100 characters").optional(),
  loanAmount: z.number().min(0, "Loan amount cannot be negative").optional(),
  maturityDate: z.string().optional(),
}).optional();

export const purchaseSchema = z.object({
  date: z.string().optional(),
  vendor: z.string().max(100, "Vendor name cannot exceed 100 characters").optional(),
  purchasePrice: z.number().min(0, "Purchase price cannot be negative").optional(),
}).optional();

export const vehicleCreateSchema = z.object({
  vehicleEquipment: z
    .string()
    .min(1, "Vehicle/Equipment name is required")
    .max(100, "Vehicle/Equipment name cannot exceed 100 characters"),
  vinSerial: z
    .string()
    .min(1, "VIN/Serial number is required")
    .max(50, "VIN/Serial cannot exceed 50 characters")
    .transform(val => val.toUpperCase()),
  vehicleModel: z
    .string()
    .min(1, "Model is required")
    .max(50, "Model cannot exceed 50 characters"),
  plate: z
    .string()
    .max(15, "Plate number cannot exceed 15 characters")
    .transform(val => val ? val.toUpperCase() : val)
    .optional(),
  year: z
    .number()
    .min(1900, "Year must be after 1900")
    .max(currentYear + 1, "Year cannot be in the future")
    .optional(),
  make: z
    .string()
    .max(50, "Make cannot exceed 50 characters")
    .optional(),
  value: vehicleValueSchema,
  registrationStatus: z.string().optional(),
  fuelType: z.string().optional(),
  registrationDetails: registrationDetailsSchema,
  insurance: insuranceSchema,
  financing: financingSchema,
  purchase: purchaseSchema,
  notes: z
    .string()
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional(),
  status: z
    .enum(["Active", "Inactive", "Maintenance", "Sold", "Scrapped"])
    .optional(),
});

export const vehicleUpdateSchema = vehicleCreateSchema.partial();

export type VehicleCreate = z.infer<typeof vehicleCreateSchema>;
export type VehicleUpdate = z.infer<typeof vehicleUpdateSchema>;

export default vehicleCreateSchema;
