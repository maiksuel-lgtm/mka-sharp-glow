import { motion, AnimatePresence } from 'framer-motion';
import { Scissors } from 'lucide-react';

interface GlobalLoaderProps {
  isLoading: boolean;
}

export const GlobalLoader = ({ isLoading }: GlobalLoaderProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          {/* Texture overlay */}
          <div className="absolute inset-0 texture-overlay opacity-20" />
          
          {/* Glow effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-96 h-96 rounded-full bg-gold/20 blur-3xl"
            />
          </div>

          {/* Logo and brand */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Animated scissors icon */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(212, 175, 55, 0.3)',
                    '0 0 40px rgba(212, 175, 55, 0.6)',
                    '0 0 20px rgba(212, 175, 55, 0.3)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="rounded-full bg-gradient-gold p-8"
              >
                <Scissors className="w-16 h-16 text-background" />
              </motion.div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gold mb-2 tracking-wider">
                MkA Cortes
              </h1>
              <p className="text-muted-foreground text-sm md:text-base tracking-widest uppercase">
                Premium Barber Shop
              </p>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                  className="w-2 h-2 rounded-full bg-gold"
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
