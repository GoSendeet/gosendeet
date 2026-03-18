import {FranchiseCard} from "@/components/ui/FranchiseCard";
import { Clock } from "lucide-react";

const PendingAssignments = () => {
  return (
    <FranchiseCard
      icon={Clock}
      iconBg="#FFFBEB"
      iconColor="#E17100"
      title="Pending Assignments"
      value="5"
    />
  );
};

export default PendingAssignments;
