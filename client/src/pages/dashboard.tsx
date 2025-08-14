import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/navigation';
import { Sidebar } from '@/components/sidebar';
import { ConfigWizard } from '@/components/wizard/config-wizard';
import { RecentProjects } from '@/components/recent-projects';
import { FeatureRoadmap } from '@/components/feature-roadmap';
import { FeatureProgress } from '@/components/feature-progress';
import { ProgressModal } from '@/components/progress-modal';
import { FigmaEnhancedSection } from '@/components/figma-components/figma-enhanced-section';
import { useProjectStore } from '@/stores/projectStore';
import { useConfigStore } from '@/stores/configStore';
import { websocketManager } from '@/lib/websocket';

export default function Dashboard() {
  const { setProjects, updateGenerationTask } = useProjectStore();
  const { projectId } = useConfigStore();

  // Fetch projects
  const { data: projects } = useQuery({
    queryKey: ['/api/projects'],
    refetchInterval: 10000, // Refetch every 10 seconds
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <Sidebar />
          </div>
          
          <div className="lg:col-span-9">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Universal App Generator
              </h1>
              <p className="text-lg text-slate-600">
                Create production-ready applications across all platforms with AI-powered development
              </p>
            </div>

            {/* Configuration Wizard */}
            <ConfigWizard />

            {/* Figma Enhanced Section */}
            <div className="mt-8">
              <FigmaEnhancedSection />
            </div>

            {/* Recent Projects */}
            <div className="mt-8">
              <RecentProjects />
            </div>

            {/* Feature Progress */}
            <div className="mt-8">
              <FeatureProgress />
            </div>

            {/* Feature Roadmap */}
            <div className="mt-8">
              <FeatureRoadmap />
            </div>

            {/* Enhanced Components Preview Section */}
            <div className="mt-8">
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">FlashFusion Enhanced Components</h2>
                    <p className="text-sm text-gray-600">Comprehensive design system with advanced animations and premium styling</p>
                  </div>
                  <a 
                    href="/figma-demo" 
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 text-sm font-medium"
                  >
                    View Full Demo →
                  </a>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-900 mb-2">✨ Advanced Animations</h3>
                    <p className="text-sm text-blue-700">Smooth framer-motion animations with hover effects and transitions</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <h3 className="font-medium text-purple-900 mb-2">🎨 Glassmorphism Effects</h3>
                    <p className="text-sm text-purple-700">Modern glass-like styling with backdrop blur and transparency</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-medium text-green-900 mb-2">🔧 Premium Components</h3>
                    <p className="text-sm text-green-700">Enhanced cards, buttons, inputs, and interactive elements</p>
                  </div>
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
