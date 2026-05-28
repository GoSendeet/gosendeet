import {
  mapFranchiseDelivery,
  type FranchiseDeliverySource,
} from "@/schema/franchise/delivery/contract";
import {
  acceptFranchiseDelivery,
  acceptFranchiseTask,
  completeFranchiseTask,
  declineFranchiseDelivery,
  declineFranchiseTask,
  getFranchiseDeliveries,
  startFranchiseTask,
  type FranchiseDeliveriesParams,
  type PageResponse,
} from "@/services/franchise";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  franchiseDashboardActivityKey,
  franchiseDashboardSummaryKey,
} from "./useFranchiseDashboard";
import {
  franchiseEarningsSummaryKey,
} from "./useFranchiseEarnings";

export const franchiseDeliveriesKey = (params?: FranchiseDeliveriesParams) => [
  "franchise_deliveries",
  params,
];

const invalidateFranchiseWork = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["franchise_deliveries"] });
  queryClient.invalidateQueries({ queryKey: franchiseDashboardSummaryKey() });
  queryClient.invalidateQueries({ queryKey: franchiseDashboardActivityKey() });
  queryClient.invalidateQueries({ queryKey: ["franchise_company_transactions"] });
  queryClient.invalidateQueries({ queryKey: franchiseEarningsSummaryKey });
  queryClient.invalidateQueries({ queryKey: ["franchise_earnings_transactions"] });
  queryClient.invalidateQueries({ queryKey: ["franchise_settlements"] });
};

export const useGetFranchiseDeliveries = (params: FranchiseDeliveriesParams) =>
  useQuery({
    queryKey: franchiseDeliveriesKey(params),
    queryFn: () => getFranchiseDeliveries(params),
    select: (page: PageResponse<FranchiseDeliverySource>) => ({
      ...page,
      content: page.content.map(mapFranchiseDelivery),
    }),
  });

export const useAcceptFranchiseDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptFranchiseDelivery,
    onSuccess: () => {
      toast.success("Delivery accepted");
      invalidateFranchiseWork(queryClient);
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Could not accept delivery");
    },
  });
};

export const useDeclineFranchiseDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: declineFranchiseDelivery,
    onSuccess: () => {
      toast.success("Dispatch declined");
      invalidateFranchiseWork(queryClient);
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Could not decline dispatch");
    },
  });
};

export const useAcceptFranchiseTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptFranchiseTask,
    onSuccess: () => {
      toast.success("Task accepted");
      invalidateFranchiseWork(queryClient);
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Could not accept task");
    },
  });
};

export const useDeclineFranchiseTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: declineFranchiseTask,
    onSuccess: () => {
      toast.success("Task declined");
      invalidateFranchiseWork(queryClient);
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Could not decline task");
    },
  });
};

export const useStartFranchiseTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startFranchiseTask,
    onSuccess: () => {
      toast.success("Task started");
      invalidateFranchiseWork(queryClient);
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Could not start task");
    },
  });
};

export const useCompleteFranchiseTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeFranchiseTask,
    onSuccess: () => {
      toast.success("Task completed");
      invalidateFranchiseWork(queryClient);
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Could not complete task");
    },
  });
};
