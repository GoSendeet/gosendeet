import { FranchiseCardPerformance } from "@/components/ui/FranchiseCard";
import { Star } from "lucide-react";

const AverageRating = ({
  rating = 0,
  totalRatings = 0,
  isLoading = false,
}: {
  rating?: number;
  totalRatings?: number;
  isLoading?: boolean;
}) => {
  const displayRating = isLoading ? "..." : rating.toFixed(1);

  return (
    <>
      <FranchiseCardPerformance
        variant="rating"
        title="Average Rating"
        value={displayRating}
        icon={Star}
        iconBg="#FFFBEB"
        iconColor="#F59E0B"
        ratingValue={rating}
        outOf={5}
        totalRatings={totalRatings}
      />
    </>
  );
};

export default AverageRating;
