import { Task } from '../types';
import { PRIORITIES } from '../constants';

// Priority weights for sorting (higher number = higher priority)
const PRIORITY_WEIGHTS = {
  high: 3,
  medium: 2,
  low: 1,
};

// Calculate urgency score based on deadline and priority
export const calculateUrgencyScore = (task: Task): number => {
  const now = new Date();
  const deadline = new Date(task.deadline);
  const timeDiff = deadline.getTime() - now.getTime();
  const daysUntilDeadline = timeDiff / (1000 * 3600 * 24);
  
  // Base score from priority
  let score = PRIORITY_WEIGHTS[task.priority] * 10;
  
  // Add urgency based on deadline (closer deadline = higher score)
  if (daysUntilDeadline < 0) {
    // Overdue tasks get highest urgency
    score += 100;
  } else if (daysUntilDeadline <= 1) {
    // Due today or tomorrow
    score += 50;
  } else if (daysUntilDeadline <= 3) {
    // Due within 3 days
    score += 30;
  } else if (daysUntilDeadline <= 7) {
    // Due within a week
    score += 20;
  } else if (daysUntilDeadline <= 30) {
    // Due within a month
    score += 10;
  }
  
  // Completed tasks get lowest priority
  if (task.status === 'completed') {
    score = 0;
  }
  
  return score;
};

// Mixed sorting algorithm that considers priority, deadline, and creation time
export const sortTasks = (tasks: Task[], sortBy: 'createdAt' | 'deadline' | 'priority' | 'urgency', sortOrder: 'asc' | 'desc'): Task[] => {
  const sortedTasks = [...tasks];
  
  return sortedTasks.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'createdAt':
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case 'deadline':
        comparison = a.deadline.getTime() - b.deadline.getTime();
        break;
      case 'priority':
        comparison = PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
        break;
      case 'urgency':
        // Mixed algorithm: combine priority, deadline urgency, and status
        const aScore = calculateUrgencyScore(a);
        const bScore = calculateUrgencyScore(b);
        comparison = bScore - aScore;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
};

// Filter tasks based on status and other criteria
export const filterTasks = (
  tasks: Task[], 
  filter: 'all' | 'pending' | 'completed' | 'overdue' | 'today' | 'week',
  category?: string
): Task[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return tasks.filter(task => {
    // Status filter
    if (filter === 'pending' && task.status !== 'pending') return false;
    if (filter === 'completed' && task.status !== 'completed') return false;
    
    // Overdue filter
    if (filter === 'overdue') {
      const isOverdue = task.deadline < now && task.status !== 'completed';
      if (!isOverdue) return false;
    }
    
    // Today filter
    if (filter === 'today') {
      const taskDeadline = new Date(task.deadline);
      const isToday = taskDeadline.toDateString() === today.toDateString();
      if (!isToday) return false;
    }
    
    // Week filter
    if (filter === 'week') {
      const taskDeadline = new Date(task.deadline);
      const isThisWeek = taskDeadline >= today && taskDeadline <= weekFromNow;
      if (!isThisWeek) return false;
    }
    
    // Category filter
    if (category && task.category !== category) return false;
    
    return true;
  });
};

// Get task statistics
export const getTaskStats = (tasks: Task[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    overdue: tasks.filter(t => t.deadline < now && t.status === 'pending').length,
    dueToday: tasks.filter(t => {
      const taskDeadline = new Date(t.deadline);
      return taskDeadline.toDateString() === today.toDateString() && t.status === 'pending';
    }).length,
    dueThisWeek: tasks.filter(t => {
      const taskDeadline = new Date(t.deadline);
      return taskDeadline >= today && taskDeadline <= weekFromNow && t.status === 'pending';
    }).length,
    byPriority: {
      high: tasks.filter(t => t.priority === 'high' && t.status === 'pending').length,
      medium: tasks.filter(t => t.priority === 'medium' && t.status === 'pending').length,
      low: tasks.filter(t => t.priority === 'low' && t.status === 'pending').length,
    },
    byCategory: tasks.reduce((acc, task) => {
      const category = task.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
};

// Search tasks by title and description
export const searchTasks = (tasks: Task[], query: string): Task[] => {
  if (!query.trim()) return tasks;
  
  const lowercaseQuery = query.toLowerCase();
  return tasks.filter(task => 
    task.title.toLowerCase().includes(lowercaseQuery) ||
    (task.description && task.description.toLowerCase().includes(lowercaseQuery)) ||
    (task.category && task.category.toLowerCase().includes(lowercaseQuery))
  );
};

// Get suggested tasks based on urgency
export const getSuggestedTasks = (tasks: Task[], limit: number = 5): Task[] => {
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const sortedByUrgency = sortTasks(pendingTasks, 'urgency', 'desc');
  return sortedByUrgency.slice(0, limit);
};
