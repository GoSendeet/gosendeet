import { FranchiseCardPerformance } from "@/components/ui/FranchiseCard";
import { TriangleAlert } from "lucide-react";

const Complaints = () => {
  return (
    <>
      <FranchiseCardPerformance
        variant="complaint"
        title="Complaints"
        value="2"
        icon={TriangleAlert}
        iconBg="#FEF2F2"
        iconColor="#F87171"
        totalDeliveries={185}
        period="this month"
      />
    </>
  );
};

export default Complaints;
