import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface RatingProps {
  value: number;
  max?: number;
  className?: string;
  showText?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  className,
  showText = false
}) => {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.4;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1 text-yellow-500 font-sans select-none", className)}>
      <div className="flex items-center">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, idx) => (
          <Star key={`full-${idx}`} className="h-4 w-4 fill-current text-yellow-400" />
        ))}
        {/* Half star */}
        {hasHalfStar && <StarHalf className="h-4 w-4 text-yellow-400 fill-current" />}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, idx) => (
          <Star key={`empty-${idx}`} className="h-4 w-4 text-neutral-300 dark:text-neutral-700" />
        ))}
      </div>
      {showText && (
        <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 ml-1">
          {value.toFixed(1)} / {max}
        </span>
      )}
    </div>
  );
};

export default Rating;
