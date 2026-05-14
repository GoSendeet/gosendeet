import {
  getFranchisePerformanceFlags,
  getFranchisePerformanceSummary,
  getFranchisePerformanceWeeklyTrend,
} from "@/services/franchise";
import { useQuery } from "@tanstack/react-query";

export const franchisePerformanceSummaryKey = ["franchise_performance_summary"];
export const franchisePerformanceWeeklyTrendKey = [
  "franchise_performance_weekly_trend",
];
export const franchisePerformanceFlagsKey = ["franchise_performance_flags"];

export const useGetFranchisePerformanceSummary = () =>
  useQuery({
    queryKey: franchisePerformanceSummaryKey,
    queryFn: getFranchisePerformanceSummary,
  });

export const useGetFranchisePerformanceWeeklyTrend = () =>
  useQuery({
    queryKey: franchisePerformanceWeeklyTrendKey,
    queryFn: getFranchisePerformanceWeeklyTrend,
  });

export const useGetFranchisePerformanceFlags = () =>
  useQuery({
    queryKey: franchisePerformanceFlagsKey,
    queryFn: getFranchisePerformanceFlags,
  });
