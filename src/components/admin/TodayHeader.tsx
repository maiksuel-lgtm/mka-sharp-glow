import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

export const TodayHeader = () => {
  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gold/10 rounded-full">
        <Calendar className="h-8 w-8 text-gold" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-foreground">Clientes do Dia</h2>
        <p className="text-muted-foreground capitalize">{formattedDate}</p>
      </div>
    </div>
  );
};
