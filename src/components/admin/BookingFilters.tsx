import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface BookingFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  styleFilter: string;
  setStyleFilter: (value: string) => void;
}

export const BookingFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  styleFilter,
  setStyleFilter,
}: BookingFiltersProps) => {
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setStyleFilter('all');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="arrived">Chegou</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={styleFilter} onValueChange={setStyleFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Estilo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Estilos</SelectItem>
            <SelectItem value="Degradê">Degradê</SelectItem>
            <SelectItem value="Social">Social</SelectItem>
            <SelectItem value="Navalhado">Navalhado</SelectItem>
            <SelectItem value="Undercut">Undercut</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(searchTerm || statusFilter !== 'all' || styleFilter !== 'all') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="mt-4 gap-2"
        >
          <X className="h-4 w-4" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
};
