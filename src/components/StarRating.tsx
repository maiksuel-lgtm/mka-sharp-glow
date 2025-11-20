import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
}

export const StarRating = ({ rating, onRate }: StarRatingProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold text-gold flex items-center gap-3">
        <Star className="w-6 h-6 fill-gold" />
        Avalie sua Experiência
      </h2>
      
      <div className="flex flex-col items-center gap-6 p-8 bg-card rounded-xl border border-border">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              onClick={() => onRate(star)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="transition-transform duration-200"
            >
              <Star
                className={cn(
                  "w-12 h-12 transition-all duration-300",
                  star <= rating
                    ? "fill-gold text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                    : "fill-transparent text-gold/30 hover:text-gold/60"
                )}
              />
            </motion.button>
          ))}
        </div>
        
        {rating > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold/90 text-sm font-medium"
          >
            Obrigado por avaliar! Sua opinião é importante.
          </motion.p>
        )}
      </div>
    </div>
  );
};
