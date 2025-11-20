import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadOnlyStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ReadOnlyStars = ({ rating, size = 'md' }: ReadOnlyStarsProps) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating
              ? 'fill-gold text-gold'
              : 'fill-transparent text-gray-400'
          )}
        />
      ))}
    </div>
  );
};
