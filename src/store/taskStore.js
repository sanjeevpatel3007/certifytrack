import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { get, post } from '@/lib/api';
import { fetchTasksByBatchId, updateTaskCompletion, getTasksGroupedByDay, getUserProgress } from '@/lib/fetchUtils';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  tasksByDay: [],
  currentTask: null,
  completedTasks: [],
  userProgress: 0,
  isLoading: false,
  error: null,
  
  // Fetch tasks for a batch
  fetchTasksByBatchId: async (batchId) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await fetchTasksByBatchId(batchId);
      set({ tasks, isLoading: false });
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ error: 'Failed to load course tasks', isLoading: false });
      return [];
    }
  },
  
  // Fetch tasks grouped by day
  fetchTasksGroupedByDay: async (batchId) => {
    set({ isLoading: true, error: null });
    try {
      const tasksByDay = await getTasksGroupedByDay(batchId);
      set({ tasksByDay, isLoading: false });
      return tasksByDay;
    } catch (error) {
      console.error('Error fetching tasks grouped by day:', error);
      set({ error: 'Failed to load course tasks', isLoading: false });
      return [];
    }
  },
  
  // Fetch user progress for a course
  fetchUserProgress: async (batchId, userId) => {
    if (!batchId || !userId) return null;
    
    try {
      const result = await getUserProgress(batchId, userId);
      set({ 
        completedTasks: result.completedTasks, 
        userProgress: result.progress
      });
      
      // If we have a last completed task and no current task is selected,
      // set it as the current task
      if (result.lastCompletedTaskId && !get().currentTask) {
        const tasks = get().tasks;
        const lastTask = tasks.find(t => t._id === result.lastCompletedTaskId);
        if (lastTask) {
          set({ currentTask: lastTask });
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  },
  
  // Fetch a single task by ID
  fetchTaskById: async (taskId) => {
    if (!taskId) return null;
    
    set({ isLoading: true, error: null });
    try {
      const data = await get(`tasks/${taskId}`);
      set({ currentTask: data.task, isLoading: false });
      return data.task;
    } catch (error) {
      console.error('Error fetching task:', error);
      set({ error: error.message, isLoading: false });
      toast.error('Failed to load task details');
      return null;
    }
  },
  
  // Mark a task as completed
  markTaskAsCompleted: async (userId, enrollmentId, taskId) => {
    if (!userId || !enrollmentId || !taskId) {
      toast.error('Required information missing');
      return false;
    }
    
    set({ isLoading: true, error: null });
    try {
      const data = await post('/api/enrollments/complete-task', {
        userId,
        enrollmentId,
        taskId
      });
      
      toast.success('Task marked as completed!');
      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error('Error marking task as completed:', error);
      set({ error: error.message, isLoading: false });
      toast.error(error.message || 'Failed to update progress');
      return false;
    }
  },
  
  // Direct setters for store data
  setTasks: (tasks) => {
    set({ tasks });
  },
  
  setTasksByDay: (tasksByDay) => {
    set({ tasksByDay });
  },
  
  setUserProgress: (progress) => {
    set({ userProgress: progress });
  },
  
  setCurrentTask: (task) => {
    set({ currentTask: task });
  },
  
  setCompletedTasks: (taskIds) => {
    set({ completedTasks: taskIds });
  },
  
  toggleTaskCompletion: async (taskId, userId, isCompleted) => {
    // Optimistically update the UI
    set((state) => ({
      completedTasks: isCompleted 
        ? [...state.completedTasks, taskId]
        : state.completedTasks.filter(id => id !== taskId),
      userProgress: state.tasks.length > 0 
        ? Math.round(((isCompleted 
            ? state.completedTasks.length + 1 
            : state.completedTasks.length - 1) / state.tasks.length) * 100)
        : 0
    }));
    
    try {
      const success = await updateTaskCompletion(taskId, userId, isCompleted);
      
      if (!success) {
        // If API call fails, revert the optimistic update
        set((state) => ({
          completedTasks: isCompleted 
            ? state.completedTasks.filter(id => id !== taskId)
            : [...state.completedTasks, taskId],
          userProgress: state.tasks.length > 0 
            ? Math.round((state.completedTasks.length / state.tasks.length) * 100)
            : 0
        }));
      }
      
      return success;
    } catch (error) {
      console.error('Error updating task completion:', error);
      
      // Revert the optimistic update on error
      set((state) => ({
        completedTasks: isCompleted 
          ? state.completedTasks.filter(id => id !== taskId)
          : [...state.completedTasks, taskId],
        userProgress: state.tasks.length > 0 
          ? Math.round((state.completedTasks.length / state.tasks.length) * 100)
          : 0
      }));
      
      return false;
    }
  },
  
  getProgress: () => {
    const { tasks, completedTasks } = get();
    if (!tasks.length) return 0;
    return Math.round((completedTasks.length / tasks.length) * 100);
  },
  
  getCurrentDayTasks: (dayNumber) => {
    const { tasksByDay } = get();
    const dayData = tasksByDay.find(day => day.dayNumber === dayNumber);
    return dayData ? dayData.tasks : [];
  },
  
  clearTaskData: () => {
    set({ 
      currentTask: null,
      error: null
    });
  },
  
  resetTaskStore: () => {
    set({ 
      tasks: [],
      tasksByDay: [],
      currentTask: null,
      completedTasks: [],
      userProgress: 0,
      isLoading: false,
      error: null
    });
  }
})); 