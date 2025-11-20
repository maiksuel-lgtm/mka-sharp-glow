import { Button } from '@/components/ui/button';

interface TodayFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export const TodayFilters = ({ statusFilter, setStatusFilter }: TodayFiltersProps) => {
  const filters = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Aguardando' },
    { value: 'arrived', label: 'Chegaram' },
    { value: 'completed', label: 'Concluídos' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={statusFilter === filter.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(filter.value)}
          className={statusFilter === filter.value ? 'bg-gradient-gold' : ''}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};
