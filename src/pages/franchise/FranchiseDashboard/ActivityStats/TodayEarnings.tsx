import {FranchiseCard} from "@/components/ui/FranchiseCard";
import { TrendingUp } from "lucide-react";

const TodayEarnings = ({ value }: { value: string }) => {
  return (
    <FranchiseCard
      icon={TrendingUp}
      iconBg="#ECFDF5"
      iconColor="#009966"
      title="Today's Earnings"
      value={value}
    />
  );
};

export default TodayEarnings;
