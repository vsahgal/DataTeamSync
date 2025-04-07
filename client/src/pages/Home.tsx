import { useEffect, useState } from "react";
import ShowerTimer from "@/components/ShowerTimer";
import CharacterDisplay from "@/components/CharacterDisplay";
import WaterAnimation from "@/components/WaterAnimation";
import LevelDisplay from "@/components/LevelDisplay";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useShowerState from "@/hooks/useShowerState";
import { getShowerStats } from "@/lib/storage";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { Droplets, Zap, Award, BarChart } from "lucide-react";
import { ShowerStats } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const { 
    isShowering, 
    elapsedTime, 
    points, 
    startShower, 
    stopShower, 
    isWaterOn
  } = useShowerState();
  
  const [stats, setStats] = useState<ShowerStats>({
    totalSessions: 0,
    totalPoints: 0,
    longestShower: 0,
    streakDays: 0,
    lastShowerDate: null,
    level: 1,
    lastLevelUp: null
  });
  
  useEffect(() => {
    setStats(getShowerStats());
  }, [isShowering]);
  
  const handleStart = () => {
    startShower();
    toast({
      title: "Shower started!",
      description: "Let's get clean and earn 10 points!",
      variant: "default",
    });
  };
  
  const handleStop = () => {
    const earnedPoints = stopShower();
    toast({
      title: "Shower completed!",
      description: `Great job! You earned ${earnedPoints} points.`,
      variant: "default",
    });
  };
  
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden border-4 border-blue-300 bg-white">
        <CardContent className="p-0 relative">
          <div className="p-6 flex flex-col items-center justify-center relative z-10">
            <div className="flex justify-between items-center w-full mb-4">
              <h1 className="text-3xl font-bold text-blue-600">
                Zoya's Shower Time
              </h1>
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                Level {stats.level || 1}
              </div>
            </div>
            
            <CharacterDisplay isShowering={isShowering} points={points} />
            
            {isShowering && (
              <div className="w-full relative">
                <WaterAnimation isWaterOn={isWaterOn} />
              </div>
            )}
            
            <ShowerTimer
              elapsedTime={elapsedTime}
              isActive={isShowering}
            />
            
            <div className="flex items-center justify-center my-4">
              <div className="text-center bg-indigo-100 p-3 rounded-lg w-40">
                <p className="text-xs text-indigo-600 font-medium">Total Points</p>
                <p className="text-2xl font-bold text-indigo-700">{stats.totalPoints}</p>
                {isShowering && (
                  <div className="mt-1 text-xs text-green-600">+10 points when done</div>
                )}
              </div>
            </div>
            
            {!isShowering ? (
              <Button 
                onClick={handleStart} 
                className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 mb-2 rounded-full text-xl"
              >
                Start Shower
              </Button>
            ) : (
              <Button 
                onClick={handleStop} 
                className="w-full h-16 bg-red-500 hover:bg-red-600 mb-2 rounded-full text-xl"
              >
                Stop Shower
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Level Display */}
      <LevelDisplay stats={stats} />

      <Card className="overflow-hidden border-2 border-indigo-200">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4 text-indigo-700">Your Progress</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Droplets className="text-blue-600 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Showers</p>
                <p className="font-medium">{stats.totalSessions}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 p-2 rounded-full">
                <Award className="text-purple-600 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Streak</p>
                <p className="font-medium">{stats.streakDays} days</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Zap className="text-yellow-600 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Points</p>
                <p className="font-medium">{stats.totalPoints}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 p-2 rounded-full">
                <BarChart className="text-emerald-600 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Longest</p>
                <p className="font-medium">{Math.floor(stats.longestShower / 60)}:{(stats.longestShower % 60).toString().padStart(2, '0')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
