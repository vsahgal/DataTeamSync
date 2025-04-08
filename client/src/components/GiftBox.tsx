import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LootItem } from '@/lib/lootItems';
import { Button } from '@/components/ui/button';
// Using direct URL path to access the image
const giftBoxImage = "/gift-box.png";
console.log("Gift box image path:", giftBoxImage);

interface GiftBoxProps {
  visible: boolean;
  onOpen: (item: LootItem) => void;
  lootItem: LootItem;
}

export default function GiftBox({ visible, onOpen, lootItem }: GiftBoxProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showItem, setShowItem] = useState(false);

  // Debug logging
  console.log("GiftBox rendering", { visible, lootItem, isOpening, showItem });
  
  const handleOpen = () => {
    console.log("GiftBox: handleOpen called");
    setIsOpening(true);
    
    // After longer animation, show the item inside
    setTimeout(() => {
      console.log("GiftBox: showing item inside");
      setShowItem(true);
      
      // Then after showing item for a longer moment, complete the sequence
      setTimeout(() => {
        console.log("GiftBox: animation complete, calling onOpen");
        onOpen(lootItem);
      }, 4000); // Increased from 2000ms to 4000ms for more time to see the item
    }, 1500); // Increased from 1000ms to 1500ms for slower opening
  };
  
  if (!visible) {
    console.log("GiftBox: not visible, returning null");
    return null;
  }
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <div className="relative flex flex-col items-center">
            {/* The gift box - using the provided image */}
            <motion.div 
              className="relative cursor-pointer"
              onClick={!isOpening ? handleOpen : undefined}
              whileHover={!isOpening ? { scale: 1.05 } : {}}
              whileTap={!isOpening ? { scale: 0.95 } : {}}
              animate={isOpening ? 
                { y: 50, scale: 0.7, opacity: 0, rotate: 10 } : 
                { 
                  y: [0, -12, 0], 
                  opacity: 1,
                  rotate: [-5, 5, -5]
                }
              }
              transition={{
                y: {
                  duration: 3,
                  repeat: !isOpening ? Infinity : 0,
                  repeatType: "reverse",
                  ease: "easeInOut"
                },
                rotate: {
                  duration: 6,
                  repeat: !isOpening ? Infinity : 0,
                  repeatType: "reverse",
                  ease: "easeInOut"
                },
                opacity: {
                  duration: isOpening ? 0.8 : 0,
                  delay: isOpening ? 0.3 : 0
                },
                scale: {
                  duration: isOpening ? 0.8 : 0,
                  delay: isOpening ? 0.3 : 0
                }
              }}
            >
              {/* Yellow gift box with red ribbon image */}
              <motion.img 
                src={giftBoxImage} 
                alt="Gift Box"
                className="w-52 h-52 object-contain"
                style={{
                  filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.15))"
                }}
              />
              
              {/* Decorative stars */}
              <motion.div
                className="absolute -top-10 -left-10 text-xl text-cyan-400"
                animate={{ 
                  rotate: 360,
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                ★
              </motion.div>
              
              <motion.div
                className="absolute -top-5 -right-10 text-2xl text-amber-400"
                animate={{ 
                  rotate: 360,
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                ★
              </motion.div>
              
              <motion.div
                className="absolute -bottom-8 -right-5 text-lg text-pink-400"
                animate={{ 
                  rotate: 360,
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                  scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                ★
              </motion.div>
              
              {/* The revealed item - enhanced */}
              {showItem && (
                <motion.div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-white bg-opacity-90 p-5 rounded-full shadow-lg"
                  initial={{ scale: 0, opacity: 0, rotate: -10 }}
                  animate={{ 
                    scale: 1.5, 
                    opacity: 1, 
                    rotate: 0,
                    y: -10 
                  }}
                  transition={{ type: "spring", bounce: 0.6, delay: 0.8 }}
                >
                  <div className="text-6xl">{lootItem.emoji}</div>
                </motion.div>
              )}
            </motion.div>
            
            {/* Tap hint removed as requested */}
            
            {/* Item name and info - appears after opening */}
            {showItem && (
              <motion.div 
                className="mt-3 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="text-lg font-bold mb-1 bg-white bg-opacity-90 px-4 py-1 rounded-full shadow-sm">
                  {lootItem.name}
                </div>
                <div className="text-sm font-medium text-gray-600 bg-white bg-opacity-70 px-3 py-1 rounded-full max-w-[200px]">
                  {lootItem.description}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}