import { throwApiError } from "@/lib/errorHandling";
import type { FranchiseDeliverySource } from "@/schema/franchise/delivery/contract";
import { api } from "./axios";

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
};

export type FranchiseDeliveriesParams = {
  page?: number;
  size?: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export type FranchiseDashboardSummary = {
  online: boolean;
  pendingAssignments: number;
  activeDeliveries: number;
  completedDeliveries: number;
  todayEarnings: number | string;
  completionRate: number;
  completionRatePeriodDays: number;
  unreadNotifications: number;
};

export type FranchiseDashboardActivityType =
  | "assignment"
  | "pickup"
  | "completed"
  | "declined"
  | "payout"
  | "alert";

export type FranchiseDashboardActivity = {
  id: string;
  type: FranchiseDashboardActivityType;
  label: string;
  trackingId?: string | null;
  route?: string | null;
  detail?: string | null;
  timestamp: string;
};

export type FranchiseEarningsSummary = {
  totalThisMonth: number;
  pendingAmount: number;
  nextPayoutEstimate: number;
  nextPayoutDate: string;
  completedDeliveriesThisMonth: number;
};

export type FranchiseEarningsTransaction = {
  id: string;
  trackingId: string;
  amountPaid: number;
  feePaid: number;
  commission: number;
  dateCreated: string;
};

export type FranchiseSettlementStatus = "Draft" | "Pending Approval" | "Paid";

export type FranchiseSettlement = {
  id: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  dateRange: string;
  deliveries: number;
  gross: number;
  adjustments: number;
  netPayout: number;
  status: FranchiseSettlementStatus;
  paymentReference?: string | null;
  paymentMethod?: string | null;
  paidAt?: string | null;
  createdAt?: string | null;
};

const cleanParams = (params: FranchiseDeliveriesParams) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ""),
  );

export const getFranchiseDeliveries = async (
  params: FranchiseDeliveriesParams,
): Promise<PageResponse<FranchiseDeliverySource>> => {
  try {
    const res = await api.get<PageResponse<FranchiseDeliverySource>>(
      "/franchise/deliveries",
      { params: cleanParams(params) },
    );
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const acceptFranchiseDelivery = async (bookingId: string) => {
  try {
    const res = await api.post(`/franchise/deliveries/${bookingId}/accept`);
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const declineFranchiseDelivery = async ({
  bookingId,
  reason,
}: {
  bookingId: string;
  reason: string;
}) => {
  try {
    const res = await api.post(`/franchise/deliveries/${bookingId}/decline`, {
      reason,
    });
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const startFranchiseTask = async (taskId: string) => {
  try {
    const res = await api.post(`/franchise/tasks/${taskId}/start`);
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const completeFranchiseTask = async ({
  taskId,
  proofPhotos,
  message,
}: {
  taskId: string;
  proofPhotos?: File[];
  message?: string;
}) => {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify({ message: message ?? "" })], {
      type: "application/json",
    }),
    "request.json",
  );
  proofPhotos?.forEach((file) => formData.append("proofPhotos", file));

  try {
    const res = await api.post(`/franchise/tasks/${taskId}/complete`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const getFranchiseDashboardSummary = async (
  periodDays = 7,
): Promise<FranchiseDashboardSummary> => {
  try {
    const res = await api.get<FranchiseDashboardSummary>(
      "/franchise/dashboard/summary",
      { params: { periodDays } },
    );
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const getFranchiseDashboardActivity = async (
  limit = 10,
): Promise<FranchiseDashboardActivity[]> => {
  try {
    const res = await api.get<FranchiseDashboardActivity[]>(
      "/franchise/dashboard/activity",
      { params: { limit } },
    );
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const updateFranchiseAvailability = async (online: boolean) => {
  try {
    const res = await api.put("/franchise/availability", { online });
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const getFranchiseEarningsSummary =
  async (): Promise<FranchiseEarningsSummary> => {
    try {
      const res = await api.get<FranchiseEarningsSummary>(
        "/franchise/earnings/summary",
      );
      return res.data;
    } catch (error: unknown) {
      return throwApiError(error);
    }
  };

export const getFranchiseEarningsTransactions = async (
  params: FranchiseDeliveriesParams,
): Promise<PageResponse<FranchiseEarningsTransaction>> => {
  try {
    const res = await api.get<PageResponse<FranchiseEarningsTransaction>>(
      "/franchise/earnings/transactions",
      { params: cleanParams(params) },
    );
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const getFranchiseSettlements = async (
  params: FranchiseDeliveriesParams,
): Promise<PageResponse<FranchiseSettlement>> => {
  try {
    const res = await api.get<PageResponse<FranchiseSettlement>>(
      "/franchise/settlements",
      { params: cleanParams(params) },
    );
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const downloadFranchiseSettlementPdf = async (settlementId: string) => {
  try {
    const res = await api.get(`/franchise/settlements/${settlementId}/pdf`, {
      responseType: "blob",
    });
    return res.data as Blob;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const createFranchiseSettlementDispute = async ({
  settlementId,
  reason,
  details,
}: {
  settlementId: string;
  reason: string;
  details?: string;
}) => {
  try {
    const res = await api.post(`/franchise/settlements/${settlementId}/disputes`, {
      reason,
      details,
    });
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};
