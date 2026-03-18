import z from "zod";

export const bankAccountSchema = z.object({
  bankName: z.string().min(1, "Please select a bank"),
  accountNumber: z
    .string()
    .min(10, "Account number must be 10 digits")
    .max(10, "Account number must be 10 digits")
    .regex(/^\d+$/, "Account number must contain digits only"),
    accountName: z.string().min(1, "Account name is required"),
});

export const vehicleCapabilitySchema = z.object({
  vehicle_type: z.string().min(1, "Please select a vehicle type"),
  plate_number: z.string().min(1, "Plate number is required"),
  package_weight: z.string().min(1, "Please select package type"),
})



