import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getClientSafeError } from '@/lib/errorHandling';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const { signIn, user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handleCreateFirstAdmin = async () => {
    if (!email || !password) {
      toast({
        title: 'Campos vazios',
        description: 'Por favor, preencha email e senha.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreatingAdmin(true);
    try {
      // Try to sign up first
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/dashboard`,
        },
      });

      // If user already exists, try to sign in and add admin role
      if (signUpError && signUpError.message.includes('already registered')) {
        // Sign in with existing user
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw new Error('Usuário já existe. Por favor, use o login normal ou verifique a senha.');
        }

        if (signInData.user) {
          // Check if user already has admin role
          const { data: existingRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', signInData.user.id)
            .eq('role', 'admin')
            .maybeSingle();

          if (!existingRole) {
            // Add admin role
            const { error: roleError } = await supabase
              .from('user_roles')
              .insert({ user_id: signInData.user.id, role: 'admin' });

            if (roleError) throw roleError;

            toast({
              title: 'Admin criado com sucesso!',
              description: 'Role de admin adicionada. Redirecionando...',
            });
          } else {
            toast({
              title: 'Você já é admin!',
              description: 'Redirecionando para o dashboard...',
            });
          }

          setTimeout(() => {
            window.location.href = '/admin/dashboard';
          }, 1500);
        }
      } else if (signUpError) {
        throw signUpError;
      } else if (authData.user) {
        // New user created, add admin role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: authData.user.id, role: 'admin' });

        if (roleError) throw roleError;

        toast({
          title: 'Admin criado com sucesso!',
          description: 'Fazendo login...',
        });

        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 1500);
      }
    } catch (error: any) {
      // Use safe error messaging - never expose internal details
      toast({
        title: 'Erro ao criar admin',
        description: getClientSafeError(error),
        variant: 'destructive',
      });
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-lg p-8 shadow-gold">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gold mb-2">MkA Cortes</h1>
            <p className="text-muted-foreground">Painel Administrativo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gold hover:bg-gold-light text-primary-foreground shadow-gold-lg transition-all"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Primeiro acesso? Crie sua conta admin
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full border-gold/50 hover:bg-gold/10 hover:border-gold text-gold transition-all"
              onClick={handleCreateFirstAdmin}
              disabled={isCreatingAdmin || loading}
            >
              {isCreatingAdmin ? 'Criando Admin...' : 'Criar Primeiro Admin'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
