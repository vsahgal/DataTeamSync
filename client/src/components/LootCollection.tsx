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
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-500">
              <h2 className="text-xl font-bold text-white text-center">
                Your Collection <span className="text-sm">({items.length}/{50})</span>
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
                        <Card className="p-4 flex flex-col items-center justify-center h-64 border-2 text-center">
                          <div className="text-5xl mb-3">{item.emoji}</div>
                          <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <Badge variant={
                              item.rarity === 'rare' ? 'default' :
                              item.rarity === 'uncommon' ? 'secondary' : 'outline'
                            }>
                              {item.rarity}
                            </Badge>
                            <Badge variant="outline">
                              ×{item.count}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 max-w-[200px]">{item.description}</p>
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
            
            <div className="p-4 bg-gray-100 flex justify-center">
              <button 
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 font-medium"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}