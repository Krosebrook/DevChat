import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ModernNavigation } from '@/components/modern-navigation';
import { ModernSidebar } from '@/components/modern-sidebar';
import { ModernConfigWizard } from '@/components/modern-config-wizard';
import { ProgressModal } from '@/components/progress-modal';
import { 
  Zap, 
  Globe, 
  Smartphone, 
  Monitor, 
  ArrowRight, 
  Plus, 
  Star,
  TrendingUp,
  Users,
  Code,
  Play,
  Settings,
  ChevronRight,
  BarChart3,
  Shield,
  Activity,
  Layers,
  Sparkles,
  Rocket,
  Target,
  Clock
} from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { useConfigStore } from '@/stores/configStore';
import { websocketManager } from '@/lib/websocket';

export function ModernDashboard() {
  const { setProjects, updateGenerationTask } = useProjectStore();
  const { projectId } = useConfigStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch projects
  const { data: projects } = useQuery({
    queryKey: ['/api/projects'],
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (projects && Array.isArray(projects)) {
      setProjects(projects);
    }
  }, [projects, setProjects]);

  // WebSocket listeners
  useEffect(() => {
    const unsubscribeProgress = websocketManager.on('progress_update', (data) => {
      updateGenerationTask(data.taskId, {
        progress: data.progress,
        message: data.message,
      });
    });

    const unsubscribeCompleted = websocketManager.on('task_completed', (data) => {
      updateGenerationTask(data.taskId, {
        status: 'completed',
        progress: 100,
      });
    });

    const unsubscribeError = websocketManager.on('task_error', (data) => {
      updateGenerationTask(data.taskId, {
        status: 'error',
        message: data.error,
      });
    });

    const unsubscribeLog = websocketManager.on('log_update', (data) => {
      updateGenerationTask(data.taskId, {
        logs: data.log,
      });
    });

    return () => {
      unsubscribeProgress();
      unsubscribeCompleted();
      unsubscribeError();
      unsubscribeLog();
    };
  }, [updateGenerationTask]);

  const platforms = [
    {
      name: 'Web Application',
      description: 'Progressive web apps with modern frameworks',
      icon: <Globe className="w-6 h-6" />,
      gradient: 'from-blue-500 to-cyan-500',
      projects: 87,
      growth: '+23%'
    },
    {
      name: 'Mobile App',
      description: 'Native iOS and Android applications',
      icon: <Smartphone className="w-6 h-6" />,
      gradient: 'from-purple-500 to-pink-500',
      projects: 34,
      growth: '+45%'
    },
    {
      name: 'Desktop Software',
      description: 'Cross-platform desktop applications',
      icon: <Monitor className="w-6 h-6" />,
      gradient: 'from-green-500 to-emerald-500',
      projects: 16,
      growth: '+12%'
    }
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'E-commerce Platform',
      type: 'Web App',
      status: 'Deployed',
      updated: '2 hours ago',
      progress: 100,
      tech: ['React', 'Node.js', 'PostgreSQL']
    },
    {
      id: 2,
      name: 'Task Management App',
      type: 'Mobile',
      status: 'In Progress',
      updated: '5 hours ago',
      progress: 73,
      tech: ['Flutter', 'Firebase', 'Redux']
    },
    {
      id: 3,
      name: 'Analytics Dashboard',
      type: 'Web App',
      status: 'Testing',
      updated: '1 day ago',
      progress: 95,
      tech: ['Vue.js', 'Express', 'MongoDB']
    }
  ];

  const quickActions = [
    {
      title: 'Create New Project',
      description: 'Start building your next application',
      icon: <Plus className="w-5 h-5" />,
      color: 'bg-orange-500',
      action: 'create'
    },
    {
      title: 'Import Template',
      description: 'Use a pre-built template',
      icon: <Layers className="w-5 h-5" />,
      color: 'bg-blue-500',
      action: 'import'
    },
    {
      title: 'AI Assistant',
      description: 'Get help from our AI agents',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'bg-purple-500',
      action: 'assistant'
    },
    {
      title: 'Deploy Project',
      description: 'Deploy to production',
      icon: <Rocket className="w-5 h-5" />,
      color: 'bg-green-500',
      action: 'deploy'
    }
  ];

  const metrics = [
    {
      label: 'Total Projects',
      value: '127',
      change: '+12%',
      trend: 'up',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      label: 'Active Users',
      value: '2.4K',
      change: '+8%',
      trend: 'up',
      icon: <Users className="w-5 h-5" />
    },
    {
      label: 'Deployments',
      value: '43',
      change: '+15%',
      trend: 'up',
      icon: <Rocket className="w-5 h-5" />
    },
    {
      label: 'Success Rate',
      value: '98.5%',
      change: '+2%',
      trend: 'up',
      icon: <Target className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ModernSidebar />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-3xl p-8 text-white mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, Developer!
                  </h1>
                  <p className="text-orange-100 text-lg mb-6">
                    Build amazing applications across all platforms with AI-powered development
                  </p>
                  <div className="flex items-center space-x-4">
                    <button className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200 flex items-center space-x-2">
                      <Plus className="w-5 h-5" />
                      <span>New Project</span>
                    </button>
                    <button className="border-2 border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200 flex items-center space-x-2">
                      <Play className="w-5 h-5" />
                      <span>Watch Demo</span>
                    </button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Zap className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric) => (
                <div key={metric.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-orange-50 text-orange-600 p-3 rounded-xl">
                      {metric.icon}
                    </div>
                    <div className="text-green-600 text-sm font-semibold flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{metric.change}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Platform Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Choose Your Platform</h2>
                <button className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center space-x-1">
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {platforms.map((platform) => (
                  <div key={platform.name} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <div className={`w-12 h-12 bg-gradient-to-br ${platform.gradient} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      {platform.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{platform.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{platform.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold text-gray-900">{platform.projects}</span> projects
                      </div>
                      <div className="text-green-600 text-sm font-semibold">
                        {platform.growth}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuration Wizard */}
            <div className="mb-8">
              <ModernConfigWizard />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <button key={action.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-left group">
                    <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      {action.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
                <button className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center space-x-1">
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold">
                        {project.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">{project.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{project.type}</span>
                          <span>•</span>
                          <span>Updated {project.updated}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {project.tech.map((tech) => (
                            <span key={tech} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`text-sm font-semibold ${
                          project.status === 'Deployed' ? 'text-green-600' :
                          project.status === 'In Progress' ? 'text-blue-600' : 'text-yellow-600'
                        }`}>
                          {project.status}
                        </div>
                        <div className="text-sm text-gray-500">{project.progress}% complete</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors duration-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Components Preview */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl border border-purple-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Enhanced Components</h2>
                  <p className="text-gray-600">Professional UI components with advanced animations</p>
                </div>
                <a 
                  href="/figma-demo" 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Explore Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/40">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white mb-3">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Advanced Animations</h3>
                  <p className="text-sm text-gray-600">Smooth transitions and interactive effects</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/40">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white mb-3">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Glassmorphism Design</h3>
                  <p className="text-sm text-gray-600">Modern glass-like UI elements</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/40">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white mb-3">
                    <Code className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Premium Components</h3>
                  <p className="text-sm text-gray-600">Production-ready UI elements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Modal */}
      {projectId && <ProgressModal />}
    </div>
  );
}