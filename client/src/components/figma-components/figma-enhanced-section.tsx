import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Code, 
  Layers, 
  Globe, 
  Smartphone, 
  Monitor,
  TrendingUp,
  Zap,
  Star,
  ArrowRight
} from 'lucide-react';

export function FigmaEnhancedSection() {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      description: "Advanced AI creates complete applications from simple descriptions",
      color: "from-orange-500 to-pink-500",
      stats: "99.8% accuracy"
    },
    {
      icon: Code,
      title: "Multi-Platform Support",
      description: "Generate apps for web, mobile, and desktop simultaneously",
      color: "from-blue-500 to-cyan-500",
      stats: "15+ platforms"
    },
    {
      icon: Layers,
      title: "Production Ready",
      description: "Complete with authentication, databases, and deployment configs",
      color: "from-green-500 to-emerald-500",
      stats: "Zero setup time"
    }
  ];

  const platforms = [
    { icon: Globe, name: "Web Apps", desc: "React, Next.js, Vue", active: animationStep === 0 },
    { icon: Smartphone, name: "Mobile Apps", desc: "React Native, Flutter", active: animationStep === 1 },
    { icon: Monitor, name: "Desktop Apps", desc: "Electron, Tauri", active: animationStep === 2 }
  ];

  const stats = [
    { label: "Apps Generated", value: "25,847", growth: "+12%" },
    { label: "Active Users", value: "8,924", growth: "+18%" },
    { label: "Success Rate", value: "99.2%", growth: "+0.3%" }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-cyan-500/10 rounded-full border border-orange-500/20">
          <Sparkles className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium text-orange-500">Now with Enhanced AI</span>
        </div>
        
        <h2 className="text-4xl font-bold ff-text-gradient">
          Next-Generation App Builder
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create production-ready applications across all platforms with our enhanced AI-powered development suite
        </p>
      </motion.div>

      {/* Platform Animation */}
      <motion.div 
        className="bg-card/50 rounded-2xl p-8 border border-border/50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              className={`p-6 rounded-xl border transition-all duration-500 ${
                platform.active 
                  ? 'bg-primary/10 border-primary/50 scale-105' 
                  : 'bg-card border-border/50 hover:border-primary/30'
              }`}
              animate={{
                scale: platform.active ? 1.05 : 1,
                backgroundColor: platform.active ? 'rgba(255, 123, 0, 0.1)' : 'rgba(30, 41, 59, 0.5)'
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-full ${platform.active ? 'bg-primary text-white' : 'bg-muted'}`}>
                  <platform.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{platform.name}</h3>
                  <p className="text-sm text-muted-foreground">{platform.desc}</p>
                </div>
                {platform.active && (
                  <motion.div 
                    className="w-full h-1 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3 }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ff-stagger-fade">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
          >
            <Card className="ff-card-interactive h-full">
              <CardHeader className="space-y-4">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white w-fit`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="mt-2">{feature.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Performance</span>
                  <Badge variant="secondary" className="ff-pulse-glow">
                    {feature.stats}
                  </Badge>
                </div>
                <Progress value={85 + index * 5} className="h-2" />
                <Button className="w-full ff-btn-primary group">
                  Explore Feature
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <motion.div 
        className="bg-gradient-to-r from-orange-500/10 to-cyan-500/10 rounded-2xl p-8 border border-orange-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">Trusted by Developers Worldwide</h3>
          <p className="text-muted-foreground">Join thousands of developers building the future</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="text-center space-y-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
            >
              <div className="text-3xl font-bold ff-text-gradient">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">{stat.growth}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="text-center space-y-6 p-8 bg-card/30 rounded-2xl border border-border/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Ready to Build Something Amazing?</h3>
          <p className="text-muted-foreground">Start creating your next application with enhanced AI assistance</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="ff-btn-primary group">
            <Zap className="mr-2 h-4 w-4" />
            Start Building Now
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10">
            <Star className="mr-2 h-4 w-4" />
            View Examples
          </Button>
        </div>
      </motion.div>
    </div>
  );
}