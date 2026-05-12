import type { TaskDto, TaskStatus as BackendTaskStatus } from "@/services/tasks";
import type {
  CompletionRequirement,
  DeliveryProof,
  DeliveryStatus,
  DeliveryTask,
  DeliveryType,
  TaskStatus,
} from "./type";

type BackendProof = NonNullable<TaskDto["completionProofs"]>[number];

export type FranchiseDeliverySource = {
  id?: string;
  orderNumber?: string;
  trackingNumber?: string;
  from?: string;
  to?: string;
  pickupLocation?: string;
  pickupAddress?: string;
  destination?: string;
  destinationAddress?: string;
  dropoffAddress?: string;
  package?: string;
  packageType?: string;
  weight?: string | number | null;
  weightUnit?: string | null;
  bookingDate?: string;
  date?: string;
  time?: string;
  earnings?: string | number | null;
  franchiseEarnings?: string | number | null;
  customerName?: string | null;
  customerPhone?: string | null;
  senderName?: string | null;
  senderPhone?: string | null;
  tasks?: TaskDto[];
};

export const BACKEND_TO_FRANCHISE_TASK_STATUS: Record<
  BackendTaskStatus,
  TaskStatus
> = {
  DRAFT: "DRAFT",
  DISPATCHED: "DISPATCHED",
  ACCEPTED: "DISPATCHED",
  DECLINED: "CANCELLED",
  ACTIVE: "STARTED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  TERMINATED: "CANCELLED",
};

const EMPTY_VALUE = "--";

const toText = (value: unknown, fallback = EMPTY_VALUE): string => {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
};

export const maskFranchiseCustomerName = (name?: string | null): string => {
  const text = toText(name);
  if (text === EMPTY_VALUE) return text;

  const parts = text.split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
};

export const maskFranchiseCustomerPhone = (phone?: string | null): string => {
  const text = toText(phone);
  const digits = text.replace(/\D/g, "");
  if (digits.length < 7) return text;
  return `${digits.slice(0, 4)}****${digits.slice(-3)}`;
};

export const mapBackendTaskStatus = (status: BackendTaskStatus): TaskStatus =>
  BACKEND_TO_FRANCHISE_TASK_STATUS[status];

export const mapCompletionRequirement = (
  requirement?: TaskDto["completionRequirement"],
): CompletionRequirement => requirement ?? "NONE";

export const normalizeProofs = (task: TaskDto): DeliveryProof[] => {
  const proofs: DeliveryProof[] = [];

  task.completionProofs?.forEach((proof: BackendProof) => {
    const url = proof.url ?? proof.fileUrl;
    if (!url) return;

    proofs.push({
      id: proof.id,
      url,
      fileName: proof.fileName,
    });
  });

  task.proofPhotos?.forEach((url, index) => {
    if (!url) return;

    proofs.push({
      url,
      fileName: `Photo ${proofs.length + index + 1}`,
      contentType: "image/*",
    });
  });

  return proofs;
};

export const mapTaskDtoToDeliveryTask = (task: TaskDto): DeliveryTask => ({
  id: task.id,
  bookingId: task.bookingId,
  companyName: task.companyName ?? EMPTY_VALUE,
  companyId: task.companyId ?? EMPTY_VALUE,
  taskType: task.taskType === "DROPOFF" ? "DROPOFF" : "PICKUP",
  status: mapBackendTaskStatus(task.status),
  destinationAddress: task.destinationAddress,
  completionRequirement: mapCompletionRequirement(task.completionRequirement),
  completeBefore: task.completeBefore ?? "",
  completeAfter: task.completeAfter ?? "",
  estimatedTime: task.estimatedTime ?? null,
  estimatedTimeWindowStart: task.estimatedTimeWindowStart ?? null,
  estimatedTimeWindowEnd: task.estimatedTimeWindowEnd ?? null,
  notes: task.notes ?? "",
  dependsOn: task.dependsOn ?? [],
  dispatchedAt: task.dispatchedAt ?? null,
  respondedAt: task.respondedAt ?? null,
  startedAt: task.startedAt ?? null,
  completedAt: task.completedAt ?? null,
  createdAt: task.createdAt ?? "",
  updatedAt: task.updatedAt ?? "",
  completionProofs: normalizeProofs(task),
  previewToken: task.previewToken ?? "",
});

export const deriveDeliveryStatus = (
  tasks: Pick<DeliveryTask, "status" | "taskType">[],
): DeliveryStatus => {
  if (tasks.length === 0) return "Pending";
  if (tasks.some((task) => task.status === "CANCELLED")) return "Declined";
  if (tasks.every((task) => task.status === "COMPLETED")) return "Delivered";
  if (
    tasks.some(
      (task) => task.taskType === "PICKUP" && task.status === "COMPLETED",
    )
  ) {
    return "Picked Up";
  }
  if (tasks.some((task) => task.status === "STARTED")) return "In Transit";
  if (tasks.some((task) => task.status === "DISPATCHED")) return "Accepted";
  return "Pending";
};

const formatWeight = (source: FranchiseDeliverySource): string => {
  if (source.weight === null || source.weight === undefined) return EMPTY_VALUE;
  const unit = source.weightUnit ? ` ${source.weightUnit}` : "";
  return `${source.weight}${unit}`;
};

const formatEarnings = (source: FranchiseDeliverySource): string => {
  const amount = source.franchiseEarnings ?? source.earnings;
  if (amount === null || amount === undefined) return EMPTY_VALUE;
  if (typeof amount === "number") {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return amount;
};

export const mapFranchiseDelivery = (
  source: FranchiseDeliverySource,
): DeliveryType => {
  const tasks = (source.tasks ?? []).map(mapTaskDtoToDeliveryTask);
  const deliveryDate = source.bookingDate ?? source.date ?? "";

  return {
    id: toText(source.trackingNumber ?? source.orderNumber ?? source.id),
    isNew: tasks.some((task) => task.status === "DRAFT"),
    status: deriveDeliveryStatus(tasks),
    from: toText(source.from ?? source.pickupLocation ?? source.pickupAddress),
    to: toText(
      source.to ??
        source.destination ??
        source.destinationAddress ??
        source.dropoffAddress,
    ),
    package: toText(source.package ?? source.packageType),
    weight: formatWeight(source),
    date: deliveryDate.split("T")[0] ?? deliveryDate,
    time: source.time ?? "",
    earnings: formatEarnings(source),
    fromAddress: source.pickupAddress ?? source.pickupLocation,
    toAddress:
      source.dropoffAddress ?? source.destinationAddress ?? source.destination,
    customerName: maskFranchiseCustomerName(
      source.customerName ?? source.senderName,
    ),
    customerPhone: maskFranchiseCustomerPhone(
      source.customerPhone ?? source.senderPhone,
    ),
    tasks,
  };
};
