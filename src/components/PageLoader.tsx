import { motion, AnimatePresence } from 'framer-motion';
import { Scissors } from 'lucide-react';

interface PageLoaderProps {
  isLoading: boolean;
}

export const PageLoader = ({ isLoading }: PageLoaderProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-6">
            {/* Animated spinner */}
            <div className="relative w-24 h-24">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold border-r-gold"
              />
              
              {/* Inner icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Scissors className="w-10 h-10 text-gold" />
                </motion.div>
              </div>
            </div>

            {/* Loading text */}
            <motion.p
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-foreground text-lg font-medium tracking-wide"
            >
              Carregando… prepare-se para ficar no estilo ✂️
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
