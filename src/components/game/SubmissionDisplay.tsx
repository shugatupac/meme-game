import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Heart, Award } from "lucide-react";

interface Submission {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  imageUrl: string;
  votes: number;
  isWinner?: boolean;
}

interface SubmissionDisplayProps {
  submissions?: Submission[];
  isVotingPhase?: boolean;
  onVote?: (submissionId: string) => void;
  currentUserVote?: string | null;
  revealDelay?: number;
  isLeader?: boolean;
}

const SubmissionDisplay = ({
  submissions = [
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
  ],
  isVotingPhase = true,
  onVote = () => {},
  currentUserVote = null,
  revealDelay = 500,
  isLeader = false,
}: SubmissionDisplayProps) => {
  const [revealedCards, setRevealedCards] = useState<string[]>([]);

  // Simulate card reveal animation
  useEffect(() => {
    const timer = setTimeout(() => {
      const reveal = async () => {
        for (const submission of submissions) {
          await new Promise((resolve) => setTimeout(resolve, revealDelay));
          setRevealedCards((prev) => [...prev, submission.id]);
        }
      };
      reveal();
    }, 1000);

    return () => clearTimeout(timer);
  }, [submissions, revealDelay]);

  const handleVote = (submissionId: string) => {
    if (isVotingPhase && !isLeader) {
      onVote(submissionId);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-8 text-purple-800">
        {isVotingPhase ? "Vote for your favorite!" : "Submission Results"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((submission, index) => (
          <motion.div
            key={submission.id}
            initial={{ opacity: 0, y: 50, rotateY: 180 }}
            animate={{
              opacity: revealedCards.includes(submission.id) ? 1 : 0,
              y: revealedCards.includes(submission.id) ? 0 : 50,
              rotateY: revealedCards.includes(submission.id) ? 0 : 180,
            }}
            transition={{
              duration: 0.5,
              delay: revealedCards.includes(submission.id) ? 0 : 0.1 * index,
              type: "spring",
              stiffness: 100,
            }}
            className="flex justify-center"
          >
            <Card
              className={`w-full max-w-sm overflow-hidden ${submission.isWinner ? "ring-4 ring-yellow-400" : ""}`}
            >
              <div className="relative">
                <img
                  src={submission.imageUrl}
                  alt={`Submission by ${submission.playerName}`}
                  className="w-full h-64 object-cover"
                />

                {submission.isWinner && (
                  <motion.div
                    className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 p-2 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <Award className="h-6 w-6" />
                  </motion.div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar>
                    <img
                      src={submission.playerAvatar}
                      alt={submission.playerName}
                    />
                  </Avatar>
                  <span className="font-medium">{submission.playerName}</span>
                </div>

                {isVotingPhase ? (
                  <Button
                    variant={
                      currentUserVote === submission.id ? "default" : "outline"
                    }
                    className="w-full mt-2 group"
                    onClick={() => handleVote(submission.id)}
                    disabled={!!currentUserVote || isLeader}
                  >
                    <Heart
                      className={`mr-2 h-4 w-4 ${currentUserVote === submission.id ? "fill-white" : "group-hover:fill-red-200"}`}
                    />
                    {currentUserVote === submission.id ? "Voted!" : "Vote"}
                  </Button>
                ) : (
                  <div className="flex items-center justify-center mt-2 text-lg font-bold">
                    <Heart className="mr-2 h-5 w-5 fill-red-500 text-red-500" />
                    <span>
                      {submission.votes}{" "}
                      {submission.votes === 1 ? "vote" : "votes"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionDisplay;
