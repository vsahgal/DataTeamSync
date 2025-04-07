import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RewardItem from "@/components/RewardItem";
import { getRewards } from "@/lib/storage";
import { LocalReward } from "@shared/schema";
import { Trophy, Filter } from "lucide-react";
import { getShowerStats } from "@/lib/storage";

export default function Rewards() {
  const [rewards, setRewards] = useState<LocalReward[]>([]);
  const [stats, setStats] = useState({
    totalPoints: 0,
    totalSessions: 0,
    level: 1
  });
  
  useEffect(() => {
    setRewards(getRewards());
    const userStats = getShowerStats();
    setStats({
      totalPoints: userStats.totalPoints,
      totalSessions: userStats.totalSessions,
      level: userStats.level || 1
    });
  }, []);
  
  const unlockedRewards = rewards.filter(reward => reward.unlocked);
  const lockedRewards = rewards.filter(reward => !reward.unlocked);
  
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 mr-3" />
            <h1 className="text-2xl font-bold">Zoya's Rewards</h1>
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm font-bold mb-1">
              Level {stats.level}
            </div>
            <p className="text-xl font-bold">{stats.totalPoints} Points</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="bg-white bg-opacity-20 rounded-xl p-3">
            <p className="text-sm opacity-80">Unlocked</p>
            <p className="text-2xl font-bold">{unlockedRewards.length}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-3">
            <p className="text-sm opacity-80">Locked</p>
            <p className="text-2xl font-bold">{lockedRewards.length}</p>
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
                <TabsTrigger value="locked">Locked</TabsTrigger>
              </TabsList>
              
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100">
                <Filter className="w-5 h-5" />
              </button>
            </div>
            
            <TabsContent value="all" className="space-y-3 mt-2">
              {rewards.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Complete showers to earn rewards!</p>
                </div>
              ) : (
                rewards.map(reward => (
                  <RewardItem key={reward.id} reward={reward} />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="unlocked" className="space-y-3 mt-2">
              {unlockedRewards.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">You haven't unlocked any rewards yet.</p>
                  <p className="text-gray-500">Take more showers to earn rewards!</p>
                </div>
              ) : (
                unlockedRewards.map(reward => (
                  <RewardItem key={reward.id} reward={reward} />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="locked" className="space-y-3 mt-2">
              {lockedRewards.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">You've unlocked all rewards!</p>
                </div>
              ) : (
                lockedRewards.map(reward => (
                  <RewardItem key={reward.id} reward={reward} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
