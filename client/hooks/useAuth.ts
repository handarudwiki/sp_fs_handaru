import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
}

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  
  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post('/users/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth( data.data.token);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post('/users/register', data);
      return response.data;
    },
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: async () => {
      if (!query) return [];
      const response = await api.get(`/users/search?q=${query}`);
      console.log("Search query:", query);
      console.log("Search response:", response.data.data);
      return response.data.data;
    },
    enabled: !!query,
  });
};
