import { motion, AnimatePresence } from 'framer-motion';
import { Scissors } from 'lucide-react';

interface BookingLoaderProps {
  isLoading: boolean;
}

export const BookingLoader = ({ isLoading }: BookingLoaderProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-md"
        >
          {/* Animated glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-80 h-80 rounded-full bg-gold/30 blur-3xl"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8 px-6">
            {/* Animated scissors with cutting motion */}
            <div className="relative">
              <motion.div
                animate={{
                  rotate: [0, -15, 15, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <div className="rounded-full bg-gradient-gold p-6 shadow-gold-lg">
                  <Scissors className="w-12 h-12 text-background" />
                </div>
              </motion.div>

              {/* Sparkle effects */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    x: [0, (i - 1) * 30],
                    y: [0, -20],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut",
                  }}
                  className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-gold"
                />
              ))}
            </div>

            {/* Loading text */}
            <div className="text-center space-y-3">
              <motion.h3
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-2xl font-bold text-gold tracking-wide"
              >
                Estamos reservando seu horário…
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground text-base"
              >
                Só um instante!
              </motion.p>
            </div>

            {/* Progress dots */}
            <div className="flex gap-3">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                  className="w-2.5 h-2.5 rounded-full bg-gold"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
