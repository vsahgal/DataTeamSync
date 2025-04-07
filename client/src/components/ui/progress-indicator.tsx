import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  label?: string;
  color?: string;
  animated?: boolean;
}

export const ProgressIndicator = React.forwardRef<HTMLDivElement, ProgressIndicatorProps>(
  ({ value, label, color, animated = false, className, ...props }, ref) => {
    // value is expected to be 0-100
    const percentage = Math.max(0, Math.min(100, value));
    
    // Use state to track the displayed percentage for smoother animations
    const [displayedPercentage, setDisplayedPercentage] = React.useState(0);
    const [isInitialized, setIsInitialized] = React.useState(false);
    
    // Set initial value on first render
    React.useEffect(() => {
      if (!isInitialized) {
        setDisplayedPercentage(animated ? 0 : percentage);
        setIsInitialized(true);
      }
    }, [isInitialized, percentage, animated]);
    
    // Update the displayed percentage with animation when value changes or animated flag is true
    React.useEffect(() => {
      if (!isInitialized) return;
      
      if (animated) {
        // When animated is true, we do a slow smooth animation from 0 to the target
        setDisplayedPercentage(0); // Reset first
        
        // Use a timeout to allow the reset to render before animating up
        const resetTimeout = setTimeout(() => {
          const animationDuration = 1800; // 1.8 seconds total animation
          const steps = 40; // Number of steps in animation
          const stepDuration = animationDuration / steps;
          const incrementPerStep = percentage / steps;
          
          let currentStep = 0;
          
          const intervalId = setInterval(() => {
            currentStep++;
            
            if (currentStep >= steps) {
              setDisplayedPercentage(percentage);
              clearInterval(intervalId);
            } else {
              setDisplayedPercentage(prev => Math.min(percentage, prev + incrementPerStep));
            }
          }, stepDuration);
          
          return () => clearInterval(intervalId);
        }, 10);
        
        return () => clearTimeout(resetTimeout);
      } else {
        // Normal case - update immediately with CSS transition
        setDisplayedPercentage(percentage);
      }
    }, [percentage, animated, isInitialized]);
    
    return (
      <div 
        ref={ref} 
        className={cn(
          "w-full h-4 bg-gray-100 rounded-full overflow-hidden relative",
          className
        )} 
        {...props}
      >
        <div 
          className={cn(
            "h-full", 
            animated ? "transition-none" : "transition-all duration-500 ease-out"
          )}
          style={{ 
            width: `${displayedPercentage}%`,
            backgroundColor: color || "#4EA0EA"
          }}
        />
        
        {label && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-white drop-shadow-sm">
              {label}
            </span>
          </div>
        )}
      </div>
    );
  }
);

ProgressIndicator.displayName = "ProgressIndicator";
