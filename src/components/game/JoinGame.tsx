import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowRight, AlertCircle } from "lucide-react";

interface JoinGameProps {
  isOpen?: boolean;
  onClose?: () => void;
  onJoinGame?: (code: string) => void;
}

const JoinGame = ({
  isOpen = true,
  onClose = () => {},
  onJoinGame = () => {},
}: JoinGameProps) => {
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!inviteCode.trim()) {
      setError("Please enter an invite code");
      return;
    }

    // Simulate validation
    setIsSubmitting(true);
    setTimeout(() => {
      // For demo purposes, we'll validate any code that's 6 characters long
      if (inviteCode.length === 6) {
        onJoinGame(inviteCode);
      } else {
        setError("Invalid invite code. Please check and try again.");
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-purple-50 border-2 border-purple-200 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-800">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              Join a Game
            </motion.div>
          </DialogTitle>
          <DialogDescription className="text-center text-purple-600">
            Enter the invite code shared by the game leader
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter 6-digit code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="text-center text-xl tracking-widest uppercase bg-white border-purple-300 focus-visible:ring-purple-500"
              maxLength={6}
              autoFocus
              disabled={isSubmitting}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-500 text-sm"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Joining...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Join Game <ArrowRight size={16} />
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGame;
