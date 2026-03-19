import WeeklyTrendTable, { type WeeklyTrendRow } from "./WeeklyTrendTable";
import FlaggedDeliveries, { type FlaggedDelivery } from "./FlaggedDeliveries";

type Props = {
    weeklyTrend?: WeeklyTrendRow[];
    flaggedDeliveries?: FlaggedDelivery[];
}

const PerformanceInsights = ({ weeklyTrend, flaggedDeliveries }: Props) => {
  return(
    <div className="flex flex-col gap-4 w-full">
        <WeeklyTrendTable data={weeklyTrend} />
        <FlaggedDeliveries data={flaggedDeliveries}/>
    </div>
  );
};

export default PerformanceInsights;
