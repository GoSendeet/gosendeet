import OntimeDelivery from "./Statistics/OntimeDelivery";
import AverageRating from "./Statistics/AverageRating";
import Complaints from "./Statistics/Complaints";
import PerformanceInsights from "./PerformanceInsights";
import {
  useGetFranchisePerformanceFlags,
  useGetFranchisePerformanceSummary,
  useGetFranchisePerformanceWeeklyTrend,
} from "@/queries/franchise/useFranchisePerformance";

const Performance = () => {
  const { data: summary, isPending: summaryLoading } =
    useGetFranchisePerformanceSummary();
  const { data: weeklyTrend, isPending: weeklyTrendLoading } =
    useGetFranchisePerformanceWeeklyTrend();
  const { data: flags, isPending: flagsLoading } =
    useGetFranchisePerformanceFlags();

  return (
    <>
      <div
        className="w-full h-36 max-w-328 lg:min-h-28 rounded-2xl p-6 pb-0 opacity-100 flex flex-col gap-2"
        style={{
          background: "linear-gradient(90deg, #ECFDF5 0%, #FFFFFF 100%)",
        }}
      >
        <h1 className="text-sm lg:text-xl font-bold text-brand">Performance</h1>
        <p className="text-gray-600 mt-2">
          Your delivery quality metrics and trends
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-3 mt-6">
        <OntimeDelivery
          value={summary?.onTimePercent ?? 0}
          isLoading={summaryLoading}
        />
        <AverageRating
          rating={summary?.averageRating ?? 0}
          totalRatings={summary?.totalRatings ?? 0}
          isLoading={summaryLoading}
        />
        <Complaints
          complaints={summary?.complaints ?? 0}
          totalDeliveries={summary?.totalDeliveries ?? 0}
          periodDays={summary?.periodDays ?? 30}
          isLoading={summaryLoading}
        />
      </div>

      <div className="mt-5">
        <PerformanceInsights
          weeklyTrend={weeklyTrend}
          weeklyTrendLoading={weeklyTrendLoading}
          flaggedDeliveries={flags}
          flaggedDeliveriesLoading={flagsLoading}
        />
      </div>
    </>
  );
};

export default Performance;
