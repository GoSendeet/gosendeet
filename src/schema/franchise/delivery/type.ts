export type TaskType = "PICKUP" | "IN_HUB" | "DROPOFF";
export type TaskStatus =
  | "PENDING_DISPATCH"
  | "DRAFT"
  | "DISPATCHED"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED";
export type CompletionRequirement = "NONE" | "PHOTO" | "SIGNATURE";

export type DeliveryProof = {
  id?: string;
  url: string;
  fileName?: string;
  contentType?: string;
  uploadedAt?: string;
};

export type DeliveryTask = {
  id: string;
  bookingId: string;
  companyName: string;
  companyId: string;
  taskType: TaskType;
  status: TaskStatus;
  destinationAddress: string;
  completionRequirement: CompletionRequirement;
  completeBefore: string | null;
  completeAfter: string | null;
  estimatedTime: string | null;
  estimatedTimeWindowStart: string | null;
  estimatedTimeWindowEnd: string | null;
  notes: string | null;
  dependsOn: string[];
  dispatchedAt: string | null;
  respondedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  completionProofs: DeliveryProof[];
  confirmationOtp?: string | null;
  previewToken: string;
};

export type DeliveryStatus =
  | "Pending"
  | "In Transit"
  | "Accepted"
  | "Picked Up"
  | "Delivered"
  | "Declined";

export type DeliveryType = {
  id: string;
  bookingId?: string;
  orderNumber?: string;
  trackingNumber?: string;
  isNew: boolean;
  status: DeliveryStatus;
  from: string;
  to: string;
  package: string;
  weight: string;
  date: string; // ISO format: YYYY-MM-DD
  time: string | null;
  estimatedDeliveryDate: string | null;
  estimatedDeliveryTime: string | null;
  earnings: string;
  fromAddress?: string;
  toAddress?: string;
  customerName: string;
  customerPhone: string;
  deliveryInstructions: string | null;
  itemValue: number | null;
  isFragile: boolean;
  isPerishable: boolean;
  isExclusive: boolean;
  isHazardous: boolean;
  tasks?: DeliveryTask[];
};
