"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EnhancedSwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  variant?: "default" | "gradient" | "success" | "warning";
  size?: "sm" | "default" | "lg";
  label?: string;
  description?: string;
}

const EnhancedSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  EnhancedSwitchProps
>(({ 
  className, 
  variant = "default", 
  size = "default", 
  label,
  description,
  ...props 
}, ref) => {
  const variants = {
    default: "data-[state=checked]:bg-primary",
    gradient: "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-secondary",
    success: "data-[state=checked]:bg-green-500",
    warning: "data-[state=checked]:bg-yellow-500",
  };

  const sizes = {
    sm: {
      root: "h-5 w-9",
      thumb: "size-4 data-[state=checked]:translate-x-4",
    },
    default: {
      root: "h-6 w-11",
      thumb: "size-5 data-[state=checked]:translate-x-5",
    },
    lg: {
      root: "h-7 w-14",
      thumb: "size-6 data-[state=checked]:translate-x-7",
    },
  };

  const switchElement = (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-input data-[state=checked]:bg-primary",
        sizes[size].root,
        variants[variant],
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0",
          sizes[size].thumb
        )}
        asChild
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );

  if (label || description) {
    return (
      <div className="flex items-start space-x-3">
        {switchElement}
        <div className="space-y-1">
          {label && (
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }

  return switchElement;
});

EnhancedSwitch.displayName = "EnhancedSwitch";

export { EnhancedSwitch };