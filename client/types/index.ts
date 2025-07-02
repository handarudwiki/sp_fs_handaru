export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  owner: User;
  memberships: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  projectId: string;
  assigneeId?: string;
  assigned?: User;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TaskAnalytics {
  todo: number;
  inProgress: number;
  done: number;
}


export interface ProjectMember {
  id: string;
  user_id: string;
  project_id: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    // tambahkan field lain sesuai struktur user
  };
}
