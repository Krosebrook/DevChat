import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Download, ExternalLink, Eye, Play, Settings, Share, Trash2, FileCode, Database, Shield, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjectStore } from '@/stores/projectStore';

export default function ProjectDetails() {
  const { id } = useParams();
  const { updateProject, removeProject } = useProjectStore();

  // Fetch project details
  const { data: project, isLoading } = useQuery({
    queryKey: ['/api/projects', id],
    enabled: !!id,
  });

  // Fetch generation tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ['/api/projects', id, 'tasks'],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h2>
          <p className="text-slate-600 mb-4">The project you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'generating': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'error': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const overallProgress = tasks.length > 0 
    ? Math.round(tasks.reduce((sum: number, task: any) => sum + (task.progress || 0), 0) / tasks.length)
    : 0;

  const handleAction = (action: string) => {
    switch (action) {
      case 'preview':
        console.log('Opening preview...');
        // In a real implementation, this would open a preview of the generated app
        break;
      case 'download':
        console.log('Starting download...');
        // This would trigger a download of the generated project files
        break;
      case 'deploy':
        console.log('Starting deployment...');
        // This would start the deployment process
        break;
      case 'share':
        console.log('Sharing project...');
        // This would open sharing options
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this project?')) {
          removeProject(project.id);
          window.history.back();
        }
        break;
      default:
        console.log(`Action: ${action}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">{project.name}</h1>
                <p className="text-sm text-slate-500">{project.framework} • {project.platform}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
              
              {project.status === 'completed' && (
                <>
                  <Button size="sm" onClick={() => handleAction('preview')}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" onClick={() => handleAction('download')}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" onClick={() => handleAction('deploy')}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Deploy
                  </Button>
                </>
              )}
              
              <Button size="sm" variant="outline" onClick={() => handleAction('share')}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              
              <Button size="sm" variant="outline" onClick={() => handleAction('delete')}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                    <p className="text-slate-600">{project.description || 'No description provided'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.features?.map((feature: string) => (
                        <Badge key={feature} variant="outline">
                          {feature}
                        </Badge>
                      )) || <span className="text-slate-500">No features selected</span>}
                    </div>
                  </div>
                </div>
                
                {project.status === 'generating' && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                      <span className="text-sm text-slate-500">{overallProgress}%</span>
                    </div>
                    <Progress value={overallProgress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generation Tasks */}
            {tasks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Generation Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks.map((task: any) => (
                      <div key={task.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-900">{task.agentName}</h4>
                          <div className="flex items-center space-x-2">
                            {task.status === 'completed' && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                            {task.status === 'running' && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                            {task.status === 'error' && (
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                            <span className="text-sm text-slate-500">{task.status}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{task.message}</p>
                        <Progress value={task.progress || 0} className="w-full" />
                        
                        {task.logs && task.logs.length > 0 && (
                          <details className="mt-2">
                            <summary className="text-sm text-slate-500 cursor-pointer">
                              View Logs ({task.logs.length})
                            </summary>
                            <div className="mt-2 bg-slate-50 rounded p-2 text-xs font-mono">
                              {task.logs.slice(-5).map((log: string, index: number) => (
                                <div key={index} className="text-slate-600">{log}</div>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Files */}
            {project.status === 'completed' && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="structure">
                    <TabsList>
                      <TabsTrigger value="structure">Project Structure</TabsTrigger>
                      <TabsTrigger value="features">Features</TabsTrigger>
                      <TabsTrigger value="config">Configuration</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="structure" className="mt-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <FileCode className="w-4 h-4 text-blue-500" />
                          <span>src/App.{project.framework === 'react' ? 'tsx' : project.framework === 'svelte' ? 'svelte' : 'ts'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <FileCode className="w-4 h-4 text-green-500" />
                          <span>package.json</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <FileCode className="w-4 h-4 text-yellow-500" />
                          <span>README.md</span>
                        </div>
                        {project.features?.includes('database') && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Database className="w-4 h-4 text-purple-500" />
                            <span>Database configuration</span>
                          </div>
                        )}
                        {project.features?.includes('authentication') && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Shield className="w-4 h-4 text-red-500" />
                            <span>Authentication system</span>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="features" className="mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        {project.features?.map((feature: string) => (
                          <div key={feature} className="border border-slate-200 rounded-lg p-3">
                            <h5 className="font-medium text-slate-900 capitalize">{feature}</h5>
                            <p className="text-sm text-slate-600">Fully implemented and configured</p>
                          </div>
                        )) || <p className="text-slate-500">No features implemented</p>}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="config" className="mt-4">
                      <div className="bg-slate-50 rounded-lg p-4">
                        <pre className="text-sm text-slate-700 overflow-x-auto">
{JSON.stringify({
  platform: project.platform,
  framework: project.framework,
  features: project.features,
  created: project.createdAt,
  status: project.status
}, null, 2)}
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => handleAction('settings')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Project Settings
                </Button>
                
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => handleAction('test')}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Run Tests
                </Button>
                
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => handleAction('regenerate')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Project Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Files Generated</span>
                    <span className="font-medium">
                      {tasks.find(t => t.metadata?.filesGenerated)?.metadata?.filesGenerated || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Framework</span>
                    <span className="font-medium capitalize">{project.framework}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Platform</span>
                    <span className="font-medium capitalize">{project.platform}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Created</span>
                    <span className="font-medium">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}