import { FranchiseCardPerformance } from "@/components/ui/FranchiseCard";
import { Star } from "lucide-react";

const AverageRating = () => {
  return (
    <>
      <FranchiseCardPerformance
        variant="rating"
        title="Average Rating"
        value="4.7"
        icon={Star}
        iconBg="#FFFBEB"
        iconColor="#F59E0B"
        ratingValue={4.7}
        outOf={5}
        totalRatings={142}
      />
    </>
  );
};

export default AverageRating;
