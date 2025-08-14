import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function EnhancedBreadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function EnhancedBreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className,
      )}
      {...props}
    />
  );
}

function EnhancedBreadcrumbItem({ className, children, ...props }: React.ComponentProps<"li">) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      {children}
    </motion.li>
  );
}

function EnhancedBreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Comp
        data-slot="breadcrumb-link"
        className={cn(
          "hover:text-foreground transition-all duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-ring/50 rounded-sm px-1",
          className
        )}
        {...props}
      />
    </motion.div>
  );
}

function EnhancedBreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        "text-foreground font-medium px-1 py-0.5 bg-accent/50 rounded-sm",
        className
      )}
      {...props}
    />
  );
}

function EnhancedBreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5 opacity-50", className)}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {children ?? <ChevronRight />}
      </motion.div>
    </li>
  );
}

function EnhancedBreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex size-9 items-center justify-center hover:bg-accent/50 rounded-md transition-colors duration-200",
        className
      )}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  EnhancedBreadcrumb,
  EnhancedBreadcrumbList,
  EnhancedBreadcrumbItem,
  EnhancedBreadcrumbLink,
  EnhancedBreadcrumbPage,
  EnhancedBreadcrumbSeparator,
  EnhancedBreadcrumbEllipsis,
};