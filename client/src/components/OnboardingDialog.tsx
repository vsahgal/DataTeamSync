import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setChildName, completeOnboarding, isOnboardingCompleted } from "@/lib/storage";

interface OnboardingDialogProps {
  onComplete?: () => void;
  forceOpen?: boolean;
}

export default function OnboardingDialog({ onComplete, forceOpen = false }: OnboardingDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if onboarding is completed
    const onboardingCompleted = isOnboardingCompleted();
    
    // If not completed or forceOpen is true, show the dialog
    if (!onboardingCompleted || forceOpen) {
      setOpen(true);
    }
  }, [forceOpen]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }
    
    // Save the child's name
    setChildName(name.trim());
    
    // Mark onboarding as completed
    completeOnboarding();
    
    // Close the dialog
    setOpen(false);
    
    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-indigo-50 to-blue-100 border-2 border-indigo-200 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-700 text-center">Welcome!</DialogTitle>
          <p className="text-center text-gray-600 mt-2">Let's set up the app for your child</p>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="text-center">
            <span className="text-lg text-indigo-600">Let's personalize this app!</span>
          </div>
          <div className="mt-2">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              What's your child's name?
            </label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter name here"
              className="border-2 border-indigo-200 focus:border-indigo-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            {error && (
              <span className="text-sm text-red-500 mt-1 block">{error}</span>
            )}
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm text-gray-600">
              This name will be used throughout the app.
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Let's Start!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}