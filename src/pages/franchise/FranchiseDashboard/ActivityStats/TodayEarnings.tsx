import {FranchiseCard} from "@/components/ui/FranchiseCard";
import { TrendingUp } from "lucide-react";

const TodayEarnings = () => {
  return (
    <FranchiseCard
      icon={TrendingUp}
      iconBg="#ECFDF5"
      iconColor="#009966"
      title="Today's Earnings"
      value="₦45,200"
    />
  );
};

export default TodayEarnings;
