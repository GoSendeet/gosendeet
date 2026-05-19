import {FranchiseCard} from "@/components/ui/FranchiseCard";
import { Clock } from "lucide-react";

const PendingAssignments = ({ value }: { value: string }) => {
  return (
    <FranchiseCard
      icon={Clock}
      iconBg="#FFFBEB"
      iconColor="#E17100"
      title="Pending Assignments"
      value={value}
    />
  );
};

export default PendingAssignments;
