import { FranchiseCardPerformance } from "@/components/ui/FranchiseCard";
import { Clock } from "lucide-react";

const OntimeDelivery = ({
  value = 0,
  isLoading = false,
}: {
  value?: number;
  isLoading?: boolean;
}) => {
  const displayValue = isLoading ? "..." : `${value}%`;

  return (
    <>
      <FranchiseCardPerformance
        variant="progress"
        title="On-Time Delivery"
        value={displayValue}
        icon={Clock}
        iconBg="#EFF6FF"
        iconColor="#60A5FA"
        percentage={value}
        target="95%+"
        barColor="bg-blue-500"
      />
    </>
  );
};

export default OntimeDelivery;
