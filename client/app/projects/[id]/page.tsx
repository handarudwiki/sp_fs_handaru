'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProject, useExportProject } from '@/hooks/useProjects';
import { AuthGuard } from '@/components/common/AuthGuard';
import KanbanBoard from '@/components/projects/KanbanBoard';
import { toast } from 'sonner';
import TaskAnalyticsChart from '@/components/projects/TaskAnalyticsChart';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const { data: project, isLoading } = useProject(projectId);
  const exportMutation = useExportProject();

  const handleExport = async () => {
    try {
      const data = await exportMutation.mutateAsync(projectId);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project?.name || 'project'}-export.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Project exported successfully!');
    } catch (error) {
      toast.error('Failed to export project');
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="container mx-auto py-8">
          <div>Loading...</div>
        </div>
      </AuthGuard>
    );
  }

  if (!project) {
    return (
      <AuthGuard>
        <div className="container mx-auto py-8">
          <div>Project not found</div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              {project.description && (
                <p className="text-muted-foreground">{project.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exportMutation.isPending}
            >
              <Download className="h-4 w-4 mr-2" />
              {exportMutation.isPending ? 'Exporting...' : 'Export'}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/projects/${projectId}/settings`)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="board" className="space-y-4">
          <TabsList>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="board" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Board</CardTitle>
                <CardDescription>
                  Drag and drop tasks between columns to update their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KanbanBoard projectId={projectId} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <TaskAnalyticsChart projectId={projectId} />
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
}