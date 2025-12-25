import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskState } from '../types';
import firestore from '@react-native-firebase/firestore';

// Async thunks for task management
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId: string) => {
    try {
      const snapshot = await firestore()
        .collection('tasks')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      const tasks: Task[] = snapshot.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          createdAt: data.createdAt.toDate(),
          deadline: data.deadline.toDate(),
          priority: data.priority,
          status: data.status,
          category: data.category,
          tags: data.tags || [],
          userId: data.userId,
        };
      });
      
      return tasks;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const taskData = {
        ...task,
        createdAt: firestore.FieldValue.serverTimestamp(),
        deadline: firestore.Timestamp.fromDate(task.deadline),
      };
      
      const docRef = await firestore().collection('tasks').add(taskData);
      
      return {
        id: docRef.id,
        ...task,
        createdAt: new Date(),
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
    try {
      const updateData = {
        ...updates,
        deadline: updates.deadline ? firestore.Timestamp.fromDate(updates.deadline) : undefined,
      };
      
      await firestore().collection('tasks').doc(id).update(updateData);
      
      return { id, updates };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string) => {
    try {
      await firestore().collection('tasks').doc(taskId).delete();
      return taskId;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
  filter: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<'all' | 'pending' | 'completed'>) => {
      state.filter = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'createdAt' | 'deadline' | 'priority'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.isLoading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Add Task
      .addCase(addTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isLoading = false;
        state.tasks.unshift(action.payload);
        state.error = null;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add task';
      })
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id, updates } = action.payload;
        const index = state.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...updates };
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update task';
      })
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete task';
      });
  },
});

export const { setFilter, setSortBy, setSortOrder, clearError } = taskSlice.actions;
export default taskSlice.reducer;
