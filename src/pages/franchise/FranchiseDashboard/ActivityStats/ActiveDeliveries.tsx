import {FranchiseCard} from "@/components/ui/FranchiseCard";
import { Truck } from "lucide-react";

const ActiveDeliveries = () => {
  return (
    <FranchiseCard
      icon={Truck}
      iconBg="#EFF6FF"
      iconColor="#155DFC"
      title="Active Deliveries"
      value="3"
    />
  );
};

export default ActiveDeliveries;
