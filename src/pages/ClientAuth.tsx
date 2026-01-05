import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Scissors, LogIn, UserPlus, Crown, Check, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { getClientSafeError } from '@/lib/errorHandling';
import { cn } from '@/lib/utils';

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  phone: z.string().optional(),
});

interface SubscriptionPlan {
  id: 'basic' | 'standard' | 'premium';
  name: string;
  price: number;
  services: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 100,
    services: ['Corte de Cabelo'],
    icon: <Scissors className="h-6 w-6" />,
  },
  {
    id: 'standard',
    name: 'Padrão',
    price: 150,
    services: ['Corte de Cabelo', 'Barba'],
    icon: <Sparkles className="h-6 w-6" />,
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 165,
    services: ['Corte de Cabelo', 'Barba', 'Sobrancelha'],
    icon: <Crown className="h-6 w-6" />,
  },
];

export default function ClientAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPlans, setShowPlans] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = authSchema.parse(formData);

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password,
        });

        if (error) throw error;

        toast.success('Login realizado com sucesso!');
        navigate('/meus-dados');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: {
            data: {
              phone: formData.phone,
            },
            emailRedirectTo: `${window.location.origin}/meus-dados`,
          },
        });

        if (error) throw error;

        // If user selected a subscription plan, create it
        if (selectedPlan && data.user) {
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1);
          
          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: data.user.id,
              plan_type: selectedPlan.id,
              price: selectedPlan.price,
              services: selectedPlan.services,
              end_date: endDate.toISOString().split('T')[0],
            });

          if (subscriptionError) {
            toast.error('Conta criada, mas houve erro ao criar assinatura');
          } else {
            toast.success(`Conta criada com plano ${selectedPlan.name}!`);
          }
        } else {
          toast.success('Conta criada com sucesso!');
        }

        navigate('/meus-dados');
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(getClientSafeError(error));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="border-gold/20 shadow-gold-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Scissors className="h-12 w-12 text-gold" />
            </div>
            <CardTitle className="text-2xl text-gold">
              {isLogin ? 'Acessar Perfil' : 'Criar Conta'}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? 'Entre para visualizar seus agendamentos'
                : 'Cadastre-se e escolha seu plano de assinatura mensal'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "grid gap-8",
              !isLogin && showPlans ? "md:grid-cols-2" : "max-w-md mx-auto"
            )}>
              {/* Form Section */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone (opcional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={loading}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </div>

                {!isLogin && !showPlans && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gold/30 text-gold hover:bg-gold/10"
                    onClick={() => setShowPlans(true)}
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Ver Planos de Assinatura Mensal
                  </Button>
                )}

                {selectedPlan && (
                  <div className="p-3 rounded-lg bg-gold/10 border border-gold/30">
                    <p className="text-sm text-gold font-medium">
                      Plano selecionado: {selectedPlan.name} - R$ {selectedPlan.price}/mês
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold-light text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Processando...</span>
                  ) : (
                    <>
                      {isLogin ? (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Entrar
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          {selectedPlan ? `Cadastrar com Plano ${selectedPlan.name}` : 'Cadastrar'}
                        </>
                      )}
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setShowPlans(false);
                      setSelectedPlan(null);
                    }}
                    className="text-sm text-gold hover:underline"
                    disabled={loading}
                  >
                    {isLogin
                      ? 'Não tem conta? Cadastre-se'
                      : 'Já tem conta? Faça login'}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-sm text-muted-foreground hover:text-gold"
                    disabled={loading}
                  >
                    Voltar para Home
                  </button>
                </div>
              </form>

              {/* Subscription Plans Section */}
              {!isLogin && showPlans && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gold text-center mb-4">
                    Escolha seu Plano Mensal
                  </h3>
                  
                  {subscriptionPlans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPlan(plan)}
                      className={cn(
                        "relative p-4 rounded-xl border-2 cursor-pointer transition-all",
                        selectedPlan?.id === plan.id
                          ? "border-gold bg-gold/10"
                          : "border-border hover:border-gold/50",
                        plan.popular && "ring-2 ring-gold/30"
                      )}
                    >
                      {plan.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gold text-primary-foreground text-xs font-bold px-3 py-0.5 rounded-full">
                          MAIS POPULAR
                        </span>
                      )}
                      
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            selectedPlan?.id === plan.id ? "bg-gold text-primary-foreground" : "bg-muted text-gold"
                          )}>
                            {plan.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{plan.name}</h4>
                            <p className="text-2xl font-bold text-gold">
                              R$ {plan.price}
                              <span className="text-sm font-normal text-muted-foreground">/mês</span>
                            </p>
                          </div>
                        </div>
                        
                        {selectedPlan?.id === plan.id && (
                          <div className="bg-gold text-primary-foreground rounded-full p-1">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 space-y-1">
                        {plan.services.map((service) => (
                          <div key={service} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="h-3 w-3 text-gold" />
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-muted-foreground"
                    onClick={() => {
                      setShowPlans(false);
                      setSelectedPlan(null);
                    }}
                  >
                    Continuar sem plano
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}