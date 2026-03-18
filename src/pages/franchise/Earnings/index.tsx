import React from "react";
import { FranchiseCardEarning } from "@/components/ui/FranchiseCard";
import { TrendingUp, CalendarDays, DollarSign } from "lucide-react";
import SettlementsEarningTable from "./SettlementsEarningTable";

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

// Shape the backend will return
type EarningCardData = {
  type: EarningCardType;
  title: string;
  value: string;
  subvalue?: string;
};

// TODO: Replace with backend data
const earningCardsData: EarningCardData[] = [
  { type: "total_month", title: "Total This Month", value: "₦468,900" },
  { type: "pending_account", title: "Pending Account", value: "₦187,700" },
  { type: "next_payout", title: "Next Payout", value: "Mar 4", subvalue: "~₦103,800" },
];

const Earnings = () => {
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
        <SettlementsEarningTable />
      </div>
    </>
  );
};

export default Earnings;
