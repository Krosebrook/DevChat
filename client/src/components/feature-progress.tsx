import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, Zap } from 'lucide-react';

interface FeatureStatus {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  progress: number;
  category: 'core' | 'advanced' | 'business' | 'security';
}

const currentFeatures: FeatureStatus[] = [
  // COMPLETED
  {
    id: 'real-gen',
    name: 'Real Code Generation',
    description: 'Fully functional generators for 7 frameworks with actual file output',
    status: 'completed',
    progress: 100,
    category: 'core'
  },
  {
    id: 'websocket',
    name: 'Real-Time Progress Tracking',
    description: 'WebSocket-powered live updates during project generation',
    status: 'completed',
    progress: 100,
    category: 'core'
  },
  {
    id: 'database',
    name: 'PostgreSQL Database Integration',
    description: 'Persistent project data with full CRUD operations',
    status: 'completed',
    progress: 100,
    category: 'core'
  },
  {
    id: 'project-nav',
    name: 'Project Navigation & Management',
    description: 'Complete project details pages with full management capabilities',
    status: 'completed',
    progress: 100,
    category: 'core'
  },
  {
    id: 'roadmap',
    name: 'Interactive Development Roadmap',
    description: 'Visual roadmap showing completed and planned features',
    status: 'completed',
    progress: 100,
    category: 'business'
  },
  
  // IN PROGRESS
  {
    id: 'error-recovery',
    name: 'Error Recovery & Resilience System',
    description: 'Automatic retry logic, rollback capabilities, and timeout handling',
    status: 'in-progress',
    progress: 75,
    category: 'advanced'
  },
  {
    id: 'code-quality',
    name: 'Advanced Code Quality Tools',
    description: 'ESLint, Prettier, TypeScript strict mode, and testing framework setup',
    status: 'in-progress',
    progress: 85,
    category: 'advanced'
  },

  // PLANNED
  {
    id: 'ai-enhancement',
    name: 'AI-Powered Code Enhancement',
    description: 'Code optimization suggestions and security vulnerability scanning',
    status: 'planned',
    progress: 0,
    category: 'advanced'
  },
  {
    id: 'collaboration',
    name: 'Real-Time Collaboration',
    description: 'Multi-user project editing with conflict resolution',
    status: 'planned',
    progress: 0,
    category: 'business'
  }
];

const statusIcons = {
  completed: CheckCircle,
  'in-progress': Clock,
  planned: AlertTriangle
};

const statusColors = {
  completed: 'text-green-500',
  'in-progress': 'text-blue-500',
  planned: 'text-slate-400'
};

const categoryColors = {
  core: 'bg-indigo-100 text-indigo-700',
  advanced: 'bg-purple-100 text-purple-700', 
  business: 'bg-green-100 text-green-700',
  security: 'bg-red-100 text-red-700'
};

export function FeatureProgress() {
  const completedCount = currentFeatures.filter(f => f.status === 'completed').length;
  const inProgressCount = currentFeatures.filter(f => f.status === 'in-progress').length;
  const overallProgress = Math.round(
    currentFeatures.reduce((sum, f) => sum + f.progress, 0) / currentFeatures.length
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-indigo-500" />
          <span>Active Development Progress</span>
          <Badge className="ml-auto bg-indigo-100 text-indigo-700">
            {overallProgress}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-slate-700">Overall Development</span>
              <span className="text-sm text-slate-500">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="w-full h-3" />
            <div className="flex justify-between text-sm text-slate-500 mt-2">
              <span>{completedCount} Completed</span>
              <span>{inProgressCount} In Progress</span>
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-3">
            {currentFeatures.map(feature => {
              const StatusIcon = statusIcons[feature.status];
              
              return (
                <div key={feature.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <StatusIcon className={`w-5 h-5 mt-0.5 ${statusColors[feature.status]}`} />
                      <div>
                        <h4 className="font-medium text-slate-900">{feature.name}</h4>
                        <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                      </div>
                    </div>
                    <Badge className={categoryColors[feature.category]}>
                      {feature.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Progress value={feature.progress} className="flex-1 h-2" />
                    <span className="text-sm font-medium text-slate-600 min-w-[3rem]">
                      {feature.progress}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 mb-3">Development Metrics</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <div className="text-sm text-slate-600">Features Complete</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
                <div className="text-sm text-slate-600">Features Active</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}