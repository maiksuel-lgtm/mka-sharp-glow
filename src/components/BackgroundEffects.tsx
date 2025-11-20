import { motion } from "framer-motion";
import { Scissors, Sparkles, Zap } from "lucide-react";

export const BackgroundEffects = () => {
  const icons = [
    { Icon: Scissors, delay: 0, x: "20%", y: "15%" },
    { Icon: Zap, delay: 0.5, x: "80%", y: "25%" },
    { Icon: Sparkles, delay: 1, x: "15%", y: "70%" },
    { Icon: Scissors, delay: 1.5, x: "85%", y: "80%" },
    { Icon: Zap, delay: 2, x: "50%", y: "90%" },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Texture overlay */}
      <div className="absolute inset-0 texture-overlay opacity-30" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating icons */}
      {icons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 8,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon className="w-20 h-20 text-gold/20" strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
};
