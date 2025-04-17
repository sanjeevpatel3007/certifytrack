import toast from 'react-hot-toast';
import { 
  fetchBatchById, 
  fetchTasksByBatchId, 
  getTasksGroupedByDay, 
  getUserProgress, 
  checkEnrollment 
} from './fetchUtils';

/**
 * Fetches all necessary data for the learning page
 * @param {string} batchId - The batch ID
 * @param {string} userId - The user ID
 * @returns {Object} The fetched data or error information
 */
export async function fetchLearningPageData(batchId, userId) {
  if (!batchId || !userId) {
    return { 
      success: false, 
      error: 'Missing batchId or userId',
      isEnrolled: false
    };
  }

  try {
    // Check enrollment first
    console.log(`Checking enrollment for batchId: ${batchId}, userId: ${userId}`);
    const enrollmentData = await checkEnrollment(batchId, userId);
    
    if (!enrollmentData || !enrollmentData.isEnrolled) {
      console.log('User is not enrolled in this batch');
      return { 
        success: false, 
        error: 'Not enrolled', 
        isEnrolled: false,
        redirectTo: `/batch/${batchId}`
      };
    }

    // Fetch batch details
    console.log(`Fetching batch details for batchId: ${batchId}`);
    const batch = await fetchBatchById(batchId);
    
    if (!batch) {
      console.log('Batch not found');
      return { 
        success: false, 
        error: 'Batch not found',
        isEnrolled: true,
        redirectTo: '/404'
      };
    }

    // Fetch tasks
    console.log(`Fetching tasks for batchId: ${batchId}`);
    const tasks = await fetchTasksByBatchId(batchId);
    
    // Group tasks by day
    console.log('Grouping tasks by day');
    const tasksByDay = await getTasksGroupedByDay(batchId);
    
    // Fetch user progress
    console.log(`Fetching user progress for batchId: ${batchId}, userId: ${userId}`);
    const progress = await getUserProgress(batchId, userId);
    
    return {
      success: true,
      batch,
      tasks,
      tasksByDay,
      progress,
      isEnrolled: true,
      enrollment: enrollmentData.enrollment
    };
  } catch (error) {
    console.error('Error fetching learning page data:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to load course content',
      isEnrolled: false
    };
  }
}

/**
 * Selects the initial task based on user progress
 * @param {Array} tasks - The list of tasks
 * @param {Object} progress - The user progress data
 * @returns {Object} The selected task
 */
export function selectInitialTask(tasks, progress) {
  if (!tasks || !tasks.length) return null;
  
  // If user has completed tasks, select the first incomplete task
  if (progress && progress.completedTasks && progress.completedTasks.length > 0) {
    // First try to find the task immediately after the last completed task
    const completedTaskIds = new Set(progress.completedTasks);
    
    // Find first incomplete task
    const firstIncompleteTask = tasks.find(task => !completedTaskIds.has(task._id));
    if (firstIncompleteTask) return firstIncompleteTask;
  }
  
  // Default to first task
  return tasks[0];
}

/**
 * Formats error messages for the learning page
 * @param {Object} error - The error object or message
 * @returns {string} Formatted error message
 */
export function formatLearningError(error) {
  if (!error) return 'An unknown error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  return 'Failed to load course content';
}

/**
 * Shows a user-friendly toast message for errors
 * @param {Object} error - The error object or message 
 */
export function handleLearningError(error) {
  const message = formatLearningError(error);
  toast.error(message);
  console.error('Learning page error:', error);
} 