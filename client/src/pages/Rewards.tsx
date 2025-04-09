import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { getShowerSessions, getCollectedLoot, resetAllUserData } from "@/lib/storage";
import { LocalShowerSession } from "@shared/schema";
import { CollectedItem } from "@/lib/lootItems";
import { Droplet, CheckCircle, CalendarClock, ChevronRight, Star, X, RefreshCw } from "lucide-react";
import { lootItems } from "@/lib/lootItems";
import { useToast } from "@/hooks/use-toast";

export default function Rewards() {
  const [sessions, setSessions] = useState<LocalShowerSession[]>([]);
  const [collectedItems, setCollectedItems] = useState<CollectedItem[]>([]);
  const [viewingItem, setViewingItem] = useState<CollectedItem | null>(null);
  const [treasureStats, setTreasureStats] = useState({
    totalCollected: 0,
    uniqueItems: 0,
    totalAvailable: lootItems.length
  });
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Get shower stats (total showers and showers per week)
  const calculateShowersPerWeek = (sessions: LocalShowerSession[]): number => {
    if (sessions.length === 0) return 0;
    
    // Sort sessions by date
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    // If we have less than 7 days of data, we calculate based on available data
    const firstShowerDate = new Date(sortedSessions[0].createdAt);
    const today = new Date();
    const daysSinceFirstShower = Math.ceil((today.getTime() - firstShowerDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate weeks (minimum 1 to avoid division by zero)
    const weeks = Math.max(1, daysSinceFirstShower / 7);
    
    return parseFloat((sessions.length / weeks).toFixed(1));
  };
  
  useEffect(() => {
    const showerSessions = getShowerSessions();
    setSessions(showerSessions);
    
    const items = getCollectedLoot();
    setCollectedItems(items);
    
    // Calculate treasure statistics
    const uniqueItemCount = items.length;
    const totalItemCount = items.reduce((total, item) => total + item.count, 0);
    
    setTreasureStats({
      totalCollected: totalItemCount,
      uniqueItems: uniqueItemCount,
      totalAvailable: lootItems.length
    });
  }, []);

  // Calculate showers per week
  const showersPerWeek = calculateShowersPerWeek(sessions);
  
  // Function to handle data reset
  const handleReset = () => {
    // Reset all user data in storage
    resetAllUserData();
    
    // Update UI state
    setSessions(getShowerSessions());
    setCollectedItems(getCollectedLoot());
    setTreasureStats({
      totalCollected: 0,
      uniqueItems: 0,
      totalAvailable: lootItems.length
    });
    
    // Close dialog
    setIsResetDialogOpen(false);
    
    // Show confirmation
    toast({
      title: "Data Reset Complete",
      description: "All shower data and treasures have been reset.",
      variant: "default",
    });
    
    // Reload the page to ensure everything is refreshed
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };
  
  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-5 shadow-lg">
        <div className="flex items-center mb-3">
          <Star className="w-7 h-7 mr-3" />
          <h1 className="text-2xl font-bold">Zoya's Collection</h1>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white bg-opacity-20 rounded-xl p-3">
            <div className="flex items-center mb-1">
              <Droplet className="w-4 h-4 mr-1" />
              <p className="text-sm opacity-90">Total Showers</p>
            </div>
            <p className="text-2xl font-bold">{sessions.length}</p>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-xl p-3">
            <div className="flex items-center mb-1">
              <CalendarClock className="w-4 h-4 mr-1" />
              <p className="text-sm opacity-90">Weekly Average</p>
            </div>
            <p className="text-2xl font-bold">{showersPerWeek} showers</p>
          </div>
        </div>
      </div>
      
      {/* Treasures Statistics */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-3 text-purple-800">Treasures Collected</h2>
          
          <div className="flex justify-between mb-3">
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Items</p>
              <p className="text-xl font-bold text-purple-700">{treasureStats.totalCollected}</p>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">Unique Items</p>
              <p className="text-xl font-bold text-purple-700">{treasureStats.uniqueItems}</p>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">Completion</p>
              <p className="text-xl font-bold text-purple-700">
                {Math.round((treasureStats.uniqueItems / treasureStats.totalAvailable) * 100)}%
              </p>
            </div>
          </div>
          
          <div className="bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full" 
              style={{ width: `${(treasureStats.uniqueItems / treasureStats.totalAvailable) * 100}%` }}
            />
          </div>
          
          <p className="text-xs text-center text-gray-500">
            {treasureStats.uniqueItems} of {treasureStats.totalAvailable} treasures found
          </p>
        </CardContent>
      </Card>
      
      {/* Items Grid */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-purple-800">My Treasures</h2>
            <span className="text-xs text-gray-500">Tap for details</span>
          </div>
          
          {collectedItems.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Complete showers to earn treasures!</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {collectedItems.map((item) => (
                <div 
                  key={item.id}
                  className="relative bg-gray-50 rounded-lg p-3 flex flex-col items-center hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => setViewingItem(item)}
                >
                  <div className="text-4xl mb-1">{item.emoji}</div>
                  <div className="absolute top-1 right-1 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {item.count}
                  </div>
                  <p className="text-[10px] text-center text-gray-600 truncate w-full">{item.name}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Showers */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-3 text-purple-800">Recent Showers</h2>
          
          {sessions.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-gray-500">No showers recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.slice(0, 5).reverse().map((session) => (
                <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(session.createdAt).toLocaleDateString(undefined, { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        Duration: {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
              
              {sessions.length > 5 && (
                <div className="text-center pt-2">
                  <p className="text-sm text-purple-600 font-medium">
                    + {sessions.length - 5} more showers
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Data Button */}
      <div className="mt-4 mb-2 flex justify-center">
        <Button 
          variant="outline" 
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 flex items-center gap-2"
          onClick={() => setIsResetDialogOpen(true)}
        >
          <RefreshCw className="h-4 w-4" />
          Reset All Data
        </Button>
      </div>
    
      {/* Item Detail Dialog */}
      <Dialog open={viewingItem !== null} onOpenChange={(open) => !open && setViewingItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          {viewingItem && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="text-5xl">{viewingItem.emoji}</div>
                  <div>
                    <DialogTitle className="text-xl font-bold text-purple-800">{viewingItem.name}</DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        {viewingItem.rarity.charAt(0).toUpperCase() + viewingItem.rarity.slice(1)}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {viewingItem.type.charAt(0).toUpperCase() + viewingItem.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <DialogDescription className="text-gray-700">
                  {viewingItem.description}
                </DialogDescription>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">You have</p>
                      <p className="text-xl font-bold text-purple-700">{viewingItem.count} {viewingItem.count === 1 ? 'item' : 'items'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">First found</p>
                      <p className="text-sm font-medium">
                        {new Date(viewingItem.firstCollectedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={() => setViewingItem(null)}
                  className="w-full"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Reset All Data?</DialogTitle>
            <DialogDescription>
              This will delete all shower history, levels, and treasures. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4 pb-2">
            <p className="text-sm text-gray-600 mb-4">
              Zoya will start fresh with no shower history or treasures.
            </p>
          </div>
          <DialogFooter className="flex sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsResetDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleReset}
            >
              Yes, Reset Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
