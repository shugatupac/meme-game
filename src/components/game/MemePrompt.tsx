import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Sparkles } from "lucide-react";

interface MemePromptProps {
  prompt?: string;
  isRevealed?: boolean;
  onRevealComplete?: () => void;
}

const MemePrompt = ({
  prompt = "What do you call a dog that can do magic tricks?",
  isRevealed = true,
  onRevealComplete = () => {},
}: MemePromptProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (isRevealed && !isAnimating) {
      setIsAnimating(true);
      // Show sparkles when prompt is revealed
      setShowSparkles(true);
      const sparkleTimer = setTimeout(() => setShowSparkles(false), 2000);

      const timer = setTimeout(() => {
        setIsAnimating(false);
        onRevealComplete();
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearTimeout(sparkleTimer);
      };
    }
  }, [isRevealed, onRevealComplete, isAnimating]);

  // Split prompt into words for animated reveal
  const words = prompt.split(" ");

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-gray-100 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isRevealed ? 1 : 0,
          y: isRevealed ? 0 : 20,
          scale: isRevealed ? 1 : 0.95,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="overflow-hidden border-2 border-purple-500 shadow-lg relative">
          {/* Sparkles effect when revealed */}
          <AnimatePresence>
            {showSparkles && isRevealed && (
              <>
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute z-10"
                    initial={{
                      opacity: 0,
                      scale: 0,
                      x: `calc(${50 + (Math.random() * 80 - 40)}%)`,
                      y: `calc(${50 + (Math.random() * 80 - 40)}%)`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      rotate: [0, 180],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: Math.random() * 0.5,
                      ease: "easeOut",
                    }}
                  >
                    <Sparkles className="text-yellow-400 h-6 w-6" />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>

          <CardContent className="p-0">
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-blue-500 p-3 text-white font-bold text-center text-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.span
                animate={{ rotate: [0, 2, 0, -2, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="inline-block"
              >
                Meme Prompt
              </motion.span>
            </motion.div>

            <div className="p-8 text-center bg-white min-h-[120px] flex items-center justify-center">
              {isRevealed ? (
                <div className="flex flex-wrap justify-center gap-x-2">
                  {words.map((word, index) => (
                    <motion.span
                      key={index}
                      className="inline-block text-2xl font-bold"
                      initial={{ opacity: 0, y: 20, rotateX: 90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.1 + index * 0.08,
                        type: "spring",
                        stiffness: 100,
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="w-full h-6 bg-gray-200 rounded-full"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.98, 1, 0.98],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              )}
            </div>

            <motion.div
              className="bg-gray-100 p-4 text-center text-gray-600 italic"
              animate={{
                backgroundColor: isRevealed
                  ? ["#f3f4f6", "#ede9fe", "#f3f4f6"]
                  : "#f3f4f6",
              }}
              transition={{
                duration: 2,
                repeat: isRevealed ? Infinity : 0,
                repeatType: "reverse",
              }}
            >
              Choose your best reaction image!
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {!isRevealed && (
        <motion.div
          className="mt-4 text-center text-gray-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Waiting for prompt to be revealed...
        </motion.div>
      )}
    </div>
  );
};

export default MemePrompt;
