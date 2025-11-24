import { motion } from "framer-motion";
import { Scissors, Wind, User, Sparkles, Slice, Briefcase, Users, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import degradeBaixo from "@/assets/haircuts/degrade-baixo.jpg";
import degradeMedio from "@/assets/haircuts/degrade-medio.jpg";
import degradeAlto from "@/assets/haircuts/degrade-alto.jpg";
import navalhado from "@/assets/haircuts/navalhado.jpg";
import social from "@/assets/haircuts/social.jpg";
import americano from "@/assets/haircuts/americano.jpg";
import barbaCompleta from "@/assets/haircuts/barba-completa.jpg";
import barbaDesenhada from "@/assets/haircuts/barba-desenhada.jpg";
import sobrancelhaBarba from "@/assets/haircuts/sobrancelha-barba.jpg";

interface HaircutSelectorProps {
  selectedCut: string;
  onSelect: (cut: string) => void;
}

export const HaircutSelector = ({ selectedCut, onSelect }: HaircutSelectorProps) => {
  const haircutStyles = [
    { name: "Degradê Baixo", icon: Wind, gradient: "from-gold/20 to-gold/5", image: degradeBaixo },
    { name: "Degradê Médio", icon: Wind, gradient: "from-gold/30 to-gold/10", image: degradeMedio },
    { name: "Degradê Alto", icon: Wind, gradient: "from-gold/40 to-gold/15", image: degradeAlto },
    { name: "Corte Navalhado", icon: Slice, gradient: "from-gold/25 to-gold/5", image: navalhado },
    { name: "Corte Social", icon: Briefcase, gradient: "from-gold/30 to-gold/10", image: social },
    { name: "Corte Americano", icon: Sparkles, gradient: "from-gold/35 to-gold/15", image: americano },
    { name: "Barba Completa", icon: User, gradient: "from-gold/30 to-gold/10", image: barbaCompleta },
    { name: "Barba Desenhada", icon: Scissors, gradient: "from-gold/25 to-gold/5", image: barbaDesenhada },
    { name: "Sobrancelha + Barba", icon: Eye, gradient: "from-gold/30 to-gold/10", image: sobrancelhaBarba },
  ];

  return (
    <div className="space-y-6">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-display font-bold text-gold flex items-center gap-3"
      >
        <Scissors className="w-7 h-7" />
        Selecione o Estilo
      </motion.h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {haircutStyles.map((style, index) => {
          const IconComponent = style.icon;
          const isSelected = selectedCut === style.name;
          
          return (
            <motion.button
              key={style.name}
              type="button"
              onClick={() => onSelect(style.name)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative p-4 rounded-2xl border-2 transition-all duration-500",
                "bg-card/50 backdrop-blur-sm",
                "flex flex-col items-center justify-center gap-3",
                "group overflow-hidden min-h-[200px]",
                isSelected
                  ? "border-gold shadow-gold-lg bg-gradient-to-br from-gold/20 to-transparent"
                  : "border-border/50 hover:border-gold/60 hover:shadow-gold"
              )}
            >
              {/* Texture overlay */}
              <div className="absolute inset-0 texture-overlay opacity-30" />
              
              {/* Animated gradient background */}
              <motion.div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
                  style.gradient
                )}
                animate={isSelected ? { opacity: 1 } : { opacity: 0 }}
              />
              
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              
              {/* Image container */}
              <motion.div
                className={cn(
                  "relative z-10 w-20 h-20 rounded-full overflow-hidden transition-all duration-500",
                  "border-2 border-gold/30",
                  isSelected && "shadow-gold scale-110 border-gold"
                )}
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={style.image} 
                  alt={style.name}
                  className="w-full h-full object-cover"
                />
                {/* Image overlay */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/20 transition-opacity duration-300",
                  isSelected ? "opacity-30" : "opacity-0 group-hover:opacity-20"
                )} />
              </motion.div>
              
              {/* Style name */}
              <span className={cn(
                "text-sm font-semibold relative z-10 transition-all duration-300 text-center",
                isSelected ? "text-gold scale-105" : "text-foreground/90 group-hover:text-gold/90"
              )}>
                {style.name}
              </span>
              
              {/* Selection indicator with checkmark */}
              {isSelected && (
                <motion.div
                  layoutId="selected-indicator"
                  className="absolute top-3 right-3 z-20"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                >
                  <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center shadow-gold">
                    <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </motion.div>
              )}
              
              {/* Border glow animation */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 border-2 border-gold rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
