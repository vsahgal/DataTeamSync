import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LootItem } from '@/lib/lootItems';
import { Button } from '@/components/ui/button';

interface GiftBoxProps {
  visible: boolean;
  onOpen: (item: LootItem) => void;
  lootItem: LootItem;
}

export default function GiftBox({ visible, onOpen, lootItem }: GiftBoxProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showItem, setShowItem] = useState(false);
  
  const handleOpen = () => {
    setIsOpening(true);
    
    // After short animation, show the item inside
    setTimeout(() => {
      setShowItem(true);
      
      // Then after showing item for a moment, complete the sequence
      setTimeout(() => {
        onOpen(lootItem);
      }, 2000);
    }, 1000);
  };
  
  if (!visible) return null;
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="fixed bottom-24 left-1/2 z-50"
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 50, x: "-50%" }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <div className="relative flex flex-col items-center">
            {/* The gift box */}
            <motion.div 
              className={`w-28 h-28 relative cursor-pointer ${!isOpening && 'animate-bounce-slow'}`}
              onClick={!isOpening ? handleOpen : undefined}
              whileHover={!isOpening ? { scale: 1.05 } : {}}
              whileTap={!isOpening ? { scale: 0.95 } : {}}
            >
              {/* Gift box body */}
              <motion.div 
                className="absolute inset-0 bg-pink-400 rounded-md shadow-lg flex items-center justify-center"
                animate={isOpening ? { 
                  scaleY: 0.5, 
                  y: 50,
                  transition: { delay: 0.5, duration: 0.3 } 
                } : {}}
              >
                {!showItem && (
                  <motion.div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5,
                      repeatType: "reverse" 
                    }}
                  >
                    ?
                  </motion.div>
                )}
              </motion.div>
              
              {/* Gift box lid */}
              <motion.div 
                className="absolute inset-x-0 top-0 h-1/4 bg-pink-300 rounded-t-md shadow-sm"
                animate={isOpening ? {
                  y: -40,
                  rotateX: 40,
                  opacity: 0,
                  transition: { duration: 0.4 }
                } : {}}
              />
              
              {/* Gift ribbon */}
              <motion.div className="absolute top-0 left-1/2 w-4 h-full bg-purple-500 transform -translate-x-1/2"
                animate={isOpening ? {
                  opacity: 0,
                  transition: { delay: 0.3, duration: 0.3 }
                } : {}}
              />
              <motion.div className="absolute top-1/2 left-0 w-full h-4 bg-purple-500 transform -translate-y-1/2"
                animate={isOpening ? {
                  opacity: 0,
                  transition: { delay: 0.3, duration: 0.3 }
                } : {}}
              />
              <motion.div className="absolute top-0 left-1/2 w-8 h-8 bg-purple-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"
                animate={isOpening ? {
                  scale: 0,
                  transition: { delay: 0.2, duration: 0.3 }
                } : {}}
              />
              
              {/* The revealed item */}
              {showItem && (
                <motion.div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-white bg-opacity-80 p-3 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.3, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.6, delay: 0.8 }}
                >
                  <div className="text-4xl">{lootItem.emoji}</div>
                </motion.div>
              )}
            </motion.div>
            
            {/* Tap hint */}
            {!isOpening && (
              <motion.div 
                className="text-center mt-2 text-sm font-medium text-gray-700 bg-white bg-opacity-80 px-3 py-1 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Tap to open!
              </motion.div>
            )}
            
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