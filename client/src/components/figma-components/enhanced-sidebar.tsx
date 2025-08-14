import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Home,
  BarChart3,
  Wrench,
  Gamepad2,
  TrendingUp,
  Settings,
  Globe,
  Smartphone,
  Monitor,
  Code,
  Layers,
  Sparkles,
  Link,
  Rocket,
  User,
  Crown,
  Zap,
  ChevronDown,
  ChevronRight,
  Plus
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  requireAuth?: boolean;
  badge?: string;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, requireAuth: true, badge: '3' },
  { 
    id: 'projects', 
    label: 'Projects', 
    icon: Wrench, 
    requireAuth: true,
    children: [
      { id: 'all-projects', label: 'All Projects', icon: Layers },
      { id: 'favorites', label: 'Favorites', icon: Sparkles },
      { id: 'recent', label: 'Recent', icon: TrendingUp }
    ]
  },
  { 
    id: 'tools', 
    label: 'AI Tools', 
    icon: Gamepad2,
    children: [
      { id: 'web-tools', label: 'Web Apps', icon: Globe },
      { id: 'mobile-tools', label: 'Mobile Apps', icon: Smartphone },
      { id: 'desktop-tools', label: 'Desktop Apps', icon: Monitor },
      { id: 'code-gen', label: 'Code Generator', icon: Code }
    ]
  },
  { id: 'integrations', label: 'Integrations', icon: Link, requireAuth: true },
  { id: 'deployments', label: 'Deployments', icon: Rocket, requireAuth: true },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp, requireAuth: true },
  { id: 'settings', label: 'Settings', icon: Settings, requireAuth: true }
];

interface EnhancedSidebarProps {
  currentPage?: string;
  setCurrentPage?: (page: string) => void;
  isAuthenticated?: boolean;
  userStats?: {
    level: number;
    xp: number;
    xpToNext: number;
    credits: number;
    streak: number;
  };
}

export function EnhancedSidebar({ 
  currentPage = 'home', 
  setCurrentPage = () => {},
  isAuthenticated = false,
  userStats = { level: 7, xp: 2450, xpToNext: 550, credits: 150, streak: 5 }
}: EnhancedSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['projects']);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getProgressPercentage = () => {
    const total = userStats.xp + userStats.xpToNext;
    return (userStats.xp / total) * 100;
  };

  const renderNavigationItem = (item: NavigationItem, depth = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = currentPage === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isHovered = hoveredItem === item.id;

    if (item.requireAuth && !isAuthenticated) {
      return null;
    }

    return (
      <div key={item.id} className="space-y-1">
        <motion.div
          className={`relative group cursor-pointer`}
          onHoverStart={() => setHoveredItem(item.id)}
          onHoverEnd={() => setHoveredItem(null)}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              setCurrentPage(item.id);
            }
          }}
          whileHover={{ x: depth === 0 ? 4 : 2 }}
          transition={{ duration: 0.2 }}
        >
          <div 
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              ${depth > 0 ? 'ml-6 text-sm' : ''}
              ${isActive 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : isHovered
                ? 'bg-accent/50 text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
              }
            `}
          >
            <item.icon className={`${depth > 0 ? 'h-4 w-4' : 'h-5 w-5'} flex-shrink-0`} />
            <span className="flex-1 font-medium">{item.label}</span>
            
            {item.badge && (
              <Badge variant="secondary" className="h-5 text-xs px-1.5">
                {item.badge}
              </Badge>
            )}
            
            {hasChildren && (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            )}
          </div>

          {isActive && (
            <motion.div
              className="absolute left-0 top-0 w-1 h-full bg-primary rounded-r-full"
              layoutId="activeIndicator"
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-1"
            >
              {item.children?.map(child => renderNavigationItem(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg ff-text-gradient">FlashFusion</h1>
            <p className="text-xs text-muted-foreground">Universal App Builder</p>
          </div>
        </div>
      </div>

      {/* User Stats */}
      {isAuthenticated && (
        <motion.div 
          className="p-4 mx-4 mt-4 bg-gradient-to-r from-orange-500/10 to-cyan-500/10 rounded-xl border border-orange-500/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Level {userStats.level}</span>
                <Crown className="h-3 w-3 text-yellow-500" />
              </div>
              <p className="text-xs text-muted-foreground">Pro Developer</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>XP Progress</span>
              <span>{userStats.xp}/{userStats.xp + userStats.xpToNext}</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
          
          <div className="flex justify-between items-center mt-3 text-xs">
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span>{userStats.credits} credits</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🔥</span>
              <span>{userStats.streak} day streak</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Navigation
          </h3>
          <div className="space-y-1">
            {navigationItems.map(item => renderNavigationItem(item))}
          </div>
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Quick Actions
          </h3>
          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            FlashFusion v2.0
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by AI
          </p>
        </div>
      </div>
    </div>
  );
}