import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  EnhancedCard, 
  EnhancedCardHeader, 
  EnhancedCardTitle, 
  EnhancedCardDescription, 
  EnhancedCardContent 
} from './enhanced-card';
import { EnhancedButton } from './enhanced-button';
import { EnhancedBadge } from './enhanced-badge';
import { EnhancedInput } from './enhanced-input';
import { 
  EnhancedAccordion, 
  EnhancedAccordionItem, 
  EnhancedAccordionTrigger, 
  EnhancedAccordionContent 
} from './enhanced-accordion';
import {
  EnhancedDropdownMenu,
  EnhancedDropdownMenuTrigger,
  EnhancedDropdownMenuContent,
  EnhancedDropdownMenuItem,
  EnhancedDropdownMenuSeparator,
  EnhancedDropdownMenuLabel,
} from './enhanced-dropdown-menu';
import {
  EnhancedDialog,
  EnhancedDialogTrigger,
  EnhancedDialogContent,
  EnhancedDialogHeader,
  EnhancedDialogTitle,
  EnhancedDialogDescription,
  EnhancedDialogFooter,
} from './enhanced-dialog';
import { 
  Sparkles, 
  Code, 
  Layers, 
  Globe, 
  Smartphone, 
  Monitor,
  Settings,
  MoreHorizontal,
  Search,
  Star,
  Heart,
  Zap
} from 'lucide-react';

export function FigmaDemoSection() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const cardVariants = [
    { id: 'default', variant: 'default' as const, title: 'Default Card', description: 'Standard card styling' },
    { id: 'glass', variant: 'glass' as const, title: 'Glass Card', description: 'Glassmorphism effect with backdrop blur' },
    { id: 'gradient', variant: 'gradient' as const, title: 'Gradient Card', description: 'Beautiful gradient background' },
    { id: 'bordered', variant: 'bordered' as const, title: 'Bordered Card', description: 'Emphasized border styling' },
    { id: 'elevated', variant: 'elevated' as const, title: 'Elevated Card', description: 'Enhanced shadow elevation' },
  ];

  const buttonVariants = [
    { variant: 'default' as const, label: 'Default' },
    { variant: 'premium' as const, label: 'Premium' },
    { variant: 'success' as const, label: 'Success' },
    { variant: 'outline' as const, label: 'Outline' },
    { variant: 'ghost' as const, label: 'Ghost' },
  ];

  const badgeVariants = [
    { variant: 'default' as const, label: 'Default', icon: <Star className="w-3 h-3" /> },
    { variant: 'premium' as const, label: 'Premium', icon: <Sparkles className="w-3 h-3" /> },
    { variant: 'success' as const, label: 'Success', icon: <Heart className="w-3 h-3" /> },
    { variant: 'warning' as const, label: 'Warning', icon: <Zap className="w-3 h-3" /> },
    { variant: 'glass' as const, label: 'Glass', icon: <Layers className="w-3 h-3" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Figma Enhanced Components
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the comprehensive FlashFusion design system with enhanced UI components featuring 
            advanced animations, glassmorphism effects, and premium styling options.
          </p>
        </motion.div>

        {/* Interactive Cards Grid */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-center">Enhanced Card Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {cardVariants.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <EnhancedCard
                  variant={card.variant}
                  hover={true}
                  animation="scale"
                  className={`cursor-pointer h-40 ${selectedCard === card.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
                >
                  <EnhancedCardHeader className="pb-2">
                    <EnhancedCardTitle className="text-lg">{card.title}</EnhancedCardTitle>
                    <EnhancedCardDescription className="text-sm">
                      {card.description}
                    </EnhancedCardDescription>
                  </EnhancedCardHeader>
                  <EnhancedCardContent>
                    <div className="flex justify-center">
                      <Globe className="w-8 h-8 text-primary" />
                    </div>
                  </EnhancedCardContent>
                </EnhancedCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enhanced Buttons Showcase */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-center">Enhanced Button Collection</h2>
          <EnhancedCard variant="glass" className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {buttonVariants.map((btn, index) => (
                <motion.div
                  key={btn.variant}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <EnhancedButton
                    variant={btn.variant}
                    size="lg"
                    className="w-full"
                    icon={<Sparkles className="w-4 h-4" />}
                  >
                    {btn.label}
                  </EnhancedButton>
                </motion.div>
              ))}
            </div>
          </EnhancedCard>
        </section>

        {/* Enhanced Badges Display */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-center">Enhanced Badge Variants</h2>
          <EnhancedCard variant="bordered" className="p-8">
            <div className="flex flex-wrap justify-center gap-4">
              {badgeVariants.map((badge, index) => (
                <motion.div
                  key={badge.variant}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <EnhancedBadge
                    variant={badge.variant}
                    size="lg"
                    icon={badge.icon}
                    closable={true}
                    onClose={() => console.log(`Closed ${badge.label} badge`)}
                  >
                    {badge.label}
                  </EnhancedBadge>
                </motion.div>
              ))}
            </div>
          </EnhancedCard>
        </section>

        {/* Enhanced Input Fields */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-center">Enhanced Input Components</h2>
          <EnhancedCard variant="elevated" className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <EnhancedInput
                  variant="glass"
                  placeholder="Glass variant with icon"
                  icon={<Search className="w-4 h-4" />}
                />
                <EnhancedInput
                  variant="outline"
                  placeholder="Outline variant"
                  success={true}
                />
                <EnhancedInput
                  variant="filled"
                  placeholder="Filled variant"
                  icon={<Settings className="w-4 h-4" />}
                  iconPosition="right"
                />
              </div>
              <div className="space-y-4">
                <EnhancedInput
                  variant="default"
                  placeholder="Default variant"
                  inputSize="lg"
                />
                <EnhancedInput
                  variant="glass"
                  placeholder="Error state"
                  error={true}
                />
                <EnhancedInput
                  variant="outline"
                  placeholder="Small size"
                  inputSize="sm"
                />
              </div>
            </div>
          </EnhancedCard>
        </section>

        {/* Interactive Components */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-center">Interactive Components</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Enhanced Accordion */}
            <EnhancedCard variant="glass" className="p-6">
              <EnhancedCardHeader>
                <EnhancedCardTitle>Enhanced Accordion</EnhancedCardTitle>
                <EnhancedCardDescription>
                  Interactive accordion with smooth animations
                </EnhancedCardDescription>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <EnhancedAccordion type="single" collapsible>
                  <EnhancedAccordionItem value="features">
                    <EnhancedAccordionTrigger>✨ Premium Features</EnhancedAccordionTrigger>
                    <EnhancedAccordionContent>
                      Advanced animations, glassmorphism effects, and premium styling options 
                      that enhance user experience and visual appeal.
                    </EnhancedAccordionContent>
                  </EnhancedAccordionItem>
                  <EnhancedAccordionItem value="customization">
                    <EnhancedAccordionTrigger>🎨 Customization</EnhancedAccordionTrigger>
                    <EnhancedAccordionContent>
                      Highly customizable components with multiple variants, sizes, and 
                      animation options to match your design requirements.
                    </EnhancedAccordionContent>
                  </EnhancedAccordionItem>
                  <EnhancedAccordionItem value="performance">
                    <EnhancedAccordionTrigger>⚡ Performance</EnhancedAccordionTrigger>
                    <EnhancedAccordionContent>
                      Optimized for performance with efficient animations and lightweight 
                      implementations that don't compromise on visual quality.
                    </EnhancedAccordionContent>
                  </EnhancedAccordionItem>
                </EnhancedAccordion>
              </EnhancedCardContent>
            </EnhancedCard>

            {/* Enhanced Dropdown Menu & Dialog */}
            <EnhancedCard variant="gradient" className="p-6">
              <EnhancedCardHeader>
                <EnhancedCardTitle>Interactive Controls</EnhancedCardTitle>
                <EnhancedCardDescription>
                  Enhanced dropdown menus and dialogs with smooth animations
                </EnhancedCardDescription>
              </EnhancedCardHeader>
              <EnhancedCardContent className="space-y-4">
                <EnhancedDropdownMenu>
                  <EnhancedDropdownMenuTrigger asChild>
                    <EnhancedButton variant="outline" className="w-full">
                      <MoreHorizontal className="w-4 h-4 mr-2" />
                      Enhanced Dropdown
                    </EnhancedButton>
                  </EnhancedDropdownMenuTrigger>
                  <EnhancedDropdownMenuContent>
                    <EnhancedDropdownMenuLabel>Actions</EnhancedDropdownMenuLabel>
                    <EnhancedDropdownMenuItem>
                      <Code className="w-4 h-4 mr-2" />
                      Edit Project
                    </EnhancedDropdownMenuItem>
                    <EnhancedDropdownMenuItem>
                      <Layers className="w-4 h-4 mr-2" />
                      Duplicate
                    </EnhancedDropdownMenuItem>
                    <EnhancedDropdownMenuSeparator />
                    <EnhancedDropdownMenuItem variant="destructive">
                      Delete Project
                    </EnhancedDropdownMenuItem>
                  </EnhancedDropdownMenuContent>
                </EnhancedDropdownMenu>

                <EnhancedDialog>
                  <EnhancedDialogTrigger asChild>
                    <EnhancedButton variant="premium" className="w-full">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Open Enhanced Dialog
                    </EnhancedButton>
                  </EnhancedDialogTrigger>
                  <EnhancedDialogContent>
                    <EnhancedDialogHeader>
                      <EnhancedDialogTitle>Enhanced Dialog</EnhancedDialogTitle>
                      <EnhancedDialogDescription>
                        This dialog showcases the enhanced styling with glassmorphism effects 
                        and smooth animations.
                      </EnhancedDialogDescription>
                    </EnhancedDialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground">
                        The enhanced dialog component features backdrop blur, smooth entrance 
                        animations, and premium styling that integrates seamlessly with the 
                        FlashFusion design system.
                      </p>
                    </div>
                    <EnhancedDialogFooter>
                      <EnhancedButton variant="outline">Cancel</EnhancedButton>
                      <EnhancedButton variant="premium">Continue</EnhancedButton>
                    </EnhancedDialogFooter>
                  </EnhancedDialogContent>
                </EnhancedDialog>
              </EnhancedCardContent>
            </EnhancedCard>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-center">Component Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "Advanced Animations",
                description: "Smooth framer-motion animations with hover effects and transitions"
              },
              {
                icon: <Layers className="w-8 h-8" />,
                title: "Glassmorphism Effects",
                description: "Modern glass-like styling with backdrop blur and transparency"
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: "Type Safety",
                description: "Full TypeScript support with comprehensive prop interfaces"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
              >
                <EnhancedCard variant="glass" hover={true} animation="slide" className="h-full">
                  <EnhancedCardContent className="pt-6 text-center space-y-4">
                    <div className="text-primary">{feature.icon}</div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </EnhancedCardContent>
                </EnhancedCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">
            🚀 FlashFusion Enhanced Component Library - Built with React, TypeScript, and Framer Motion
          </p>
        </motion.div>
      </div>
    </div>
  );
}