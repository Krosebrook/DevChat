import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { ExternalLink, Play, Globe, Smartphone, Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'web':
      return Globe;
    case 'mobile':
      return Smartphone;
    case 'desktop':
      return Monitor;
    default:
      return Globe;
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'web':
      return 'from-blue-500 to-cyan-500';
    case 'mobile':
      return 'from-purple-500 to-pink-500';
    case 'desktop':
      return 'from-emerald-500 to-teal-500';
    default:
      return 'from-blue-500 to-cyan-500';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-100 text-emerald-700';
    case 'generating':
      return 'bg-amber-100 text-amber-700';
    case 'draft':
      return 'bg-slate-100 text-slate-700';
    case 'error':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const getProgressForStatus = (status: string) => {
  switch (status) {
    case 'completed':
      return 100;
    case 'generating':
      return 75; // This would be real progress in actual implementation
    case 'draft':
      return 25;
    case 'error':
      return 0;
    default:
      return 0;
  }
};

export function RecentProjects() {
  const [, setLocation] = useLocation();
  const { data: projects = [] } = useQuery({
    queryKey: ['/api/projects'],
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Projects</CardTitle>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-slate-500 mb-2">No projects yet</div>
            <div className="text-sm text-slate-400">
              Complete the configuration wizard above to create your first project
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project: any) => {
              const PlatformIcon = getPlatformIcon(project.platform);
              const platformColor = getPlatformColor(project.platform);
              const statusColor = getStatusColor(project.status);
              const progress = getProgressForStatus(project.status);
              
              return (
                <div 
                  key={project.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer"
                  onClick={() => setLocation(`/project/${project.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 bg-gradient-to-r ${platformColor} rounded-lg flex items-center justify-center`}>
                      <PlatformIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{project.name}</h4>
                      <p className="text-sm text-slate-500">
                        {project.framework} • Created {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {project.status === 'generating' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-500">{progress}%</span>
                      </div>
                    )}
                    <Badge className={statusColor}>
                      {project.status === 'completed' ? 'Deployed' :
                       project.status === 'generating' ? 'In Progress' :
                       project.status === 'draft' ? 'Draft' :
                       project.status === 'error' ? 'Error' : 'Unknown'}
                    </Badge>
                    {project.status === 'completed' ? (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Opening external preview...');
                          // Would open deployed URL in real implementation
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    ) : project.status === 'generating' ? (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/project/${project.id}`);
                        }}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/project/${project.id}`);
                        }}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
