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
          </div>
        </div>
      </div>

      {/* Progress Modal */}
      {projectId && <ProgressModal />}
    </div>
  );
}
