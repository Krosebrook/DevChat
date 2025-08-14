import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "glass" | "outline" | "filled";
  inputSize?: "sm" | "default" | "lg";
  error?: boolean;
  success?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    className, 
    type = "text", 
    variant = "default", 
    inputSize = "default", 
    error = false, 
    success = false,
    icon,
    iconPosition = "left",
    ...props 
  }, ref) => {
    const variants = {
      default: "bg-background border-input",
      glass: "bg-background/50 backdrop-blur-md border-border/40",
      outline: "bg-transparent border-2 border-border",
      filled: "bg-muted border-transparent",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      default: "h-10 px-3 text-sm",
      lg: "h-12 px-4 text-base",
    };

    const states = {
      error: "border-destructive focus:ring-destructive/20",
      success: "border-green-500 focus:ring-green-500/20",
      default: "focus:ring-ring/20",
    };

    const currentState = error ? "error" : success ? "success" : "default";

    const inputElement = (
      <motion.input
        type={type}
        className={cn(
          "flex w-full rounded-lg border transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[inputSize],
          states[currentState],
          icon && iconPosition === "left" && "pl-10",
          icon && iconPosition === "right" && "pr-10",
          className
        )}
        ref={ref}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      />
    );

    if (icon) {
      return (
        <div className="relative">
          {inputElement}
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2 text-muted-foreground",
            iconPosition === "left" ? "left-3" : "right-3"
          )}>
            {icon}
          </div>
        </div>
      );
    }

    return inputElement;
  }
);

EnhancedInput.displayName = "EnhancedInput";

export { EnhancedInput };