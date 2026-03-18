import { Star } from 'lucide-react';

type StarRatingProps = {
    rating: number;
    outOf: number;
}

const StarRating = ({ rating, outOf }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: outOf }).map((_, i) => {
        const filled   = i < Math.floor(rating);
        const partial  = !filled && i < rating;
        return (
          <div key={i} className="relative w-4 h-4">
            <Star size={16} className="text-gray-200 fill-gray-200 absolute inset-0" />
            {(filled || partial) && (
              <div
                className="overflow-hidden absolute inset-0"
                style={{ width: filled ? "100%" : `${(rating % 1) * 100}%` }}
              >
                <Star size={16} className="text-amber-400 fill-amber-400" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  )
}

export default StarRating