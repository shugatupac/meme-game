import React, { useState } from "react";
import { motion } from "framer-motion";
import HomeScreen from "./game/HomeScreen";
import CreateGame from "./game/CreateGame";
import JoinGame from "./game/JoinGame";
import GameLobby from "./game/GameLobby";

const Home = () => {
  const [gameState, setGameState] = useState<
    "home" | "creating" | "joining" | "lobby"
  >("home");
  const [gameCode, setGameCode] = useState<string>("");

  // Handle creating a new game
  const handleCreateGame = () => {
    setGameState("creating");
  };

  // Handle joining an existing game
  const handleJoinGame = () => {
    setGameState("joining");
  };

  // Handle starting a game after creation
  const handleStartGame = (inviteCode: string) => {
    setGameCode(inviteCode);
    setGameState("lobby");
  };

  // Handle joining a game with a code
  const handleJoinWithCode = (code: string) => {
    setGameCode(code);
    setGameState("lobby");
  };

  // Handle returning to home screen
  const handleReturnHome = () => {
    setGameState("home");
    setGameCode("");
  };

  // Render different components based on game state
  const renderContent = () => {
    switch (gameState) {
      case "creating":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CreateGame
              isOpen={true}
              onClose={handleReturnHome}
              onStartGame={handleStartGame}
            />
          </motion.div>
        );
      case "joining":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <JoinGame
              isOpen={true}
              onClose={handleReturnHome}
              onJoinGame={handleJoinWithCode}
            />
          </motion.div>
        );
      case "lobby":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GameLobby
              gameCode={gameCode}
              isLeader={gameState === "creating"}
              onLeaveGame={handleReturnHome}
            />
          </motion.div>
        );
      default:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomeScreen
              onCreateGame={handleCreateGame}
              onJoinGame={handleJoinGame}
            />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
      {renderContent()}
    </div>
  );
};

export default Home;
