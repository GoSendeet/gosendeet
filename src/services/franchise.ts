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
  status: "PENDING_SETTLEMENT" | "PAID";
  paymentReference?: string | null;
  paidAt?: string | null;
};

export type FranchiseSettlementStatus =
  | "Draft"
  | "Pending Approval"
  | "Payout Failed"
  | "Paid";

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

export type FranchisePerformanceSummary = {
  onTimePercent: number;
  averageRating: number;
  totalRatings: number;
  complaints: number;
  totalDeliveries: number;
  periodDays: number;
};

export type FranchisePerformanceWeekStatus =
  | "Good"
  | "Below Target"
  | "At Risk";

export type FranchisePerformanceWeeklyTrend = {
  id: string;
  week: string;
  onTimePercent: number;
  rating: number;
  status: FranchisePerformanceWeekStatus;
};

export type FranchisePerformanceFlag = {
  id: string;
  trackingId: string;
  flag: "ON HOLD" | "PENALTY" | "WARNING";
  reason: string;
  date: string;
};

export type FranchiseProfile = {
  partnerId?: string | null;
  userId?: string | null;
  franchiseId?: string | null;
  companyId?: string | null;
  status?: string | null;
  companyName?: string | null;
  companyEmail?: string | null;
  companyPhone?: string | null;
  website?: string | null;
  logo?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
  profilePicture?: string | null;
};

export type FranchiseProfilePayload = {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
};

export type FranchiseBankAccount = {
  bankName?: string | null;
  bankCode?: string | null;
  accountNumber?: string | null;
  maskedAccountNumber?: string | null;
  accountName?: string | null;
};

export type FranchiseBankAccountPayload = {
  bankName: string;
  bankCode?: string;
  accountNumber: string;
  accountName: string;
};

export type FranchiseVehicleCapabilities = {
  vehicleType?: string | null;
  plateNumber?: string | null;
  maxPackageWeightKg?: number | string | null;
  packageCapabilities?: string[];
};

export type FranchiseVehicleCapabilitiesPayload = {
  vehicleType: string;
  plateNumber: string;
  maxPackageWeightKg: number;
  packageCapabilities: string[];
};

export type FranchiseAlertPreferences = {
  pushNotifications: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  assignmentAlerts: boolean;
  settlementUpdates: boolean;
  qualityAlerts: boolean;
};

export type FranchiseNotificationType =
  | "new_assignment"
  | "dispatch_accepted"
  | "decline_confirmed"
  | "task_started"
  | "task_completed"
  | "task_terminated"
  | "settlement_ready"
  | "dispute_update"
  | "quality_flag"
  | "payment_received"
  | "system_update";

export type FranchiseNotification = {
  id: string;
  type: FranchiseNotificationType;
  title: string;
  body: string;
  trackingId?: string | null;
  settlementId?: string | null;
  unread: boolean;
  createdAt: string;
  actionLabel?: string | null;
  actionUrl?: string | null;
};

const cleanParams = (params: FranchiseDeliveriesParams = {}) =>
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

export const acceptFranchiseTask = async (taskId: string) => {
  try {
    const res = await api.post(`/franchise/tasks/${taskId}/accept`);
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const declineFranchiseTask = async ({
  taskId,
  reason,
}: {
  taskId: string;
  reason: string;
}) => {
  try {
    const res = await api.post(`/franchise/tasks/${taskId}/decline`, {
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
  otpCode,
}: {
  taskId: string;
  proofPhotos?: File[];
  message?: string;
  otpCode?: string;
}) => {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify({ message: message ?? "", otpCode: otpCode ?? "" })], {
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

export const getFranchisePendingSettlementTransactions = async (
  params: FranchiseDeliveriesParams,
): Promise<PageResponse<FranchiseEarningsTransaction>> => {
  try {
    const res = await api.get<PageResponse<FranchiseEarningsTransaction>>(
      "/franchise/settlements/transactions",
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

export const getFranchisePerformanceSummary =
  async (): Promise<FranchisePerformanceSummary> => {
    try {
      const res = await api.get<FranchisePerformanceSummary>(
        "/franchise/performance/summary",
      );
      return res.data;
    } catch (error: unknown) {
      return throwApiError(error);
    }
  };

export const getFranchisePerformanceWeeklyTrend =
  async (): Promise<FranchisePerformanceWeeklyTrend[]> => {
    try {
      const res = await api.get<FranchisePerformanceWeeklyTrend[]>(
        "/franchise/performance/weekly-trend",
      );
      return res.data;
    } catch (error: unknown) {
      return throwApiError(error);
    }
  };

export const getFranchisePerformanceFlags =
  async (): Promise<FranchisePerformanceFlag[]> => {
    try {
      const res = await api.get<FranchisePerformanceFlag[]>(
        "/franchise/performance/flags",
      );
      return res.data;
    } catch (error: unknown) {
      return throwApiError(error);
    }
  };

export const getFranchiseProfile = async (): Promise<FranchiseProfile> => {
  try {
    const res = await api.get<FranchiseProfile>("/franchise/profile");
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const updateFranchiseProfile = async (
  payload: FranchiseProfilePayload,
): Promise<FranchiseProfile> => {
  try {
    const res = await api.put<FranchiseProfile>("/franchise/profile", payload);
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const getFranchiseBankAccount =
  async (): Promise<FranchiseBankAccount> => {
    try {
      const res = await api.get<FranchiseBankAccount>(
        "/franchise/bank-account",
      );
      return res.data;
    } catch (error: unknown) {
      return throwApiError(error);
    }
  };

export const updateFranchiseBankAccount = async (
  payload: FranchiseBankAccountPayload,
): Promise<FranchiseBankAccount> => {
  try {
    const res = await api.put<FranchiseBankAccount>(
      "/franchise/bank-account",
      payload,
    );
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const getFranchiseVehicleCapabilities =
  async (): Promise<FranchiseVehicleCapabilities> => {
    try {
      const res = await api.get<FranchiseVehicleCapabilities>(
        "/franchise/vehicle-capabilities",
      );
      return res.data;
    } catch (error: unknown) {
      return throwApiError(error);
    }
  };

export const updateFranchiseVehicleCapabilities = async (
  payload: FranchiseVehicleCapabilitiesPayload,
): Promise<FranchiseVehicleCapabilities> => {
  try {
    const res = await api.put<FranchiseVehicleCapabilities>(
      "/franchise/vehicle-capabilities",
      payload,
    );
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const getFranchiseAlertPreferences =
  async (): Promise<FranchiseAlertPreferences> => {
    try {
      const res = await api.get<FranchiseAlertPreferences>(
        "/franchise/alert-preferences",
      );
      return res.data;
    } catch (error: unknown) {
      return throwApiError(error);
    }
  };

export const updateFranchiseAlertPreferences = async (
  payload: FranchiseAlertPreferences,
): Promise<FranchiseAlertPreferences> => {
  try {
    const res = await api.put<FranchiseAlertPreferences>(
      "/franchise/alert-preferences",
      payload,
    );
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const getFranchiseNotifications = async ({
  page = 1,
  size = 20,
  status,
}: {
  page?: number;
  size?: number;
  status?: "read" | "unread";
} = {}): Promise<PageResponse<FranchiseNotification>> => {
  try {
    const res = await api.get<PageResponse<FranchiseNotification>>(
      "/franchise/notifications",
      { params: cleanParams({ page, size, status }) },
    );
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const markAllFranchiseNotificationsRead = async () => {
  try {
    const res = await api.post("/franchise/notifications/mark-all-read");
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const markFranchiseNotificationRead = async (
  id: string,
): Promise<FranchiseNotification> => {
  try {
    const res = await api.post<FranchiseNotification>(
      `/franchise/notifications/${id}/read`,
    );
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};
