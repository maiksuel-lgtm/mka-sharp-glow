import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableStarsProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export const EditableStars = ({ rating, onRatingChange }: EditableStarsProps) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              'h-6 w-6 transition-colors',
              star <= rating
                ? 'fill-gold text-gold'
                : 'fill-transparent text-gray-400 hover:text-gold/60'
            )}
          />
        </button>
      ))}
    </div>
  );
};
