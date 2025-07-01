'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';
import CreateProjectForm from './CreateProjectFrom';

export default function ProjectsGrid() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const debouncedSearch = useDebounce(search, 300);
  
  const { data: projectsData, isLoading } = useProjects({
    page,
    limit: 12,
    search: debouncedSearch,
  });

  const projects = projectsData?.data || [];
  const pagination = projectsData?.pagination;

  const handleProjectClick = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <CreateProjectForm onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleProjectClick(project)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="mr-1 h-3 w-3" />
                  {project.members?.length || 0} members
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-muted-foreground">Get started by creating a new project.</p>
        </div>
      )}
    </div>
  );
}