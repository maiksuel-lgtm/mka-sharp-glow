import { motion } from 'framer-motion';
import { Scissors, Crown, Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SubscriptionPlan {
  id: 'basic' | 'standard' | 'premium';
  name: string;
  price: number;
  services: string[];
  icon: React.ReactNode;
  popular?: boolean;
  paymentLink: string;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 100,
    services: ['Corte de Cabelo'],
    icon: <Scissors className="h-8 w-8" />,
    paymentLink: 'https://buy.stripe.com/test_bJe28k6zn2ea4GG7eB1kA00',
  },
  {
    id: 'standard',
    name: 'Padrão',
    price: 150,
    services: ['Corte de Cabelo', 'Barba'],
    icon: <Sparkles className="h-8 w-8" />,
    popular: true,
    paymentLink: 'https://buy.stripe.com/test_cNi7sEbTHaKGflkcyV1kA01',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 165,
    services: ['Corte de Cabelo', 'Barba', 'Sobrancelha'],
    icon: <Crown className="h-8 w-8" />,
    paymentLink: 'https://buy.stripe.com/test_fZu5kw1f31a6gpodCZ1kA02',
  },
];

export function SubscriptionPlans() {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mt-20 mb-12"
    >
      <div className="text-center mb-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl md:text-4xl font-display font-bold text-gold mb-3"
        >
          Planos de Assinatura Mensal
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground max-w-xl mx-auto"
        >
          Escolha o plano ideal para você e aproveite serviços exclusivos todos os meses
        </motion.p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
        {subscriptionPlans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
            whileHover={{ scale: 1.03, y: -5 }}
            className={cn(
              "relative p-6 rounded-2xl border-2 bg-card/50 backdrop-blur-sm transition-all",
              plan.popular
                ? "border-gold shadow-gold-lg"
                : "border-border hover:border-gold/50"
            )}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-primary-foreground text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                MAIS POPULAR
              </span>
            )}

            <div className="text-center">
              <div className={cn(
                "inline-flex p-4 rounded-xl mb-4",
                plan.popular ? "bg-gold text-primary-foreground" : "bg-muted text-gold"
              )}>
                {plan.icon}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
              
              <div className="mb-4">
                <span className="text-4xl font-bold text-gold">R$ {plan.price}</span>
                <span className="text-muted-foreground">/mês</span>
              </div>

              <div className="space-y-2 mb-6">
                {plan.services.map((service) => (
                  <div key={service} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-gold" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => window.open(plan.paymentLink, '_blank')}
                className={cn(
                  "w-full",
                  plan.popular
                    ? "bg-gold hover:bg-gold-light text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                )}
              >
                Assinar Agora
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}