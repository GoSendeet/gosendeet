import { useState } from "react";
import SettlementsTable, { type Settlement } from "./SettlementsTable";
import TransactionsTable, { type Transaction } from "./TransactionsTable";

type Tab = "settlements" | "transactions";

type Props = {
  settlements?: Settlement[];
  settlementsLoading?: boolean;
  transactions?: Transaction[];
  transactionsLoading?: boolean;
  onViewSettlement?: (settlement: Settlement) => void;
  onDownloadSettlement?: (settlement: Settlement) => void;
  onDisputeSettlement?: (settlement: Settlement) => void;
  settlementActionPending?: boolean;
};

export default function SettlementsEarningTable({
  settlements,
  settlementsLoading = false,
  transactions,
  transactionsLoading = false,
  onViewSettlement,
  onDownloadSettlement,
  onDisputeSettlement,
  settlementActionPending = false,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("settlements");

  return (
    <>
      {/* Tab Toggle */}
      <div className="bg-gray-100 w-full md:w-fit flex items-center justify-between lg:gap-6 p-1 border rounded-2xl border-gray-100 mb-6">
        {(["settlements", "transactions"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-150 ${
              activeTab === tab
                ? "bg-white text-gray-500 shadow-sm"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="md:bg-white rounded-2xl md:border md:border-gray-100 md:shadow-sm overflow-hidden w-full">
        {/* Table */}
        {activeTab === "settlements" ? (
          <SettlementsTable
            data={settlements}
            isLoading={settlementsLoading}
            onView={onViewSettlement}
            onDownload={onDownloadSettlement}
            onDispute={onDisputeSettlement}
            actionPending={settlementActionPending}
          />
        ) : (
          <TransactionsTable data={transactions} isLoading={transactionsLoading} />
        )}
      </div>
    </>
  );
}
