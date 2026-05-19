import {
  createFranchiseSettlementDispute,
  downloadFranchiseSettlementPdf,
  getFranchiseEarningsSummary,
  getFranchiseEarningsTransactions,
  getFranchiseSettlements,
  type FranchiseDeliveriesParams,
} from "@/services/franchise";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const franchiseEarningsSummaryKey = ["franchise_earnings_summary"];
export const franchiseEarningsTransactionsKey = (
  params?: FranchiseDeliveriesParams,
) => ["franchise_earnings_transactions", params];
export const franchiseSettlementsKey = (params?: FranchiseDeliveriesParams) => [
  "franchise_settlements",
  params,
];

export const useGetFranchiseEarningsSummary = () =>
  useQuery({
    queryKey: franchiseEarningsSummaryKey,
    queryFn: getFranchiseEarningsSummary,
  });

export const useGetFranchiseEarningsTransactions = (
  params: FranchiseDeliveriesParams,
) =>
  useQuery({
    queryKey: franchiseEarningsTransactionsKey(params),
    queryFn: () => getFranchiseEarningsTransactions(params),
  });

export const useGetFranchiseSettlements = (params: FranchiseDeliveriesParams) =>
  useQuery({
    queryKey: franchiseSettlementsKey(params),
    queryFn: () => getFranchiseSettlements(params),
  });

export const useDownloadFranchiseSettlementPdf = () =>
  useMutation({
    mutationFn: downloadFranchiseSettlementPdf,
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Could not download settlement");
    },
  });

export const useCreateFranchiseSettlementDispute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFranchiseSettlementDispute,
    onSuccess: () => {
      toast.success("Dispute submitted");
      queryClient.invalidateQueries({ queryKey: ["franchise_settlements"] });
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Could not submit dispute");
    },
  });
};
