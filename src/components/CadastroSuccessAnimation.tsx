import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CadastroSuccessAnimationProps {
  isVisible: boolean;
  nome: string;
  onClose: () => void;
}

export const CadastroSuccessAnimation = ({
  isVisible,
  nome,
  onClose,
}: CadastroSuccessAnimationProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(0 0% 2%) 100%)",
          }}
        >
          {/* Texture Overlay */}
          <div className="absolute inset-0 texture-overlay opacity-20" />

          {/* Animated Background Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{
              background: "radial-gradient(circle, hsl(var(--gold)) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
            style={{
              background: "radial-gradient(circle, hsl(var(--gold)) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />

          {/* Main Content Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="relative z-10 text-center max-w-md w-full"
          >
            {/* Animated Icon Container */}
            <div className="relative mb-8 flex items-center justify-center">
              {/* Rotating Scissors */}
              <motion.div
                initial={{ rotate: 0, scale: 0 }}
                animate={{ rotate: 360, scale: 1 }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px hsla(var(--gold), 0.3)",
                      "0 0 60px hsla(var(--gold), 0.6)",
                      "0 0 20px hsla(var(--gold), 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="rounded-full p-6 bg-gradient-to-br from-gold/20 to-gold-dark/20 backdrop-blur-sm border border-gold/30"
                >
                  <Scissors className="w-16 h-16 text-gold" />
                </motion.div>
              </motion.div>

              {/* Crown Decoration */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -top-4 -right-4"
              >
                <Crown className="w-8 h-8 text-gold-light" />
              </motion.div>

              {/* Checkmark */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.4, type: "spring", stiffness: 200 }}
                className="absolute -bottom-2 -right-2"
              >
                <div className="rounded-full bg-gold p-2 shadow-gold-lg">
                  <Check className="w-6 h-6 text-background" strokeWidth={3} />
                </div>
              </motion.div>

              {/* Sparkle Effects */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: [0, Math.cos((i * Math.PI * 2) / 6) * 80],
                    y: [0, Math.sin((i * Math.PI * 2) / 6) * 80],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 1 + i * 0.1,
                    ease: "easeOut",
                  }}
                  className="absolute w-2 h-2 bg-gold rounded-full"
                  style={{
                    boxShadow: "0 0 10px hsl(var(--gold))",
                  }}
                />
              ))}
            </div>

            {/* Text Content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="space-y-3 mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gold">
                Cadastro concluído com sucesso!
              </h2>
              <p className="text-lg md:text-xl text-foreground/90">
                Seja bem-vindo à <span className="text-gold font-semibold">MkA Cortes</span>,{" "}
                <span className="text-gold-light font-medium">{nome}</span>.
              </p>
              <p className="text-base md:text-lg text-muted-foreground flex items-center justify-center gap-2">
                Seu estilo agora está nas nossas mãos! <Scissors className="w-5 h-5 text-gold" />{" "}
                <Crown className="w-5 h-5 text-gold" />
              </p>
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
            >
              <Button
                onClick={onClose}
                size="lg"
                className="relative overflow-hidden group bg-gradient-gold hover:shadow-gold-lg transition-all duration-300 text-background font-semibold px-8 py-6 text-lg"
              >
                <motion.span
                  className="relative z-10"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Ir para o Painel
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-gold-light to-gold-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
