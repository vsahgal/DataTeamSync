import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CollectedItem } from '@/lib/lootItems';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LootCollectionProps {
  items: CollectedItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function LootCollection({ items, isOpen, onClose }: LootCollectionProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const sortedItems = [...items].sort((a, b) => {
    // First by rarity (rare first)
    const rarityOrder = { 'rare': 0, 'uncommon': 1, 'common': 2 };
    if (rarityOrder[a.rarity as keyof typeof rarityOrder] !== rarityOrder[b.rarity as keyof typeof rarityOrder]) {
      return rarityOrder[a.rarity as keyof typeof rarityOrder] - rarityOrder[b.rarity as keyof typeof rarityOrder];
    }
    
    // Then by count (most collected first)
    if (a.count !== b.count) {
      return b.count - a.count;
    }
    
    // Finally by name
    return a.name.localeCompare(b.name);
  });
  
  const filteredItems = selectedType 
    ? sortedItems.filter(item => item.type === selectedType)
    : sortedItems;
  
  // Get unique types from the collection
  const itemTypes = Array.from(new Set(items.map(item => item.type)));
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl max-w-md w-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-t-xl">
              <h2 className="text-2xl font-bold text-white text-center flex flex-col items-center">
                <span className="mb-1">Zoya's Treasures!</span>
                <span className="text-sm bg-white/30 px-3 py-1 rounded-full">
                  {items.length} out of 50 treasures found
                </span>
              </h2>
            </div>
            
            {/* Filter buttons */}
            <div className="p-3 overflow-x-auto">
              <div className="flex space-x-2 py-1">
                <Badge 
                  className={`cursor-pointer ${!selectedType ? 'bg-purple-600' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
                  onClick={() => setSelectedType(null)}
                >
                  All
                </Badge>
                
                {itemTypes.map(type => (
                  <Badge 
                    key={type}
                    className={`cursor-pointer ${selectedType === type ? 'bg-purple-600' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Collection items carousel */}
            <div className="p-4 pt-2">
              {filteredItems.length > 0 ? (
                <Carousel className="w-full max-w-xs mx-auto">
                  <CarouselContent>
                    {filteredItems.map(item => (
                      <CarouselItem key={item.id}>
                        <Card className="p-4 flex flex-col items-center justify-center h-64 border-2 text-center overflow-hidden relative">
                          {/* Add background color based on rarity */}
                          <div className={`absolute inset-0 opacity-10 ${
                            item.rarity === 'rare' 
                              ? 'bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-200' 
                              : item.rarity === 'uncommon'
                              ? 'bg-gradient-to-br from-blue-300 to-teal-200'
                              : 'bg-gradient-to-br from-gray-200 to-gray-100'
                          }`}></div>
                          
                          {/* Emoji with animation */}
                          <div className="text-6xl mb-3 animate-bounce-slow">{item.emoji}</div>
                          
                          {/* Item name with larger font */}
                          <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                          
                          {/* Badges with more colorful variants */}
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <Badge variant={
                              item.rarity === 'rare' ? 'default' :
                              item.rarity === 'uncommon' ? 'secondary' : 'outline'
                            } className={
                              item.rarity === 'rare' ? 'bg-purple-600' :
                              item.rarity === 'uncommon' ? 'bg-blue-500' : ''
                            }>
                              {item.rarity}
                            </Badge>
                            <Badge variant="outline" className="bg-white/70">
                              ×{item.count}
                            </Badge>
                          </div>
                          
                          {/* Description */}
                          <p className="text-sm text-gray-600 mt-1 max-w-[200px]">{item.description}</p>
                          
                          {/* First collected info */}
                          <div className="text-xs text-gray-400 mt-2 absolute bottom-2">
                            First found: {new Date(item.firstCollectedAt).toLocaleDateString()}
                          </div>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center gap-2 mt-4">
                    <CarouselPrevious />
                    <CarouselNext />
                  </div>
                </Carousel>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  {items.length > 0 
                    ? "No items of this type in your collection yet" 
                    : "Your collection is empty"}
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 flex justify-center rounded-b-xl">
              <button 
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 font-bold text-lg shadow-md"
                onClick={onClose}
              >
                Done Looking!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}