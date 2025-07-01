import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Task, TaskAnalytics, PaginatedResponse } from '@/types';

interface TasksParams {
  projectId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const useTasks = (params: TasksParams) => {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const response = await api.get(`/tasks/${params.projectId}`, { 
        params: { ...params, projectId: undefined } 
      });
      return response.data.data as PaginatedResponse<Task>;
    },
    enabled: !!params.projectId,
  });
};


export const useTaskAnalytics = (projectId: string) => {
  return useQuery({
    queryKey: ['tasks', 'analytics', projectId],
    queryFn: async () => {
      const response = await api.get(`/tasks/${projectId}/analytics`);
  
      return response.data.data as TaskAnalytics;
    },
    enabled: !!projectId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      project_id: string;
      assigned_id: string;
    }) => {
      const response = await api.post('/tasks', data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', { projectId: variables.project_id }] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'analytics', variables.project_id] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Task>) => {
      const response = await api.put(`/tasks/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'analytics', data.projectId] });
    },
  });
};