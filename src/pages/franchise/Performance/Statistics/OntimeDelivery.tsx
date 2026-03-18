import { FranchiseCardPerformance } from "@/components/ui/FranchiseCard";
import { Clock } from "lucide-react";

const OntimeDelivery = () => {
  return (
    <>
      <FranchiseCardPerformance
        variant="progress"
        title="On-Time Delivery"
        value="96%"
        icon={Clock}
        iconBg="#EFF6FF"
        iconColor="#60A5FA"
        percentage={96}
        target="95%+"
        barColor="bg-blue-500"
      />
    </>
  );
};

export default OntimeDelivery;
