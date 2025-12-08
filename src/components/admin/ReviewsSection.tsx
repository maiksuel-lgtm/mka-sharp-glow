import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, MessageSquare, User, Calendar, Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { EditableStars } from './EditableStars';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Review {
  id: string | null;
  rating: number | null;
  comment: string | null;
  first_name: string | null;
  created_at: string | null;
}

export function ReviewsSection() {
  const queryClient = useQueryClient();
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState<number>(0);
  const [editComment, setEditComment] = useState<string>('');

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_reviews')
        .select('*')
        .not('rating', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Review[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, rating, comment }: { id: string; rating: number; comment: string }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ rating, comment })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success('Avaliação atualizada com sucesso!');
      setEditingReview(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar avaliação');
    },
  });

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setEditRating(review.rating || 0);
    setEditComment(review.comment || '');
  };

  const handleSave = () => {
    if (!editingReview?.id) return;
    updateMutation.mutate({
      id: editingReview.id,
      rating: editRating,
      comment: editComment,
    });
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  const totalReviews = reviews.length;

  const renderStars = (rating: number | null) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= (rating || 0)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Avaliações dos Clientes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Avaliações dos Clientes
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              {averageRating}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {totalReviews} avaliações
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma avaliação encontrada</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors relative group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {review.first_name || 'Cliente'}
                        </p>
                        {review.created_at && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(review.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        )}
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground mt-2 pl-10">
                      "{review.comment}"
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleEdit(review)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Avaliação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nota</label>
              <EditableStars rating={editRating} onRatingChange={setEditRating} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Comentário</label>
              <Textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                placeholder="Comentário do cliente..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingReview(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
