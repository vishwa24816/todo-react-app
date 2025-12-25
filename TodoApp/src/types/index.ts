// Type definitions for the Todo App

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  category?: string;
  tags?: string[];
  userId: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: 'all' | 'pending' | 'completed';
  sortBy: 'createdAt' | 'deadline' | 'priority';
  sortOrder: 'asc' | 'desc';
}

export interface RootState {
  auth: AuthState;
  tasks: TaskState;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}
