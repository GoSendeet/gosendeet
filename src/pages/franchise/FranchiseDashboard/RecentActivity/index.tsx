import type { FranchiseDashboardActivity } from "@/services/franchise";
import { Package, CheckCircle, ArrowRight, Clock, XCircle, Wallet, AlertTriangle } from "lucide-react";

const iconConfig = {
  assignment: { icon: Package, bg: "bg-orange-100", color: "text-orange-500" },
  pickup: { icon: ArrowRight, bg: "bg-blue-100", color: "text-blue-500" },
  completed: { icon: CheckCircle, bg: "bg-green-100", color: "text-green-500" },
  declined: { icon: XCircle, bg: "bg-red-100", color: "text-red-500" },
  payout: { icon: Wallet, bg: "bg-emerald-100", color: "text-emerald-500" },
  alert: { icon: AlertTriangle, bg: "bg-amber-100", color: "text-amber-500" },
} satisfies Record<
  string,
  { icon: React.ElementType; bg: string; color: string }
>;

type ActivityType = keyof typeof iconConfig;

const formatRelativeTime = (timestamp: string) => {
  const time = new Date(timestamp).getTime();
  if (Number.isNaN(time)) return "";

  const minutes = Math.max(0, Math.floor((Date.now() - time) / 60000));
  if (minutes < 1) return "Now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
};

export default function RecentActivity({
  activities = [],
  isLoading = false,
}: {
  activities?: FranchiseDashboardActivity[];
  isLoading?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">
          Recent Activity
        </h2>
        <button className="flex items-center gap-1 text-sm text-emerald-500 hover:text-emerald-600 font-medium transition-colors">
          View All <ArrowRight size={14} />
        </button>
      </div>

      {/* Table */}
      <div className="divide-y divide-gray-100">
        {isLoading && (
          <div className="py-8 text-center text-sm text-gray-400">
            Loading activity...
          </div>
        )}

        {!isLoading && activities.length === 0 && (
          <div className="py-8 text-center text-sm text-gray-400">
            No recent activity yet
          </div>
        )}

        {!isLoading && activities.map((item) => {
          const { icon: Icon, bg, color } =
            iconConfig[(item.type as ActivityType) ?? "alert"] ?? iconConfig.alert;
          return (
            <div
              key={item.id}
              className="flex items-center py-3 gap-1 justify-between"
            >
              {/* Icon + Label */}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${bg}`}>
                  <Icon size={15} className={color} />
                </div>
              

                <div className="flex flex-col gap-1">
                    <span className="flex flex-col md:flex-row gap-2 text-xs font-semibold  md:text-sm text-gray-600">
                        {item.label}{" "}
                        <span className="text-emerald-500 font-medium">
                            {item.trackingId ?? ""}
                        </span>
                    </span>

                    {/* Route or Detail */}
                    <div className="flex item-center text-xs md:text-sm text-gray-500 text-center">
                    {item.route || item.detail || "—"}
                    </div>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-1 text-xs text-gray-400 min-w-17.5">
                <Clock size={11} />
                {formatRelativeTime(item.timestamp)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
