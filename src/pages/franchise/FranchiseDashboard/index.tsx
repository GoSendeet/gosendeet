import ActivityStats from "./ActivityStats";
import { Truck, Zap } from "lucide-react";
import RecentActivity from "./RecentActivity";
import RoutingOffersBanner from "./RoutingOffersBanner";
import {
  useGetFranchiseDashboardActivity,
  useGetFranchiseDashboardSummary,
  useUpdateFranchiseAvailability,
} from "@/queries/franchise/useFranchiseDashboard";
import { useGetPendingRoutingOffers } from "@/queries/franchise/useFranchiseRoutingOffers";
import { toast } from "sonner";

const FranchiseDashboard = ({ onNavigateToDeliveries }: { onNavigateToDeliveries: (statusTab: string) => void }) => {
  const {
    data: summary,
    isPending: summaryLoading,
  } = useGetFranchiseDashboardSummary(7);
  const {
    data: activities,
    isPending: activityLoading,
  } = useGetFranchiseDashboardActivity(10);
  const availabilityMutation = useUpdateFranchiseAvailability(7);
  const { data: pendingOffers = [] } = useGetPendingRoutingOffers();
  const isOnline = summary?.online ?? false;
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const toggleAvailability = () => {
    availabilityMutation.mutate(!isOnline, {
      onSuccess: () => {
        toast.success(`You are now ${!isOnline ? "online" : "offline"}`);
      },
      onError: (error: { message?: string }) => {
        toast.error(error.message ?? "Could not update availability");
      },
    });
  };

  return (
    <>
      <div
        className="w-full h-36 max-w-328 lg:min-h-28 rounded-2xl p-6 pb-0 opacity-100"
        style={{
          background: "linear-gradient(90deg, #ECFDF5 0%, #FFFFFF 100%)",
        }}
      >
        <div className="flex flex-col lg:flex-row justify-between font-inter items-start md:items-center lg:mb-8 mb-2">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-sm lg:text-lg font-bold text-brand">
              Hello, GoSendeet Direct 👋
            </h1>
            <p className="text-sm lg:text-base text-frch-text-gray mt-2">
              {todayLabel}.
            </p>
          </div>

          {/* Online/Offline status toggle */}
          <button
            onClick={toggleAvailability}
            disabled={summaryLoading || availabilityMutation.isPending}
            className="bg-white px-2 w-[135.28px] h-[37.6px] flex items-center gap-2 rounded-full border border-[#E5E7EB] cursor-pointer transition-colors duration-300"
            style={{
              boxShadow:
                "0px 1px 2px -1px rgba(0,0,0,0.1), 0px 1px 3px 0px rgba(0,0,0,0.1)",
            }}
          >
            {/* Dot indicator */}
            <div
              className={`h-2 w-2 rounded-full shrink-0 transition-colors duration-300 ${
                isOnline ? "bg-[#1fac53]" : "bg-black"
              }`}
            />

            {/* Label */}
            <span
              className={`text-sm font-medium transition-colors duration-300 ${
                isOnline ? "text-[#1fac53]" : "text-black"
              }`}
            >
              {summaryLoading ? "Loading" : isOnline ? "Online" : "Offline"}
            </span>

            {/* Toggle pill */}
            <div
              className={`ml-auto w-8 h-4 rounded-full relative transition-colors duration-300 shrink-0 ${
                isOnline ? "bg-[#1fac53]" : "bg-black"
              }`}
            >
              <div
                className={`absolute top-0.5 h-3 w-3 bg-white rounded-full shadow transition-transform duration-300 ${
                  isOnline ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Pending routing offers — appears only when offers are waiting */}
      <div className="mt-6">
        <RoutingOffersBanner offers={pendingOffers} />
      </div>

      {/* dashboard statistics */}
      <div className="mt-4">
        <ActivityStats summary={summary} isLoading={summaryLoading} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row items-center gap-4 mt-6 font-inter">
        <button
          onClick={() => onNavigateToDeliveries("Pending")}
          className="flex items-center justify-center md:justify-start gap-3 bg-green900 w-full lg:w-fit shadow-sm text-white px-4 py-3 rounded-xl cursor-pointer">
          <span>
            <Zap size={16} color="#ffff" />
          </span>
          <span className="text-sm font-light">View New Assignments</span>
          <span className="text-sm font-light">({summary?.pendingAssignments ?? 0})</span>
        </button>

        <button
          onClick={() => onNavigateToDeliveries("Active")}
          className="flex items-center justify-center md:justify-start gap-3 shadow-sm w-full lg:w-fit border border-gray-200 bg-white text-[#0A0A0A] px-4 py-3 rounded-xl cursor-pointer">
          <span>
            <Truck size={16} />
          </span>
          <span className="text-sm font-light">Active Deliveries</span>
          <span className="text-sm font-light">({summary?.activeDeliveries ?? 0})</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <RecentActivity activities={activities} isLoading={activityLoading} />
      </div>
    </>
  );
};

export default FranchiseDashboard;
