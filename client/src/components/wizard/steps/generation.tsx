import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Check, Loader, Clock, ExternalLink } from 'lucide-react';
import { useConfigStore } from '@/stores/configStore';
import { useProjectStore } from '@/stores/projectStore';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function Generation() {
  const { 
    projectId, 
    setProjectId, 
    resetConfiguration, 
    setCurrentStep,
    projectScope,
    platformSelection,
    featureConfiguration 
  } = useConfigStore();
  const { currentProject, setCurrentProject, generationTasks, setGenerationTasks } = useProjectStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/projects', {
        name: projectScope?.name,
        description: projectScope?.description,
        platform: platformSelection?.platform,
        framework: platformSelection?.framework,
        features: featureConfiguration?.features || [],
        configuration: {
          projectScope,
          platformSelection,
          featureConfiguration,
        },
        status: 'draft',
      });
      return response.json();
    },
    onSuccess: (project) => {
      setCurrentProject(project);
      setProjectId(project.id);
    },
  });

  // Start generation mutation
  const startGenerationMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/generate`);
      return response.json();
    },
    onSuccess: (data) => {
      setGenerationTasks(data.tasks);
      setIsGenerating(true);
    },
  });

  // Fetch generation tasks
  const { data: tasks } = useQuery({
    queryKey: ['/api/projects', projectId, 'tasks'],
    enabled: !!projectId && isGenerating,
    refetchInterval: 1000, // Refetch every second during generation
  });

  useEffect(() => {
    if (tasks) {
      setGenerationTasks(tasks);
      
      // Check if all tasks are completed
      const allCompleted = tasks.every((task: any) => task.status === 'completed');
      if (allCompleted && isGenerating) {
        setIsGenerating(false);
      }
    }
  }, [tasks, setGenerationTasks, isGenerating]);

  useEffect(() => {
    // Auto-create project and start generation when entering this step
    if (!projectId && !createProjectMutation.isPending) {
      createProjectMutation.mutate();
    }
  }, [projectId, createProjectMutation]);

  useEffect(() => {
    // Start generation once project is created
    if (projectId && !isGenerating && !startGenerationMutation.isPending && generationTasks.length === 0) {
      startGenerationMutation.mutate(projectId);
    }
  }, [projectId, isGenerating, startGenerationMutation, generationTasks.length]);

  const goBack = () => {
    setCurrentStep(4);
  };

  const startNewProject = () => {
    resetConfiguration();
    setCurrentProject(null);
    setGenerationTasks([]);
    setIsGenerating(false);
  };

  const overallProgress = generationTasks.length > 0 
    ? Math.round(generationTasks.reduce((sum, task) => sum + (task.progress || 0), 0) / generationTasks.length)
    : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-white" />;
      case 'running':
        return <Loader className="w-4 h-4 text-white animate-spin" />;
      case 'error':
        return <span className="text-white text-xs">!</span>;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500';
      case 'running':
        return 'bg-indigo-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-slate-300';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'running':
        return 'bg-indigo-100 text-indigo-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const allCompleted = generationTasks.length > 0 && generationTasks.every(task => task.status === 'completed');

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          {allCompleted ? 'Generation Complete!' : 'Generating Your Application'}
        </h3>
        <p className="text-slate-600">
          {allCompleted 
            ? 'Your application has been successfully generated and is ready for deployment.'
            : 'Our AI agents are working together to create your application. This may take a few minutes.'
          }
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Overall Progress</CardTitle>
            <span className="text-sm text-slate-500">{overallProgress}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="w-full h-3" />
        </CardContent>
      </Card>

      {/* Agent Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Agent Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generationTasks.map((task) => (
              <div key={task.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                task.status === 'completed' ? 'border-emerald-200 bg-emerald-50' :
                task.status === 'running' ? 'border-indigo-200 bg-indigo-50' :
                task.status === 'error' ? 'border-red-200 bg-red-50' :
                'border-slate-200 bg-slate-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(task.status)}`}>
                    {getStatusIcon(task.status)}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{task.agentName}</div>
                    <div className="text-sm text-slate-500">{task.message}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {task.status === 'running' && (
                    <span className="text-sm font-medium text-indigo-600">{task.progress}%</span>
                  )}
                  <Badge className={getStatusBadgeColor(task.status)}>
                    {task.status === 'completed' ? 'Complete' :
                     task.status === 'running' ? 'Running' :
                     task.status === 'error' ? 'Error' : 'Queued'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Logs */}
      {isGenerating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Live Generation Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 rounded-lg p-4 h-32 overflow-y-auto text-sm font-mono">
              {generationTasks.map((task) => (
                task.logs?.map((log, index) => (
                  <div key={`${task.id}-${index}`} className="text-white mb-1">
                    {log}
                  </div>
                ))
              ))}
              {generationTasks.length === 0 && (
                <div className="text-slate-400">Initializing generation process...</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Actions */}
      {allCompleted && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Application Generated Successfully!</h4>
              <p className="text-slate-600 mb-6">
                Your {platformSelection?.framework} application is ready. You can now deploy it or continue customizing.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" className="flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>View Project</span>
                </Button>
                <Button 
                  onClick={startNewProject}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Create New Project
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {!allCompleted && (
        <div className="flex items-center justify-between">
          <Button 
            type="button"
            variant="ghost" 
            onClick={goBack}
            disabled={isGenerating}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Review</span>
          </Button>
          <div className="text-sm text-slate-500">
            Estimated time remaining: {isGenerating ? '2-3 minutes' : 'Starting...'}
          </div>
        </div>
      )}
    </div>
  );
}
