import * as React from "react";
import { cn } from "@/lib/utils";

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient" | "bordered" | "elevated";
  hover?: boolean;
  animation?: "none" | "slide" | "fade" | "scale";
}

function EnhancedCard({
  className,
  variant = "default",
  hover = true,
  animation = "scale",
  children,
  ...props
}: EnhancedCardProps) {
  const variants = {
    default: "bg-card text-card-foreground shadow-sm border",
    glass: "bg-card/60 backdrop-blur-md text-card-foreground shadow-lg border border-border/40",
    gradient: "bg-gradient-to-br from-card via-card/95 to-card/90 text-card-foreground shadow-lg border",
    bordered: "bg-card text-card-foreground border-2 border-border shadow-sm",
    elevated: "bg-card text-card-foreground shadow-xl border border-border/20",
  };

  const hoverClasses = hover ? {
    none: "",
    slide: "hover:-translate-y-1",
    fade: "hover:opacity-90",
    scale: "hover:scale-[1.02]",
  } : {
    none: "",
    slide: "",
    fade: "",
    scale: "",
  };

  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-xl p-6 transition-all duration-200",
        variants[variant],
        hoverClasses[animation],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function EnhancedCardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-2 pb-4", className)}
      {...props}
    />
  );
}

function EnhancedCardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function EnhancedCardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function EnhancedCardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-content"
      className={cn("space-y-4", className)}
      {...props}
    />
  );
}

function EnhancedCardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center pt-4", className)}
      {...props}
    />
  );
}

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardFooter,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
};