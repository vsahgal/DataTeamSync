import { Clock } from "lucide-react";

interface ShowerTimerProps {
  elapsedTime: number;
  isActive: boolean;
}

export default function ShowerTimer({ elapsedTime, isActive }: ShowerTimerProps) {
  // Convert seconds to minutes and seconds
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  
  // Format time as MM:SS
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  return (
    <div className={`flex items-center justify-center p-3 rounded-xl ${isActive ? 'bg-blue-100 animate-pulse' : 'bg-gray-100'} w-full mb-4`}>
      <Clock className={`h-6 w-6 mr-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
      <div className="text-center">
        <p className="text-xs font-medium mb-1 text-gray-600">Shower Time</p>
        <p className={`text-3xl font-bold ${isActive ? 'text-blue-700' : 'text-gray-700'} font-mono`}>
          {formattedTime}
        </p>
      </div>
    </div>
  );
}
