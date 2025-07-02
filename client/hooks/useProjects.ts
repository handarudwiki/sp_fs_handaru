import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Project, PaginatedResponse, ProjectMember } from '@/types';

interface ProjectsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const useProjects = (params: ProjectsParams = {}) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: async () => {
      const response = await api.get('/projects', { params });
      return response.data as PaginatedResponse<Project>;
    },
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const response = await api.get(`/projects/${id}`);
      return response.data.data as Project;
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const response = await api.post('/projects', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useInviteMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ projectId, user_id }: { projectId: string; user_id: string }) => {
      console.log("Inviting user:", user_id, "to project:", projectId);
      const response = await api.post(`/projects/${projectId}/invite`, { user_id });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
  });
};

export const useExportProject = () => {
  return useMutation({
    mutationFn: async (projectId: string) => {
      const response = await api.get(`/projects/${projectId}`);
      return response.data.data;
    },
  });
};

export const useMembers  = (projectId: string) => {
  return useQuery({
    queryKey: ['project-members', projectId],
    queryFn: async () => {
      const response = await api.get(`/projects/${projectId}/members`);
      return response.data.data as ProjectMember[];
    },
    enabled: !!projectId,
  });
};