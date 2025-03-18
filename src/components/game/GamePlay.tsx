import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Clock, Users, Award } from "lucide-react";
import MemePrompt from "./MemePrompt";
import ImageGallery from "./ImageGallery";
import SubmissionDisplay from "./SubmissionDisplay";
import ResultsDisplay from "./ResultsDisplay";

// Game states
export type GameState =
  | "waiting"
  | "prompt"
  | "submission"
  | "voting"
  | "results";

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  hasSubmitted?: boolean;
  hasVoted?: boolean;
}

interface GamePlayProps {
  gameId?: string;
  isLeader?: boolean;
  players?: Player[];
  currentPrompt?: string;
  gameState?: GameState;
  timeRemaining?: number;
  maxTime?: number;
  onSubmitImage?: (imageUrl: string) => void;
  onVote?: (submissionId: string) => void;
  onNextRound?: () => void;
  onEndGame?: () => void;
}

const GamePlay = ({
  gameId = "game123",
  isLeader = false,
  players = [
    {
      id: "player1",
      name: "Player 1",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player1",
      score: 5,
      hasSubmitted: true,
      hasVoted: false,
    },
    {
      id: "player2",
      name: "Player 2",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player2",
      score: 3,
      hasSubmitted: true,
      hasVoted: true,
    },
    {
      id: "player3",
      name: "Player 3",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player3",
      score: 2,
      hasSubmitted: false,
      hasVoted: false,
    },
  ],
  currentPrompt = "What do you call a dog that can do magic tricks?",
  gameState = "submission",
  timeRemaining = 45,
  maxTime = 60,
  onSubmitImage = () => {},
  onVote = () => {},
  onNextRound = () => {},
  onEndGame = () => {},
}: GamePlayProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentUserVote, setCurrentUserVote] = useState<string | null>(null);
  const [promptRevealed, setPromptRevealed] = useState(false);

  // Mock submissions data
  const [submissions, setSubmissions] = useState([
    {
      id: "1",
      playerId: "player1",
      playerName: "Player 1",
      playerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player1",
      imageUrl:
        "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&q=80",
      votes: 3,
      isWinner: true,
    },
    {
      id: "2",
      playerId: "player2",
      playerName: "Player 2",
      playerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player2",
      imageUrl:
        "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400&q=80",
      votes: 1,
    },
    {
      id: "3",
      playerId: "player3",
      playerName: "Player 3",
      playerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player3",
      imageUrl:
        "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&q=80",
      votes: 2,
    },
  ]);

  // Mock player results
  const playerResults = players.map((player) => ({
    id: player.id,
    name: player.name,
    avatar: player.avatar,
    score: player.score,
    isWinner: player.id === "player1",
  }));

  // Simulate prompt reveal after component mount
  useEffect(() => {
    if (gameState === "prompt") {
      const timer = setTimeout(() => {
        setPromptRevealed(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleSubmitImage = () => {
    if (selectedImage) {
      onSubmitImage(selectedImage);
      // In a real app, this would transition to waiting for others
    }
  };

  const handleVote = (submissionId: string) => {
    setCurrentUserVote(submissionId);
    onVote(submissionId);
  };

  // Calculate submission progress
  const submissionProgress = Math.round(
    (players.filter((p) => p.hasSubmitted).length / players.length) * 100,
  );

  // Calculate voting progress
  const votingProgress = Math.round(
    (players.filter((p) => p.hasVoted).length / players.length) * 100,
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 p-4 md:p-8">
      <Card className="w-full max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <CardContent className="p-0">
          {/* Game header with info */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Game #{gameId}</h2>
                <p className="text-sm opacity-80">{players.length} Players</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg">{timeRemaining}s</span>
              </div>

              {isLeader && gameState !== "results" && (
                <Button
                  variant="secondary"
                  onClick={onNextRound}
                  className="bg-white/20 hover:bg-white/30"
                >
                  Skip
                </Button>
              )}
            </div>
          </div>

          {/* Game progress indicator */}
          <div className="px-4 py-2 bg-gray-100 border-b">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>
                {gameState === "submission"
                  ? `Submissions: ${players.filter((p) => p.hasSubmitted).length}/${players.length}`
                  : gameState === "voting"
                    ? `Votes: ${players.filter((p) => p.hasVoted).length}/${players.length}`
                    : "Game in progress"}
              </span>
              <span>
                {gameState === "submission" || gameState === "voting"
                  ? `${gameState === "submission" ? submissionProgress : votingProgress}%`
                  : ""}
              </span>
            </div>
            {(gameState === "submission" || gameState === "voting") && (
              <Progress
                value={
                  gameState === "submission"
                    ? submissionProgress
                    : votingProgress
                }
                className="h-2"
              />
            )}
          </div>

          {/* Main game content area */}
          <div className="p-4 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={gameState}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {gameState === "waiting" && (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-16 h-16 border-4 border-t-purple-600 border-purple-200 rounded-full mx-auto mb-6"
                    />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Waiting for other players...
                    </h3>
                    <p className="text-gray-600">
                      The game will continue once everyone is ready
                    </p>
                  </div>
                )}

                {gameState === "prompt" && (
                  <div className="py-8">
                    <MemePrompt
                      prompt={currentPrompt}
                      isRevealed={promptRevealed}
                      onRevealComplete={() => console.log("Prompt revealed")}
                    />

                    {isLeader && (
                      <div className="mt-8 text-center">
                        <Button onClick={onNextRound} size="lg">
                          Everyone Ready? Continue
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {gameState === "submission" && (
                  <div className="py-4">
                    <div className="mb-6">
                      <MemePrompt prompt={currentPrompt} isRevealed={true} />
                    </div>

                    {isLeader ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border">
                        <Award className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">
                          You're the Leader
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Wait for players to submit their reactions
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {players.map((player) => (
                            <div
                              key={player.id}
                              className={`flex items-center space-x-2 px-3 py-2 rounded-full ${player.hasSubmitted ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                            >
                              <img
                                src={player.avatar}
                                alt={player.name}
                                className="w-6 h-6 rounded-full"
                              />
                              <span>{player.name}</span>
                              {player.hasSubmitted && (
                                <svg
                                  className="w-4 h-4 text-green-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-bold mb-4">
                          Choose your reaction image:
                        </h3>
                        <div className="mb-4">
                          <ImageGallery
                            onSelectImage={handleImageSelect}
                            isSelectable={true}
                          />
                        </div>

                        {selectedImage && (
                          <div className="mt-6 text-center">
                            <Button
                              onClick={handleSubmitImage}
                              size="lg"
                              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            >
                              Submit This Reaction
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {gameState === "voting" && (
                  <div className="py-4">
                    <div className="mb-6">
                      <MemePrompt prompt={currentPrompt} isRevealed={true} />
                    </div>

                    <SubmissionDisplay
                      submissions={submissions}
                      isVotingPhase={true}
                      onVote={handleVote}
                      currentUserVote={currentUserVote}
                      isLeader={isLeader}
                    />
                  </div>
                )}

                {gameState === "results" && (
                  <div>
                    <Tabs defaultValue="round" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="round">Round Results</TabsTrigger>
                        <TabsTrigger value="game">Game Standings</TabsTrigger>
                      </TabsList>

                      <TabsContent value="round">
                        <SubmissionDisplay
                          submissions={submissions}
                          isVotingPhase={false}
                        />
                      </TabsContent>

                      <TabsContent value="game">
                        <ResultsDisplay
                          results={playerResults}
                          onNextRound={onNextRound}
                          onEndGame={onEndGame}
                          isLeader={isLeader}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamePlay;
