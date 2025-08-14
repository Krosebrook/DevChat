"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function EnhancedTabs({
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />;
}

function EnhancedTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-xl bg-muted/30 backdrop-blur-sm p-1 text-muted-foreground border border-border/40",
        className
      )}
      {...props}
    />
  );
}

function EnhancedTabsTrigger({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      value={value}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md relative overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
      <TabsPrimitive.Trigger
        value={value}
        className="absolute inset-0 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/5 data-[state=active]:to-secondary/5"
        asChild
      >
        <motion.div
          layoutId="activeTab"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      </TabsPrimitive.Trigger>
    </TabsPrimitive.Trigger>
  );
}

function EnhancedTabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <TabsPrimitive.Content
        data-slot="tabs-content"
        className={cn(
          "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      />
    </motion.div>
  );
}

export { EnhancedTabs, EnhancedTabsList, EnhancedTabsTrigger, EnhancedTabsContent };