import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Filter, ImageIcon, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
  onSelectImage?: (imageUrl: string) => void;
  isSelectable?: boolean;
  searchEnabled?: boolean;
}

const ImageGallery = ({
  onSelectImage = () => {},
  isSelectable = true,
  searchEnabled = true,
}: ImageGalleryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<
    Array<{ id: string; url: string; alt: string }>
  >([]);
  const [filteredImages, setFilteredImages] = useState<
    Array<{ id: string; url: string; alt: string }>
  >([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for images
  useEffect(() => {
    // Simulate loading delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      // In a real app, this would be fetched from an API
      const mockImages = [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=300&q=80",
          alt: "Surprised cat",
        },
        {
          id: "2",
          url: "https://images.unsplash.com/photo-1501820488136-72669149e0d4?w=300&q=80",
          alt: "Laughing dog",
        },
        {
          id: "3",
          url: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=300&q=80",
          alt: "Shocked face",
        },
        {
          id: "4",
          url: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=300&q=80",
          alt: "Eye roll",
        },
        {
          id: "5",
          url: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=300&q=80",
          alt: "Happy kid",
        },
        {
          id: "6",
          url: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=300&q=80",
          alt: "Confused dog",
        },
        {
          id: "7",
          url: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=300&q=80",
          alt: "Grumpy cat",
        },
        {
          id: "8",
          url: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=300&q=80",
          alt: "Excited puppy",
        },
        {
          id: "9",
          url: "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=300&q=80",
          alt: "Sleepy cat",
        },
        {
          id: "10",
          url: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=300&q=80",
          alt: "Angry bird",
        },
        {
          id: "11",
          url: "https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=300&q=80",
          alt: "Surprised monkey",
        },
        {
          id: "12",
          url: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=300&q=80",
          alt: "Laughing baby",
        },
      ];
      setImages(mockImages);
      setFilteredImages(mockImages);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter images based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredImages(images);
    } else {
      const filtered = images.filter((image) =>
        image.alt.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredImages(filtered);
    }
  }, [searchQuery, images]);

  const handleImageSelect = (imageId: string, imageUrl: string) => {
    setSelectedImageId(imageId);
    onSelectImage(imageUrl);
  };

  // Staggered animation for image grid
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-purple-50 rounded-lg p-4 flex flex-col gap-4">
      {searchEnabled && (
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              className="pl-10 pr-4 py-2 w-full bg-white/80 backdrop-blur-sm focus:bg-white transition-all duration-300"
              placeholder="Search reaction images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <Filter size={18} />
            </Button>
          </motion.div>
        </motion.div>
      )}

      <ScrollArea className="flex-1 rounded-md bg-white/50 backdrop-blur-sm p-2">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                className="aspect-square rounded-lg overflow-hidden bg-gray-200"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [0.98, 1, 0.98],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.1,
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon size={32} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {filteredImages.map((image) => (
                <motion.div
                  key={image.id}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.08,
                    zIndex: 10,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${selectedImageId === image.id ? "border-primary" : "border-transparent"} transition-all duration-300`}
                  onClick={() =>
                    isSelectable && handleImageSelect(image.id, image.url)
                  }
                  layout
                >
                  <motion.div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 flex items-end">
                    <p className="text-white text-sm p-2 font-medium truncate w-full">
                      {image.alt}
                    </p>
                  </motion.div>

                  <motion.img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />

                  <AnimatePresence>
                    {selectedImageId === image.id && (
                      <motion.div
                        className="absolute inset-0 bg-primary/20 flex items-center justify-center z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          className="bg-primary text-white rounded-full p-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.2, 1] }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckCircle2 size={24} />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && filteredImages.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center h-40 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p>No images found matching your search.</p>
            <Button
              variant="link"
              onClick={() => setSearchQuery("")}
              className="mt-2"
            >
              Clear search
            </Button>
          </motion.div>
        )}
      </ScrollArea>

      <AnimatePresence>
        {isSelectable && selectedImageId && (
          <motion.div
            className="mt-4 flex justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() =>
                  onSelectImage(
                    images.find((img) => img.id === selectedImageId)?.url || "",
                  )
                }
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                >
                  Use This Reaction
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;
