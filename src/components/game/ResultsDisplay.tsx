import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Trophy, Medal, Award, ThumbsUp } from "lucide-react";

interface PlayerResult {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isWinner?: boolean;
}

interface ResultsDisplayProps {
  results?: PlayerResult[];
  onNextRound?: () => void;
  onEndGame?: () => void;
  isLeader?: boolean;
}

const ResultsDisplay = ({
  results = [
    {
      id: "1",
      name: "Player 1",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player1",
      score: 5,
      isWinner: true,
    },
    {
      id: "2",
      name: "Player 2",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player2",
      score: 3,
    },
    {
      id: "3",
      name: "Player 3",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player3",
      score: 2,
    },
  ],
  onNextRound = () => console.log("Next round"),
  onEndGame = () => console.log("End game"),
  isLeader = true,
}: ResultsDisplayProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  // Sort results by score (highest first)
  const sortedResults = [...results].sort((a, b) => b.score - a.score);

  useEffect(() => {
    // Show confetti animation when results are displayed
    setShowConfetti(true);

    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getAwardIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 1:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 2:
        return <Award className="h-8 w-8 text-amber-700" />;
      default:
        return <ThumbsUp className="h-8 w-8 text-blue-500" />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-purple-900 to-indigo-900">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <h2 className="text-4xl font-bold text-center mb-8 text-white">
          Round Results
        </h2>

        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ y: -20, opacity: 0 }}
                animate={{
                  y: `${100 + Math.random() * 150}vh`,
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  ease: "easeOut",
                  delay: Math.random() * 0.5,
                }}
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {sortedResults.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card
                className={`overflow-hidden ${index === 0 ? "border-4 border-yellow-500" : ""}`}
              >
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <motion.div
                      className="absolute -top-2 -right-2"
                      initial={{ rotate: -20, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                    >
                      {getAwardIcon(index)}
                    </motion.div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{player.name}</h3>

                  <motion.div
                    className="text-3xl font-bold text-purple-600"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: [0.5, 1.2, 1] }}
                    transition={{ delay: index * 0.2 + 0.7, duration: 0.5 }}
                  >
                    {player.score} pts
                  </motion.div>

                  {player.isWinner && (
                    <motion.div
                      className="mt-3 bg-yellow-500 text-yellow-900 px-4 py-1 rounded-full font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5, duration: 0.3 }}
                    >
                      WINNER!
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {isLeader && (
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            <Button
              size="lg"
              onClick={onNextRound}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
            >
              Next Round
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onEndGame}
              className="border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-6 rounded-lg"
            >
              End Game
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ResultsDisplay;
