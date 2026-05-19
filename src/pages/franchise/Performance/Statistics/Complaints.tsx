import { FranchiseCardPerformance } from "@/components/ui/FranchiseCard";
import { TriangleAlert } from "lucide-react";

const Complaints = ({
  complaints = 0,
  totalDeliveries = 0,
  periodDays = 30,
  isLoading = false,
}: {
  complaints?: number;
  totalDeliveries?: number;
  periodDays?: number;
  isLoading?: boolean;
}) => {
  return (
    <>
      <FranchiseCardPerformance
        variant="complaint"
        title="Complaints"
        value={isLoading ? "..." : complaints.toString()}
        icon={TriangleAlert}
        iconBg="#FEF2F2"
        iconColor="#F87171"
        totalDeliveries={totalDeliveries}
        period={`last ${periodDays} days`}
      />
    </>
  );
};

export default Complaints;
