import { bankAccountSchema, vehicleCapabilitySchema } from ".";
import z from "zod";

export type BankAccountFormData = z.infer<typeof bankAccountSchema>;

export type VehicleCapabilityFormData = z.infer<typeof vehicleCapabilitySchema>;