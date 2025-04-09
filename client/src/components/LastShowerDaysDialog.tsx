import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { setLastShowerDays, getChildName } from "@/lib/storage";

interface LastShowerDaysDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export default function LastShowerDaysDialog({ 
  open, 
  onOpenChange, 
  onComplete 
}: LastShowerDaysDialogProps) {
  const [selectedDays, setSelectedDays] = useState<string>("0");
  const childName = getChildName();

  const handleSubmit = () => {
    // Convert to number and save
    const days = parseInt(selectedDays, 10);
    setLastShowerDays(days);
    
    // Close the dialog
    onOpenChange(false);
    
    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-700 text-center">
            One more question...
          </DialogTitle>
          <p className="text-center text-blue-600 mt-2">
            When was {childName}'s last shower or bath?
          </p>
        </DialogHeader>
        <div className="flex flex-col gap-5 py-4">
          <RadioGroup 
            value={selectedDays} 
            onValueChange={setSelectedDays}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 bg-white/50 p-3 rounded-lg hover:bg-white/70 transition-colors">
              <RadioGroupItem value="0" id="option-0" />
              <Label htmlFor="option-0" className="font-medium">Today</Label>
            </div>
            <div className="flex items-center space-x-2 bg-white/50 p-3 rounded-lg hover:bg-white/70 transition-colors">
              <RadioGroupItem value="1" id="option-1" />
              <Label htmlFor="option-1" className="font-medium">Yesterday</Label>
            </div>
            <div className="flex items-center space-x-2 bg-white/50 p-3 rounded-lg hover:bg-white/70 transition-colors">
              <RadioGroupItem value="2" id="option-2" />
              <Label htmlFor="option-2" className="font-medium">2 days ago</Label>
            </div>
            <div className="flex items-center space-x-2 bg-white/50 p-3 rounded-lg hover:bg-white/70 transition-colors">
              <RadioGroupItem value="3" id="option-3" />
              <Label htmlFor="option-3" className="font-medium">3 days ago</Label>
            </div>
            <div className="flex items-center space-x-2 bg-white/50 p-3 rounded-lg hover:bg-white/70 transition-colors">
              <RadioGroupItem value="4" id="option-4" />
              <Label htmlFor="option-4" className="font-medium">4 days ago</Label>
            </div>
            <div className="flex items-center space-x-2 bg-white/50 p-3 rounded-lg hover:bg-white/70 transition-colors">
              <RadioGroupItem value="5" id="option-5" />
              <Label htmlFor="option-5" className="font-medium">5 days ago</Label>
            </div>
            <div className="flex items-center space-x-2 bg-white/50 p-3 rounded-lg hover:bg-white/70 transition-colors">
              <RadioGroupItem value="6" id="option-6" />
              <Label htmlFor="option-6" className="font-medium">6 days ago</Label>
            </div>
            <div className="flex items-center space-x-2 bg-white/50 p-3 rounded-lg hover:bg-white/70 transition-colors">
              <RadioGroupItem value="7" id="option-7" />
              <Label htmlFor="option-7" className="font-medium">A week ago or more</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}