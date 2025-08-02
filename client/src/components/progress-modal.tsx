import { useEffect, useState } from 'react';
import { X, Check, Loader, Clock } from 'lucide-react';
import { useConfigStore } from '@/stores/configStore';
import { useProjectStore } from '@/stores/projectStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function ProgressModal() {
  const { projectId, currentStep } = useConfigStore();
  const { generationTasks } = useProjectStore();
  const [isOpen, setIsOpen] = useState(false);

  // Show modal when in generation step and project is being generated
  useEffect(() => {
    setIsOpen(currentStep === 5 && !!projectId);
  }, [currentStep, projectId]);

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Complete';
      case 'running':
        return 'Running';
      case 'error':
        return 'Error';
      default:
        return 'Queued';
    }
  };

  const isGenerating = generationTasks.some(task => task.status === 'running' || task.status === 'queued');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Generating Your Application</DialogTitle>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-500">Live Updates</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-900">Overall Progress</span>
              <span className="text-sm text-slate-500">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="w-full h-3" />
          </div>

          {/* Agent Status */}
          <div className="space-y-4">
            {generationTasks.map((task) => (
              <div 
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  task.status === 'completed' ? 'border-emerald-200 bg-emerald-50' :
                  task.status === 'running' ? 'border-indigo-200 bg-indigo-50' :
                  task.status === 'error' ? 'border-red-200 bg-red-50' :
                  'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(task.status)}`}>
                    {getStatusIcon(task.status)}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{task.agentName}</div>
                    <div className="text-sm text-slate-500">{task.message}</div>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  task.status === 'completed' ? 'text-emerald-600' :
                  task.status === 'running' ? 'text-indigo-600' :
                  task.status === 'error' ? 'text-red-600' :
                  'text-slate-500'
                }`}>
                  {task.status === 'running' ? `${task.progress}%` : getStatusText(task.status)}
                </span>
              </div>
            ))}
          </div>

          {/* Live Logs */}
          <div>
            <h4 className="text-sm font-medium text-slate-900 mb-3">Live Generation Logs</h4>
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
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm text-slate-500">
            Estimated time remaining: {isGenerating ? '2-3 minutes' : 'Complete'}
          </span>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            {isGenerating ? 'Run in Background' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
