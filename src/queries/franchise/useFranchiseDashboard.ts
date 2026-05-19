import {
  getFranchiseDashboardActivity,
  getFranchiseDashboardSummary,
  updateFranchiseAvailability,
} from "@/services/franchise";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const franchiseDashboardSummaryKey = (periodDays = 7) => [
  "franchise_dashboard_summary",
  periodDays,
];

export const franchiseDashboardActivityKey = (limit = 10) => [
  "franchise_dashboard_activity",
  limit,
];

export const useGetFranchiseDashboardSummary = (periodDays = 7) =>
  useQuery({
    queryKey: franchiseDashboardSummaryKey(periodDays),
    queryFn: () => getFranchiseDashboardSummary(periodDays),
  });

export const useGetFranchiseDashboardActivity = (limit = 10) =>
  useQuery({
    queryKey: franchiseDashboardActivityKey(limit),
    queryFn: () => getFranchiseDashboardActivity(limit),
  });

export const useUpdateFranchiseAvailability = (periodDays = 7) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFranchiseAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: franchiseDashboardSummaryKey(periodDays),
      });
      queryClient.invalidateQueries({
        queryKey: franchiseDashboardActivityKey(),
      });
    },
  });
};
