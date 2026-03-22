// Form Data Types
export interface BookingFormData {
  pickupLocation: string;
  dropOffLocation: string;
  packageTypeId: string;
  weight: string;
  dimensions?: string;
  itemPrice: string;
  pickupDate?: string;
}

export interface ManualAddressData {
  street: string;
  apartment: string;
  city: string;
  state: string;
}

export interface PackageData {
  id: string;
  name: string;
  maxWeight: number;
  weightUnit: string;
  maxLength?: number;
  maxWidth?: number;
  maxHeight?: number;
  dimensionUnit?: string;
}

export interface PackageDescription {
  isFragile: boolean;
  isPerishable: boolean;
  isExclusive: boolean;
  isHazardous: boolean;
}

export interface AddressBreakdown {
  city: string;
  state: string;
}

export interface QuoteRequestItem {
  pickupLocation: string;
  pickupCity?: string;
  pickupState?: string;
  dropOffLocation: string;
  dropOffCity?: string;
  dropOffState?: string;
  packageTypeId: string;
  weight: string;
  dimensions?: string;
  itemPrice: string;
  pickupDate?: string;
  quantity: number;
  packageDescription: PackageDescription;
}

// Modal Prop Types
export interface BaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface AddressModalProps extends BaseModalProps {
  type: "pickup" | "destination";
  value: string;
  onSelect: (location: string, breakdown?: AddressBreakdown) => void;
  otherAddress?: string;
}

export interface PackageTypeModalProps extends BaseModalProps {
  selectedPackageId: string;
  currentWeight: string;
  currentDimensions: string;
  currentItemPrice: string;
  onConfirm: (
    id: string,
    name: string,
    weight: string,
    dimensions: string,
    itemPrice: string,
    packageData: PackageData
  ) => void;
}

export interface WeightModalProps extends BaseModalProps {
  value: string;
  maxWeight?: number;
  weightUnit?: string;
  onSelect: (weight: string) => void;
}

export interface DimensionsModalProps extends BaseModalProps {
  value: string;
  maxLength?: number;
  maxWidth?: number;
  maxHeight?: number;
  dimensionUnit?: string;
  onSelect: (dimensions: string) => void;
}

export interface PickupDateModalProps extends BaseModalProps {
  value: string;
  onSelect: (date: string) => void;
}

// Form Mode Types
export type FormMode = "gosendeet" | "compare" | "tracking";

// State Types for Forms
export interface FormState {
  modals: {
    pickup: boolean;
    destination: boolean;
    package: boolean;
    date: boolean;
  };
  inputData: BookingFormData;
  isHydrated: boolean;
  packageName: string;
  selectedPackageData: PackageData | null;
}

export type FormAction =
  | { type: "TOGGLE_MODAL"; modal: keyof FormState["modals"]; value: boolean }
  | { type: "SET_INPUT_DATA"; data: BookingFormData }
  | { type: "SET_HYDRATED"; value: boolean }
  | { type: "SET_PACKAGE_INFO"; name: string; data: PackageData | null }
  | { type: "RESET" };
