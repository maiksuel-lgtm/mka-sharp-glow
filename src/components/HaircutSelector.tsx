import { motion } from "framer-motion";
import { Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

interface HaircutSelectorProps {
  selectedCut: string;
  onSelect: (cut: string) => void;
}

export const HaircutSelector = ({ selectedCut, onSelect }: HaircutSelectorProps) => {
  const haircutStyles = [
    { name: "Degradê", icon: "✂️" },
    { name: "Social", icon: "👔" },
    { name: "Militar", icon: "🎖️" },
    { name: "Undercut", icon: "⚡" },
    { name: "Navalhado", icon: "🪒" },
    { name: "Barba e Cabelo", icon: "🧔" },
    { name: "Personalizado", icon: "⭐" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-gold flex items-center gap-3">
        <Scissors className="w-6 h-6" />
        Selecione o Estilo
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {haircutStyles.map((style, index) => (
          <motion.button
            key={style.name}
            type="button"
            onClick={() => onSelect(style.name)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative p-6 rounded-xl border-2 transition-all duration-300",
              "bg-card hover:bg-card/80",
              "flex flex-col items-center justify-center gap-3",
              "group overflow-hidden",
              selectedCut === style.name
                ? "border-gold shadow-gold-lg bg-gold/10"
                : "border-border hover:border-gold/50"
            )}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
              animate={selectedCut === style.name ? { opacity: 0.2 } : {}}
            />
            
            <span className="text-4xl relative z-10">{style.icon}</span>
            <span className={cn(
              "text-sm font-semibold relative z-10 transition-colors",
              selectedCut === style.name ? "text-gold" : "text-foreground/90"
            )}>
              {style.name}
            </span>
            
            {selectedCut === style.name && (
              <motion.div
                layoutId="selected-indicator"
                className="absolute inset-0 border-2 border-gold rounded-xl"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
