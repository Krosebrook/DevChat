import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Zap, 
  Shield, 
  Users, 
  Palette,
  Database,
  Cloud,
  Smartphone,
  Bot,
  BarChart
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  category: 'production' | 'development' | 'business' | 'experience' | 'security';
  status: 'completed' | 'in-progress' | 'planned';
  priority: 'critical' | 'high' | 'medium' | 'low';
  icon: any;
  progress?: number;
}

const features: Feature[] = [
  // COMPLETED FEATURES
  {
    id: 'real-code-gen',
    title: 'Real Code Generation Engine',
    description: 'Fully functional generators for 7 frameworks with actual file output',
    category: 'production',
    status: 'completed',
    priority: 'critical',
    icon: CheckCircle,
    progress: 100
  },
  {
    id: 'websocket-tracking',
    title: 'Real-Time Progress Tracking',
    description: 'WebSocket-powered live updates during project generation',
    category: 'production', 
    status: 'completed',
    priority: 'critical',
    icon: CheckCircle,
    progress: 100
  },
  {
    id: 'database-integration',
    title: 'PostgreSQL Database Storage',
    description: 'Persistent project data with full CRUD operations',
    category: 'production',
    status: 'completed',
    priority: 'critical',
    icon: CheckCircle,
    progress: 100
  },

  // IN PROGRESS
  {
    id: 'error-recovery',
    title: 'Error Recovery & Resilience',
    description: 'Automatic retry logic and rollback capabilities for failed generations',
    category: 'production',
    status: 'in-progress',
    priority: 'critical',
    icon: Shield,
    progress: 25
  },
  {
    id: 'code-quality',
    title: 'Advanced Code Quality Tools',
    description: 'ESLint, Prettier, TypeScript strict mode, and testing framework setup',
    category: 'development',
    status: 'in-progress', 
    priority: 'high',
    icon: Zap,
    progress: 40
  },

  // PLANNED CRITICAL FEATURES
  {
    id: 'collaboration',
    title: 'Real-Time Collaboration',
    description: 'Multi-user project editing with conflict resolution and live cursors',
    category: 'business',
    status: 'planned',
    priority: 'critical',
    icon: Users,
    progress: 0
  },
  {
    id: 'ai-enhancement',
    title: 'AI-Powered Code Enhancement',
    description: 'Code optimization suggestions and security vulnerability scanning',
    category: 'development',
    status: 'planned',
    priority: 'critical',
    icon: Bot,
    progress: 0
  },
  {
    id: 'advanced-deployment',
    title: 'Advanced Deployment Pipeline',
    description: 'Multi-environment support with CI/CD pipeline generation',
    category: 'production',
    status: 'planned',
    priority: 'high',
    icon: Cloud,
    progress: 0
  },
  {
    id: 'project-templates',
    title: 'Project Templates & Starters',
    description: 'Pre-built templates for common use cases and industry-specific starters',
    category: 'experience',
    status: 'planned',
    priority: 'high',
    icon: Palette,
    progress: 0
  },
  {
    id: 'performance-monitoring',
    title: 'Performance Monitoring',
    description: 'Real-time app performance tracking and bundle size analysis',
    category: 'development',
    status: 'planned',
    priority: 'high',
    icon: BarChart,
    progress: 0
  },
  
  // MORE PLANNED FEATURES
  {
    id: 'auth-systems',
    title: 'Advanced Authentication Systems',
    description: 'OAuth providers, MFA, and role-based access control generation',
    category: 'security',
    status: 'planned',
    priority: 'high',
    icon: Shield,
    progress: 0
  },
  {
    id: 'database-tools',
    title: 'Database Management Tools',
    description: 'Visual database designer and migration management',
    category: 'development',
    status: 'planned',
    priority: 'medium',
    icon: Database,
    progress: 0
  },
  {
    id: 'mobile-optimization',
    title: 'Mobile App Generation Enhancement',
    description: 'React Native and Flutter optimization with native modules',
    category: 'development',
    status: 'planned',
    priority: 'medium',
    icon: Smartphone,
    progress: 0
  }
];

const categoryColors = {
  production: 'bg-red-100 text-red-700 border-red-200',
  development: 'bg-blue-100 text-blue-700 border-blue-200',
  business: 'bg-green-100 text-green-700 border-green-200',
  experience: 'bg-purple-100 text-purple-700 border-purple-200',
  security: 'bg-orange-100 text-orange-700 border-orange-200'
};

const priorityColors = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500'
};

const statusIcons = {
  completed: CheckCircle,
  'in-progress': Clock,
  planned: AlertCircle
};

export function FeatureRoadmap() {
  const completedFeatures = features.filter(f => f.status === 'completed');
  const inProgressFeatures = features.filter(f => f.status === 'in-progress');
  const plannedFeatures = features.filter(f => f.status === 'planned');

  const overallProgress = Math.round(
    (completedFeatures.length * 100 + inProgressFeatures.reduce((sum, f) => sum + (f.progress || 0), 0)) 
    / features.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            FlashFusion Development Roadmap
            <Badge className="bg-indigo-100 text-indigo-700">
              {overallProgress}% Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={overallProgress} className="w-full" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedFeatures.length}</div>
                <div className="text-sm text-slate-600">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{inProgressFeatures.length}</div>
                <div className="text-sm text-slate-600">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-600">{plannedFeatures.length}</div>
                <div className="text-sm text-slate-600">Planned</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed Features */}
      {completedFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Completed Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {completedFeatures.map((feature) => {
                const StatusIcon = statusIcons[feature.status];
                const FeatureIcon = feature.icon;
                
                return (
                  <div key={feature.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FeatureIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{feature.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={categoryColors[feature.category]}>
                              {feature.category}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${priorityColors[feature.priority]}`} />
                              <span className="text-xs text-slate-500 capitalize">{feature.priority}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <StatusIcon className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* In Progress Features */}
      {inProgressFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>In Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {inProgressFeatures.map((feature) => {
                const StatusIcon = statusIcons[feature.status];
                const FeatureIcon = feature.icon;
                
                return (
                  <div key={feature.id} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FeatureIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{feature.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={categoryColors[feature.category]}>
                              {feature.category}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${priorityColors[feature.priority]}`} />
                              <span className="text-xs text-slate-500 capitalize">{feature.priority}</span>
                            </div>
                          </div>
                          {feature.progress !== undefined && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-500">Progress</span>
                                <span className="text-xs text-slate-500">{feature.progress}%</span>
                              </div>
                              <Progress value={feature.progress} className="w-full h-2" />
                            </div>
                          )}
                        </div>
                      </div>
                      <StatusIcon className="w-5 h-5 text-blue-500 animate-pulse" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Planned Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-slate-500" />
            <span>Planned Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {plannedFeatures.map((feature) => {
              const StatusIcon = statusIcons[feature.status];
              const FeatureIcon = feature.icon;
              
              return (
                <div key={feature.id} className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <FeatureIcon className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{feature.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={categoryColors[feature.category]}>
                            {feature.category}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${priorityColors[feature.priority]}`} />
                            <span className="text-xs text-slate-500 capitalize">{feature.priority}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => console.log(`Requesting ${feature.title}`)}>
                        Request
                      </Button>
                      <StatusIcon className="w-5 h-5 text-slate-500" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}