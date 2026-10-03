import { z } from "zod";

export const bookingQuoteSchema = z.object({
  pickupLocation: z
    .string({ required_error: "Pickup location is required" })
    .min(1, { message: "Enter pickup location" }),
  dropOffLocation: z
    .string({ required_error: "Drop off location is required" })
    .min(1, { message: "Enter drop off location" }),
  packageTypeId: z
    .string({ required_error: "Package type is required" })
    .min(1, { message: "Enter package type" }),
  weight: z
    .string({ required_error: "Weight is required" })
    .min(1, { message: "Enter weight" }),
  dimensions: z.string().optional(),
  itemPrice: z.string().optional(),
});

export type BookingQuoteFormData = z.infer<typeof bookingQuoteSchema>;

export const defaultValues: BookingQuoteFormData = {
  pickupLocation: "",
  dropOffLocation: "",
  packageTypeId: "",
  weight: "",
  dimensions: "",
  itemPrice: "",
};

const toFormString = (value: unknown) =>
  typeof value === "string" || typeof value === "number" ? String(value) : "";

export const normalizeBookingQuoteData = (data: unknown): BookingQuoteFormData => {
  const rest: Record<string, unknown> = data && typeof data === "object" && !Array.isArray(data) ? { ...data } : {};
  delete rest.pickupDate;

  return {
    ...defaultValues,
    ...rest,
    pickupLocation: typeof rest.pickupLocation === "string" ? rest.pickupLocation : "",
    dropOffLocation: typeof rest.dropOffLocation === "string" ? rest.dropOffLocation : "",
    packageTypeId: toFormString(rest.packageTypeId),
    weight: toFormString(rest.weight),
    dimensions: toFormString(rest.dimensions),
    itemPrice: toFormString(rest.itemPrice),
  };
};

export const readSavedBookingQuote = (): BookingQuoteFormData | null => {
  try {
    const stored = sessionStorage.getItem("bookingInputData");
    if (!stored) return null;
    const data: unknown = JSON.parse(stored);
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    return normalizeBookingQuoteData(data);
  } catch {
    return null;
  }
};

