import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Share2, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateGameProps {
  isOpen?: boolean;
  onClose?: () => void;
  onStartGame?: (inviteCode: string) => void;
}

const CreateGame = ({
  isOpen = true,
  onClose = () => {},
  onStartGame = () => {},
}: CreateGameProps) => {
  const [inviteCode, setInviteCode] = useState("MEME123");
  const [copied, setCopied] = useState(false);

  // Generate a random invite code (in a real app, this would be more sophisticated)
  const generateInviteCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    setInviteCode(result);
  };

  // Copy invite code to clipboard
  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle starting the game
  const handleStartGame = () => {
    onStartGame(inviteCode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-800">
            Create New Game
          </DialogTitle>
          <DialogDescription className="text-center text-purple-600">
            Share this invite code with your friends to join your game!
          </DialogDescription>
        </DialogHeader>

        <div className="my-6">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md border-2 border-purple-300 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              YOUR INVITE CODE
            </h3>
            <div className="flex items-center justify-center gap-2">
              <Input
                value={inviteCode}
                readOnly
                className="text-2xl font-bold text-center tracking-widest bg-purple-50 border-purple-200 w-40"
              />
              <Button
                onClick={copyInviteCode}
                variant="outline"
                size="icon"
                className="border-purple-200 hover:bg-purple-100"
              >
                <Copy
                  size={18}
                  className={copied ? "text-green-500" : "text-purple-500"}
                />
              </Button>
            </div>
            {copied && (
              <motion.p
                className="text-green-500 text-sm mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Copied to clipboard!
              </motion.p>
            )}
          </motion.div>

          <motion.div
            className="mt-6 flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={generateInviteCode}
              variant="outline"
              className="border-purple-300 hover:bg-purple-100 text-purple-700"
            >
              Generate New Code
            </Button>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => {}}
                variant="outline"
                className="flex-1 border-blue-300 hover:bg-blue-100 text-blue-700"
              >
                <Share2 size={18} className="mr-2" />
                Share Code
              </Button>
            </div>
          </motion.div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 hover:bg-gray-100 text-gray-700 sm:flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStartGame}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white sm:flex-1"
          >
            <Play size={18} className="mr-2" />
            Start Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGame;
