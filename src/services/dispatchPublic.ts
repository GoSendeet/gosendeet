import { api } from "./axios";
import { TaskDto } from "./tasks";
import { throwApiError } from "@/lib/errorHandling";

export interface DispatchView {
  bookingId: string;
  orderNumber: string;
  trackingNumber: string;
  companyId: string;
  companyName: string;
  aggregatedStatus: string;
  totalTasks: number;
  completedTasks: number;
  tasks: TaskDto[];
}

export interface DispatchActionResponse {
  message: string;
}

export const exchangeDispatchAccess = async (
  accessToken: string
): Promise<DispatchView> => {
  try {
    const res = await api.post<DispatchView | { data: DispatchView }>(
      "/dispatch/access",
      { accessToken }
    );
    return "data" in res.data ? res.data.data : res.data;
  } catch (error) {
    return throwApiError(error, "Unable to validate dispatch access");
  }
};

export const viewDispatch = async (): Promise<DispatchView> => {
  try {
    const res = await api.get<DispatchView | { data: DispatchView }>(
      "/dispatch/session"
    );
    return "data" in res.data ? res.data.data : res.data;
  } catch (error) {
    return throwApiError(error, "Unable to load dispatch");
  }
};

export const acceptDispatch = async (
  message?: string
): Promise<DispatchActionResponse> => {
  try {
    const res = await api.post<DispatchActionResponse>(
      "/dispatch/session/accept",
      message ? { message } : {}
    );
    return res.data;
  } catch (error) {
    return throwApiError(error, "Unable to accept dispatch");
  }
};

export const declineDispatch = async (
  reason: string
): Promise<DispatchActionResponse> => {
  try {
    const res = await api.post<DispatchActionResponse>(
      "/dispatch/session/decline",
      { reason }
    );
    return res.data;
  } catch (error) {
    return throwApiError(error, "Unable to decline dispatch");
  }
};

export const startTask = async (
  taskId: string,
  message?: string
): Promise<DispatchActionResponse> => {
  try {
    const res = await api.post<DispatchActionResponse>(
      `/dispatch/session/tasks/${taskId}/start`,
      message ? { message } : {}
    );
    return res.data;
  } catch (error) {
    return throwApiError(error, "Unable to start task");
  }
};

export const completeTask = async (
  taskId: string,
  payload: { message?: string; notes?: string; proofPhotos?: File[] }
): Promise<DispatchActionResponse> => {
  const form = new FormData();

  const requestData: { message?: string; notes?: string } = {};
  if (payload.message?.trim()) {
    requestData.message = payload.message.trim();
  }
  if (payload.notes?.trim()) {
    requestData.notes = payload.notes.trim();
  }

  form.append(
    "request",
    new Blob([JSON.stringify(requestData)], {
      type: "application/json",
    })
  );

  if (payload.proofPhotos && payload.proofPhotos.length > 0) {
    payload.proofPhotos.forEach((file) => {
      form.append("proofPhotos", file);
    });
  }

  try {
    const res = await api.post<DispatchActionResponse>(
      `/dispatch/session/tasks/${taskId}/complete`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    return throwApiError(error, "Unable to complete task");
  }
};

export const updateTaskEtaWindow = async (
  taskId: string,
  estimatedTimeWindowStart: string,
  estimatedTimeWindowEnd: string
): Promise<DispatchActionResponse> => {
  try {
    const res = await api.put<DispatchActionResponse>(
      `/dispatch/session/tasks/${taskId}/eta`,
      { estimatedTimeWindowStart, estimatedTimeWindowEnd }
    );
    return res.data;
  } catch (error) {
    return throwApiError(error, "Unable to update ETA window");
  }
};

export const terminateTask = async (
  taskId: string,
  reason: string
): Promise<DispatchActionResponse> => {
  try {
    const res = await api.post<DispatchActionResponse>(
      `/dispatch/session/tasks/${taskId}/terminate`,
      { reason }
    );
    return res.data;
  } catch (error) {
    return throwApiError(error, "Unable to terminate task");
  }
};
