import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Calendar, LayoutDashboard } from 'lucide-react';

export const AdminHeader = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-gold">MkA Cortes</h1>
            <nav className="hidden md:flex gap-2">
              <Link to="/admin/dashboard">
                <Button
                  variant={location.pathname === '/admin/dashboard' ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/admin/today">
                <Button
                  variant={location.pathname === '/admin/today' ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Clientes do Dia
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
