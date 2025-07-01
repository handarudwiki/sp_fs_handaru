import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Project, PaginatedResponse } from '@/types';

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
      return response.data as Project;
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
    mutationFn: async ({ projectId, email }: { projectId: string; email: string }) => {
      const response = await api.post(`/projects/${projectId}/invite`, { email });
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
      const response = await api.get(`/projects/${projectId}/export`);
      return response.data;
    },
  });
};