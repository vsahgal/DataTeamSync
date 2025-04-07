import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  label?: string;
  color?: string;
}

export const ProgressIndicator = React.forwardRef<HTMLDivElement, ProgressIndicatorProps>(
  ({ value, label, color, className, ...props }, ref) => {
    // value is expected to be 0-100
    const percentage = Math.max(0, Math.min(100, value));
    
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
          className="h-full transition-all duration-500 ease-in-out"
          style={{ 
            width: `${percentage}%`,
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
