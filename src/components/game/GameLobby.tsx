import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Users, Play, Crown, Clock } from "lucide-react";

interface Player {
  id: string;
  name: string;
  avatar: string;
  isReady: boolean;
  isLeader?: boolean;
}

interface GameLobbyProps {
  gameCode?: string;
  players?: Player[];
  isLeader?: boolean;
  onStartGame?: () => void;
  onLeaveGame?: () => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({
  gameCode = "MEME123",
  players = [
    {
      id: "1",
      name: "Player 1",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player1",
      isReady: true,
      isLeader: true,
    },
    {
      id: "2",
      name: "Player 2",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player2",
      isReady: true,
    },
    {
      id: "3",
      name: "Player 3",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player3",
      isReady: true,
    },
  ],
  isLeader = true,
  onStartGame = () => console.log("Start game"),
  onLeaveGame = () => console.log("Leave game"),
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Simulate countdown when all players are ready
  useEffect(() => {
    if (
      isLeader &&
      players.every((player) => player.isReady) &&
      players.length >= 2
    ) {
      setCountdown(5);
    } else {
      setCountdown(null);
    }
  }, [players, isLeader]);

  // Countdown timer
  useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      onStartGame();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onStartGame]);

  const copyGameCode = () => {
    navigator.clipboard.writeText(gameCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const readyPlayers = players.filter((player) => player.isReady).length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-black/30 backdrop-blur-md rounded-2xl p-8 shadow-xl"
      >
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Game Lobby</h1>
          <div className="flex items-center gap-3 bg-white/10 rounded-full px-5 py-2 mb-4">
            <span className="text-lg font-semibold">Invite Code:</span>
            <span className="text-xl font-bold tracking-wider">{gameCode}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyGameCode}
              className="ml-2 text-white hover:bg-white/20"
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-amber-300">
            <Users size={20} />
            <span className="font-medium">
              {readyPlayers}/{players.length} players ready
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center p-4 rounded-xl ${player.isReady ? "bg-green-500/20" : "bg-white/10"} relative overflow-hidden`}
              >
                <motion.div
                  animate={{
                    rotate: player.isLeader ? [0, 10, -10, 10, 0] : 0,
                    scale: player.isLeader ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    repeat: player.isLeader ? Infinity : 0,
                    repeatDelay: 3,
                    duration: 0.5,
                  }}
                  className="relative"
                >
                  <Avatar className="h-16 w-16 border-2 border-white/50">
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {player.isLeader && (
                    <div className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-1">
                      <Crown size={16} className="text-amber-900" />
                    </div>
                  )}
                </motion.div>
                <div className="ml-4 flex-1">
                  <h3 className="font-bold text-lg">{player.name}</h3>
                  <span
                    className={`text-sm ${player.isReady ? "text-green-300" : "text-gray-300"}`}
                  >
                    {player.isReady ? "Ready" : "Not ready..."}
                  </span>
                </div>
                {player.isReady && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-6 -right-6 w-20 h-20 bg-green-500/20 rounded-full"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {isLeader ? (
            <Button
              onClick={onStartGame}
              disabled={
                !players.every((player) => player.isReady) || players.length < 2
              }
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center justify-center gap-2"
              size="lg"
            >
              <Play size={20} />
              {countdown !== null
                ? `Starting in ${countdown}...`
                : "Start Game"}
            </Button>
          ) : (
            <div className="flex flex-col gap-3 items-center">
              <div className="flex items-center gap-2 text-lg">
                <Clock size={20} className="text-amber-300" />
                <span>Waiting for leader to start the game...</span>
              </div>
              <Button
                onClick={onStartGame}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center justify-center gap-2"
                size="lg"
              >
                <Play size={20} />
                Request Start Game
              </Button>
            </div>
          )}
          <Button
            variant="outline"
            onClick={onLeaveGame}
            className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
          >
            Leave Game
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameLobby;
