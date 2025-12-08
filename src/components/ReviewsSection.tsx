import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MessageCircle, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  first_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      // Use the secure public_reviews view that only exposes safe fields
      const { data, error } = await supabase
        .from("public_reviews" as any)
        .select("id, first_name, rating, comment, created_at")
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error && data) {
        setReviews(data as unknown as Review[]);
      }
      setIsLoading(false);
    };

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-gold text-gold"
                : "fill-transparent text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="mt-16">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mt-20"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-gold flex items-center justify-center gap-3">
          <MessageCircle className="w-8 h-8" />
          Avaliações dos Clientes
        </h2>
        <p className="text-foreground/70 mt-2">
          Veja o que nossos clientes estão dizendo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-6 hover:border-gold/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">
                    {review.first_name}
                  </h3>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatDate(review.created_at)}
                  </span>
                </div>
                {renderStars(review.rating)}
                {review.comment && (
                  <p className="mt-3 text-sm text-foreground/80 line-clamp-3">
                    "{review.comment}"
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
