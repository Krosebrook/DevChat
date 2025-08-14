import { useState } from 'react';
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
  Sparkles, 
  Code, 
  Layers, 
  Globe, 
  Search,
  Star,
  Heart,
  Zap
} from 'lucide-react';

export function SimpleFigmaDemo() {
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
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Figma Enhanced Components
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the comprehensive FlashFusion design system with enhanced UI components featuring 
            advanced styling, glassmorphism effects, and premium design options.
          </p>
        </div>

        {/* Interactive Cards Grid */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-center">Enhanced Card Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {cardVariants.map((card) => (
              <div key={card.id}>
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
              </div>
            ))}
          </div>
        </section>

        {/* Enhanced Buttons Showcase */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-center">Enhanced Button Collection</h2>
          <EnhancedCard variant="glass" className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {buttonVariants.map((btn) => (
                <div key={btn.variant}>
                  <EnhancedButton
                    variant={btn.variant}
                    size="lg"
                    className="w-full"
                    icon={<Sparkles className="w-4 h-4" />}
                  >
                    {btn.label}
                  </EnhancedButton>
                </div>
              ))}
            </div>
          </EnhancedCard>
        </section>

        {/* Enhanced Badges Display */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-center">Enhanced Badge Variants</h2>
          <EnhancedCard variant="bordered" className="p-8">
            <div className="flex flex-wrap justify-center gap-4">
              {badgeVariants.map((badge) => (
                <div key={badge.variant}>
                  <EnhancedBadge
                    variant={badge.variant}
                    size="lg"
                    icon={badge.icon}
                    closable={true}
                    onClose={() => console.log(`Closed ${badge.label} badge`)}
                  >
                    {badge.label}
                  </EnhancedBadge>
                </div>
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

        {/* Interactive Accordion */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-center">Interactive Components</h2>
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
                    Advanced styling, glassmorphism effects, and premium design options 
                    that enhance user experience and visual appeal.
                  </EnhancedAccordionContent>
                </EnhancedAccordionItem>
                <EnhancedAccordionItem value="customization">
                  <EnhancedAccordionTrigger>🎨 Customization</EnhancedAccordionTrigger>
                  <EnhancedAccordionContent>
                    Highly customizable components with multiple variants, sizes, and 
                    styling options to match your design requirements.
                  </EnhancedAccordionContent>
                </EnhancedAccordionItem>
                <EnhancedAccordionItem value="performance">
                  <EnhancedAccordionTrigger>⚡ Performance</EnhancedAccordionTrigger>
                  <EnhancedAccordionContent>
                    Optimized for performance with efficient CSS transitions and lightweight 
                    implementations that don't compromise on visual quality.
                  </EnhancedAccordionContent>
                </EnhancedAccordionItem>
              </EnhancedAccordion>
            </EnhancedCardContent>
          </EnhancedCard>
        </section>

        {/* Feature Highlights */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-center">Component Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "Enhanced Styling",
                description: "Premium design variants with hover effects and smooth transitions"
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
            ].map((feature) => (
              <div key={feature.title}>
                <EnhancedCard variant="glass" hover={true} animation="slide" className="h-full">
                  <EnhancedCardContent className="pt-6 text-center space-y-4">
                    <div className="text-primary">{feature.icon}</div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </EnhancedCardContent>
                </EnhancedCard>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            🚀 FlashFusion Enhanced Component Library - Built with React, TypeScript, and modern CSS
          </p>
        </div>
      </div>
    </div>
  );
}