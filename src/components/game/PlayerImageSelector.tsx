import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ChevronLeft, ChevronRight, ThumbsUp, X } from "lucide-react";

interface Image {
  id: string;
  url: string;
  alt: string;
}

interface PlayerImageSelectorProps {
  onSelectImage?: (imageUrl: string) => void;
  onSubmit?: (imageUrl: string) => void;
  currentPrompt?: string;
}

const PlayerImageSelector = ({
  onSelectImage = () => {},
  onSubmit = () => {},
  currentPrompt = "What do you call a dog that can do magic tricks?",
}: PlayerImageSelectorProps) => {
  const [images, setImages] = useState<Image[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mock data for images
  useEffect(() => {
    // Simulate loading delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      // In a real app, this would be fetched from an API
      const mockImages = [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=500&q=80",
          alt: "Surprised cat",
        },
        {
          id: "2",
          url: "https://images.unsplash.com/photo-1501820488136-72669149e0d4?w=500&q=80",
          alt: "Laughing dog",
        },
        {
          id: "3",
          url: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=500&q=80",
          alt: "Shocked face",
        },
        {
          id: "4",
          url: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&q=80",
          alt: "Eye roll",
        },
        {
          id: "5",
          url: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=500&q=80",
          alt: "Happy kid",
        },
        {
          id: "6",
          url: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&q=80",
          alt: "Confused dog",
        },
        {
          id: "7",
          url: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=500&q=80",
          alt: "Grumpy cat",
        },
        {
          id: "8",
          url: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=500&q=80",
          alt: "Excited puppy",
        },
      ];
      setImages(mockImages);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipe = Math.abs(offset.x) * velocity.x;

    if (swipe < -1000 && currentIndex < images.length - 1) {
      // Swiped left
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else if (swipe > 1000 && currentIndex > 0) {
      // Swiped right
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSelectImage = () => {
    if (images.length > 0) {
      const selectedUrl = images[currentIndex].url;
      setSelectedImage(selectedUrl);
      onSelectImage(selectedUrl);
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      onSubmit(selectedImage);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateZ: 0,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 p-4 flex flex-col">
      {/* Prompt display */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-md">
        <h3 className="text-lg font-medium text-gray-700 mb-1">The Prompt:</h3>
        <p className="text-xl font-bold text-purple-800">{currentPrompt}</p>
      </div>

      {/* Card swiper */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {isLoading ? (
          <div className="w-full max-w-md aspect-square bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
            <p className="text-gray-500">Loading images...</p>
          </div>
        ) : images.length > 0 ? (
          <>
            <div className="relative w-full max-w-md aspect-square mb-8">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={handleDragEnd}
                  className="absolute w-full h-full"
                >
                  <Card
                    className={`w-full h-full overflow-hidden shadow-2xl ${selectedImage === images[currentIndex].url ? "ring-4 ring-purple-500" : ""}`}
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={images[currentIndex].url}
                        alt={images[currentIndex].alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white font-medium">
                          {images[currentIndex].alt}
                        </p>
                      </div>
                      {selectedImage === images[currentIndex].url && (
                        <div className="absolute top-4 right-4 bg-purple-600 text-white p-2 rounded-full">
                          <ThumbsUp size={20} />
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation controls */}
            <div className="flex items-center justify-center space-x-6 mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevImage}
                disabled={currentIndex === 0}
                className={`p-3 rounded-full ${currentIndex === 0 ? "bg-gray-200 text-gray-400" : "bg-white text-purple-600 shadow-md"}`}
              >
                <ChevronLeft size={24} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSelectImage}
                className={`p-3 rounded-full ${selectedImage === images[currentIndex].url ? "bg-purple-600 text-white" : "bg-white text-purple-600"} shadow-md`}
              >
                {selectedImage === images[currentIndex].url ? (
                  <X size={24} />
                ) : (
                  <ThumbsUp size={24} />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextImage}
                disabled={currentIndex === images.length - 1}
                className={`p-3 rounded-full ${currentIndex === images.length - 1 ? "bg-gray-200 text-gray-400" : "bg-white text-purple-600 shadow-md"}`}
              >
                <ChevronRight size={24} />
              </motion.button>
            </div>

            {/* Image counter */}
            <div className="text-center mb-6 text-gray-600">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            <p>No images available</p>
          </div>
        )}
      </div>

      {/* Submit button */}
      <div className="mt-auto">
        <Button
          onClick={handleSubmit}
          disabled={!selectedImage}
          className={`w-full py-6 text-lg ${!selectedImage ? "bg-gray-300" : "bg-gradient-to-r from-purple-600 to-indigo-600"}`}
        >
          <motion.span
            animate={selectedImage ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, repeatDelay: 1.5 }}
          >
            {selectedImage ? "Submit This Reaction" : "Select an image first"}
          </motion.span>
        </Button>
      </div>
    </div>
  );
};

export default PlayerImageSelector;
