import { LocalReward } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Lock, Check, Star, Droplet, Shirt, Palette } from "lucide-react";

interface RewardItemProps {
  reward: LocalReward;
}

export default function RewardItem({ reward }: RewardItemProps) {
  const renderIcon = () => {
    switch (reward.type) {
      case "character":
        return <Star className="h-6 w-6 text-yellow-500" />;
      case "background":
        return <Palette className="h-6 w-6 text-purple-500" />;
      case "accessory":
        return <Shirt className="h-6 w-6 text-green-500" />;
      default:
        return <Droplet className="h-6 w-6 text-blue-500" />;
    }
  };
  
  return (
    <Card className={`flex items-center p-4 border-2 ${reward.unlocked ? 'border-green-200' : 'border-gray-200'}`}>
      <div className={`rounded-lg p-3 mr-4 ${
        reward.unlocked 
          ? 'bg-green-100' 
          : 'bg-gray-100'
      }`}>
        {renderIcon()}
      </div>
      
      <div className="flex-grow">
        <div className="flex items-center">
          <h3 className="font-bold">{reward.name}</h3>
          {reward.unlocked && (
            <div className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
              <Check className="h-3 w-3 mr-1" />
              Unlocked
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600">{reward.description}</p>
        {reward.unlockedAt && (
          <p className="text-xs text-gray-500 mt-1">
            Unlocked on {new Date(reward.unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>
      
      {!reward.unlocked && (
        <div className="ml-2 text-gray-400">
          <Lock className="h-5 w-5" />
        </div>
      )}
    </Card>
  );
}
