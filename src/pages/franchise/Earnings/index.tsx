import React from "react";
import { FranchiseCardEarning } from "@/components/ui/FranchiseCard";
import { TrendingUp, CalendarDays, DollarSign } from "lucide-react";
import SettlementsEarningTable from "./SettlementsEarningTable";
import {
  useCreateFranchiseSettlementDispute,
  useDownloadFranchiseSettlementPdf,
  useGetFranchiseEarningsSummary,
  useGetFranchiseEarningsTransactions,
  useGetFranchiseSettlements,
} from "@/queries/franchise/useFranchiseEarnings";
import type { Transaction } from "./TransactionsTable";
import type { Settlement } from "./SettlementsTable";
import { toast } from "sonner";

// Card types the backend will return
type EarningCardType = "total_month" | "pending_account" | "next_payout";

// Static UI config — lives on the frontend only
const iconConfig: Record<
  EarningCardType,
  { icon: React.ElementType; iconBg: string; iconColor: string; iconSize: number }
> = {
  total_month: {
    icon: TrendingUp,
    iconBg: "#ECFDF5",
    iconColor: "#009966",
    iconSize: 25,
  },
  pending_account: {
    icon: DollarSign,
    iconBg: "#FFFBEB",
    iconColor: "#E17100",
    iconSize: 25,
  },
  next_payout: {
    icon: CalendarDays,
    iconBg: "#EFF6FF",
    iconColor: "#155DFC",
    iconSize: 25,
  },
};

type EarningCardData = {
  type: EarningCardType;
  title: string;
  value: string;
  subvalue?: string;
};

const formatCurrency = (value?: number | string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

const formatTransactionDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const Earnings = () => {
  const { data: summary, isPending: isSummaryLoading } =
    useGetFranchiseEarningsSummary();
  const { data: transactionsResponse, isPending: isTransactionsLoading } =
    useGetFranchiseEarningsTransactions({ page: 0, size: 50 });
  const { data: settlementsResponse, isPending: isSettlementsLoading } =
    useGetFranchiseSettlements({ page: 0, size: 50 });
  const downloadSettlement = useDownloadFranchiseSettlementPdf();
  const createDispute = useCreateFranchiseSettlementDispute();

  const earningCardsData: EarningCardData[] = [
    {
      type: "total_month",
      title: "Total This Month",
      value: isSummaryLoading ? "..." : formatCurrency(summary?.totalThisMonth),
      subvalue: `${summary?.completedDeliveriesThisMonth ?? 0} deliveries`,
    },
    {
      type: "pending_account",
      title: "Pending Amount",
      value: isSummaryLoading ? "..." : formatCurrency(summary?.pendingAmount),
    },
    {
      type: "next_payout",
      title: "Next Payout",
      value: summary?.nextPayoutDate
        ? formatTransactionDate(summary.nextPayoutDate)
        : isSummaryLoading
          ? "..."
          : "--",
      subvalue: `~${formatCurrency(summary?.nextPayoutEstimate)}`,
    },
  ];

  const transactions: Transaction[] = (transactionsResponse?.content ?? []).map(
    (transaction) => ({
      id: transaction.id,
      trackingId: transaction.trackingId,
      customerPaid: formatCurrency(transaction.amountPaid),
      yourFee: formatCurrency(transaction.feePaid),
      commission: `-${formatCurrency(transaction.commission)}`,
      date: formatTransactionDate(transaction.dateCreated),
    }),
  );

  const settlements: Settlement[] = (settlementsResponse?.content ?? []).map(
    (settlement) => ({
      id: settlement.id,
      period: settlement.period,
      dateRange: settlement.dateRange,
      deliveries: settlement.deliveries,
      gross: formatCurrency(settlement.gross),
      adjustments:
        Number(settlement.adjustments) < 0
          ? formatCurrency(settlement.adjustments)
          : `-${formatCurrency(Math.abs(Number(settlement.adjustments ?? 0)))}`,
      netPayout: formatCurrency(settlement.netPayout),
      status: settlement.status,
    }),
  );

  const saveBlob = (blob: Blob, settlementId: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `settlement-${settlementId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSettlement = (settlement: Settlement) => {
    downloadSettlement.mutate(settlement.id, {
      onSuccess: (blob) => saveBlob(blob, settlement.id),
    });
  };

  const handleDisputeSettlement = (settlement: Settlement) => {
    const reason = window.prompt("Reason for this settlement dispute?");
    if (!reason?.trim()) return;

    createDispute.mutate({
      settlementId: settlement.id,
      reason: reason.trim(),
      details: `Dispute submitted from franchise earnings screen for ${settlement.period}`,
    });
  };

  const handleViewSettlement = (settlement: Settlement) => {
    downloadSettlement.mutate(settlement.id, {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener,noreferrer");
        setTimeout(() => URL.revokeObjectURL(url), 30_000);
      },
      onError: () => toast.error("Could not open settlement"),
    });
  };

  return (
    <>
      <div
        className="w-full h-36 max-w-328 lg:min-h-28 rounded-2xl p-6 pb-0 opacity-100 flex flex-col gap-2"
        style={{
          background: "linear-gradient(90deg, #ECFDF5 0%, #FFFFFF 100%)",
        }}
      >
        <h1 className="text-sm lg:text-xl font-bold text-brand">
          Earnings & Settlements
        </h1>
        <p className="text-gray-600 mt-2">
          Track your earnings and payout history
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
        {earningCardsData.map((card) => (
          <FranchiseCardEarning
            key={card.type}
            {...iconConfig[card.type]}
            title={card.title}
            value={card.value}
            subvalue={card.subvalue}
          />
        ))}
      </div>

        {/* settlements and transactions table with toggle switch */}
      <div className="mt-6">
        <SettlementsEarningTable
          settlements={settlements}
          settlementsLoading={isSettlementsLoading}
          transactions={transactions}
          transactionsLoading={isTransactionsLoading}
          onViewSettlement={handleViewSettlement}
          onDownloadSettlement={handleDownloadSettlement}
          onDisputeSettlement={handleDisputeSettlement}
          settlementActionPending={downloadSettlement.isPending || createDispute.isPending}
        />
      </div>
    </>
  );
};

export default Earnings;
