import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Sparkles, Zap, Trophy } from "lucide-react";

interface HomeScreenProps {
  onCreateGame?: () => void;
  onJoinGame?: () => void;
}

const HomeScreen = ({
  onCreateGame = () => {},
  onJoinGame = () => {},
}: HomeScreenProps) => {
  const [showSplash, setShowSplash] = useState(true);
  const [floatingEmojis, setFloatingEmojis] = useState<
    Array<{ id: number; x: number; emoji: string }>
  >([]);

  useEffect(() => {
    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Add floating emojis periodically
    const interval = setInterval(() => {
      if (floatingEmojis.length < 15) {
        setFloatingEmojis((prev) => [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * 100, // random position across width
            emoji: ["😂", "🤣", "😆", "😎", "🔥", "✨", "🎮"][
              Math.floor(Math.random() * 7)
            ],
          },
        ]);
      }
    }, 2000);

    // Remove old emojis
    const cleanup = setInterval(() => {
      setFloatingEmojis((prev) => prev.slice(Math.max(prev.length - 10, 0)));
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanup);
    };
  }, [floatingEmojis.length]);

  const cardIcons = [
    <Zap key="zap" className="h-12 w-12" />,
    <Sparkles key="sparkles" className="h-12 w-12" />,
    <Trophy key="trophy" className="h-12 w-12" />,
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* Floating emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {floatingEmojis.map((item) => (
            <motion.div
              key={item.id}
              initial={{ y: -20, x: `${item.x}%`, opacity: 0, scale: 0.5 }}
              animate={{
                y: "110vh",
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 1],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 15, ease: "linear" }}
              className="absolute text-3xl"
            >
              {item.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Splash screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 bg-black flex items-center justify-center z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: [0.5, 1.2, 1], rotate: [-10, 10, 0] }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
            >
              MEME BATTLE!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: showSplash ? 2 : 0 }}
        className="text-center mb-8 relative"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg"
          animate={{ scale: [1, 1.03, 1], rotate: [0, 1, 0, -1, 0] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        >
          What Do You Meme?
        </motion.h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          The hilarious party game where friends battle with the funniest meme
          reactions!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-12">
        {[1, 2, 3].map((card, index) => (
          <motion.div
            key={card}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: (showSplash ? 2.2 : 0.2) + card * 0.1,
            }}
            whileHover={{
              y: -10,
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 overflow-hidden"
          >
            <motion.div
              className="h-40 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center relative"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-white/30 absolute">{cardIcons[index]}</div>
              </motion.div>
              <motion.img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=meme${card}`}
                alt="Meme character"
                className="h-32 w-32 relative z-10"
                whileHover={{
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.5 },
                }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.1}
              />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">
              {card === 1
                ? "Create Games"
                : card === 2
                  ? "Share Laughs"
                  : "Win Together"}
            </h3>
            <p className="text-white/80">
              {card === 1
                ? "Start a new game and invite your friends with a simple code."
                : card === 2
                  ? "Submit hilarious reactions to prompts and vote for the best ones."
                  : "Collect points, win rounds, and become the ultimate meme master!"}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: showSplash ? 2.5 : 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Dialog>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                onClick={onCreateGame}
              >
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  Create Game
                </motion.span>
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            {/* CreateGame component will be rendered here */}
            <div className="p-6 bg-white rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Create a New Game</h2>
              <p className="text-gray-600 mb-6">
                Generate a unique invite code to share with your friends.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg text-center mb-6">
                <span className="text-2xl font-mono font-bold">GAME123</span>
              </div>
              <div className="flex justify-between">
                <Button variant="outline">Copy Code</Button>
                <Button>Start Game</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                onClick={onJoinGame}
              >
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 4,
                  }}
                >
                  Join Game
                </motion.span>
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            {/* JoinGame component will be rendered here */}
            <div className="p-6 bg-white rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Join a Game</h2>
              <p className="text-gray-600 mb-6">
                Enter the invite code shared by the game leader.
              </p>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Enter game code"
                  className="w-full p-3 border border-gray-300 rounded-lg text-center text-xl font-mono"
                />
              </div>
              <Button className="w-full">Join Game</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default HomeScreen;
