export type PageType = 'home' | 'projects' | 'tools' | 'dashboard' | 'analytics' | 'settings' | 'generator' | 'wizard' | 'tool-detail' | 'integrations' | 'deployments';

export interface UserStats {
  level: number;
  xp: number;
  xpToNext: number;
  totalProjects: number;
  totalImages: number;
  totalCode: number;
  credits: number;
  badges: Badge[];
  dailyTasksCompleted: number;
  streak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  earnedAt?: Date;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  type: 'generate' | 'platform' | 'validate' | 'remix';
}

export interface Tool {
  name: string;
  icon: any;
  description: string;
  color: string;
  category: string;
  page?: string;
}

export interface ExtendedTool {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  category: string;
  page?: string;
  premium?: boolean;
  popular?: boolean;
  new?: boolean;
  buildOptions?: ToolOption[];
  integrations?: ToolOption[];
  deploymentTargets?: ToolOption[];
  features?: string[];
  pricing?: {
    free: boolean;
    credits: number;
    proOnly?: boolean;
  };
}

export interface ToolOption {
  id: string;
  name: string;
  description: string;
  icon?: any;
  premium?: boolean;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  tools: ExtendedTool[];
}

export interface Project {
  name: string;
  description: string;
  updated: string;
  image: string;
  status: string;
  framework: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  apps: number;
  downloads: number;
  level: number;
  avatar: string;
}

export interface PageConfig {
  title: string;
  breadcrumb: string[];
}

export interface FeatureCard {
  title: string;
  description: string;
  icon: any;
  examples: string;
  color: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  color: string;
  status: 'connected' | 'available' | 'premium';
  features: string[];
  setupRequired?: boolean;
}

export interface Deployment {
  id: string;
  name: string;
  description: string;
  platform: string;
  icon: any;
  color: string;
  status: 'deployed' | 'available' | 'failed';
  url?: string;
  lastDeployed?: Date;
  autoDeployEnabled?: boolean;
}

export interface GenerationConfig {
  projectName: string;
  description: string;
  framework: string;
  language: string;
  features: string[];
  buildOptions: string[];
  integrations: string[];
  deploymentTargets: string[];
  complexity: 'simple' | 'medium' | 'complex';
}