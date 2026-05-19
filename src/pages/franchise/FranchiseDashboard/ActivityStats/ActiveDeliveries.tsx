import {FranchiseCard} from "@/components/ui/FranchiseCard";
import { Truck } from "lucide-react";

const ActiveDeliveries = ({ value }: { value: string }) => {
  return (
    <FranchiseCard
      icon={Truck}
      iconBg="#EFF6FF"
      iconColor="#155DFC"
      title="Active Deliveries"
      value={value}
    />
  );
};

export default ActiveDeliveries;
