import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EnhancedProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  variant?: "default" | "gradient" | "striped" | "glow";
  size?: "sm" | "default" | "lg";
  showValue?: boolean;
  animated?: boolean;
}

const EnhancedProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  EnhancedProgressProps
>(({ 
  className, 
  value = 0, 
  variant = "default", 
  size = "default", 
  showValue = false,
  animated = true,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-primary",
    gradient: "bg-gradient-to-r from-primary via-secondary to-accent",
    striped: "bg-primary bg-striped",
    glow: "bg-primary shadow-[0_0_10px_currentColor]",
  };

  const sizes = {
    sm: "h-2",
    default: "h-3",
    lg: "h-4",
  };

  return (
    <div className="relative">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-full bg-secondary/20 backdrop-blur-sm",
          sizes[size],
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-out",
            variants[variant],
            animated && "animate-pulse"
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
          asChild
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: `${-(100 - (value || 0))}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-foreground/90">
            {Math.round(value || 0)}%
          </span>
        </div>
      )}
    </div>
  );
});

EnhancedProgress.displayName = "EnhancedProgress";

export { EnhancedProgress };