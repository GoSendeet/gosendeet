import WeeklyTrendTable, { type WeeklyTrendRow } from "./WeeklyTrendTable";
import FlaggedDeliveries, { type FlaggedDelivery } from "./FlaggedDeliveries";

type Props = {
    weeklyTrend?: WeeklyTrendRow[];
    weeklyTrendLoading?: boolean;
    flaggedDeliveries?: FlaggedDelivery[];
    flaggedDeliveriesLoading?: boolean;
}

const PerformanceInsights = ({
  weeklyTrend,
  weeklyTrendLoading,
  flaggedDeliveries,
  flaggedDeliveriesLoading,
}: Props) => {
  return(
    <div className="flex flex-col gap-4 w-full">
        <WeeklyTrendTable data={weeklyTrend} isLoading={weeklyTrendLoading} />
        <FlaggedDeliveries data={flaggedDeliveries} isLoading={flaggedDeliveriesLoading}/>
    </div>
  );
};

export default PerformanceInsights;
