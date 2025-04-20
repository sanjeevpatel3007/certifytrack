import toast from 'react-hot-toast';

// Base API helper functions
export async function get(endpoint) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export async function post(endpoint, data) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
}

export async function put(endpoint, data) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error putting to ${endpoint}:`, error);
    throw error;
  }
}

export async function del(endpoint) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting ${endpoint}:`, error);
    throw error;
  }
}

// Specific API functions

// Batch related functions
export async function fetchBatches() {
  try {
    const data = await get('batches');
    return data.batches;
  } catch (error) {
    toast.error('Failed to fetch courses');
    return [];
  }
}

export async function fetchBatchById(batchId) {
  try {
    const data = await get(`batches/${batchId}`);
    return data.batch;
  } catch (error) {
    toast.error('Failed to fetch course details');
    return null;
  }
}

export async function enrollInBatch(batchId, userId) {
  try {
    const result = await post('enrollments', { batchId, userId });
    toast.success('Successfully enrolled in the course!');
    return result;
  } catch (error) {
    toast.error(error.message || 'Failed to enroll in the course');
    return null;
  }
}

export async function checkEnrollment(batchId, userId) {
  if (!batchId || !userId) {
    console.warn('checkEnrollment called with missing parameters', { batchId, userId });
    return { isEnrolled: false, enrollment: null };
  }
  
  try {
    console.log(`Making API request to check enrollment - batchId: ${batchId}, userId: ${userId}`);
    const result = await get(`enrollments/check?batchId=${batchId}&userId=${userId}`);
    console.log('Enrollment check API response:', result);
    
    return {
      isEnrolled: result.isEnrolled || false,
      enrollment: result.enrollment || null
    };
  } catch (error) {
    console.error('Error checking enrollment:', error);
    // Include error details for debugging
    return { 
      isEnrolled: false, 
      enrollment: null,
      error: error.message,
      errorDetails: error.toString()
    };
  }
}

// Task related functions
export async function fetchTasksByBatchId(batchId) {
  try {
    console.log(`fetchTasksByBatchId called with batchId: ${batchId}`);
    const data = await get(`tasks?batchId=${batchId}`);
    console.log(`fetchTasksByBatchId result: found ${data.tasks?.length || 0} tasks`);
    
    // Log sample of the task data
    if (data.tasks && data.tasks.length > 0) {
      console.log('Sample task fields:', Object.keys(data.tasks[0]));
    }
    
    return data.tasks;
  } catch (error) {
    console.error('Error fetching tasks for batch:', error);
    toast.error('Failed to fetch course tasks');
    return [];
  }
}

export async function updateTaskCompletion(taskId, userId, isCompleted) {
  try {
    const endpoint = isCompleted 
      ? `tasks/${taskId}/complete` 
      : `tasks/${taskId}/uncomplete`;
    
    const result = await post(endpoint, { userId });
    return result.success;
  } catch (error) {
    toast.error('Failed to update task status');
    return false;
  }
}

// Certificate related functions
export async function fetchCertificates() {
  try {
    const data = await get('admin/certificates');
    return data.certificates;
  } catch (error) {
    toast.error('Failed to fetch certificates');
    return [];
  }
}

export async function fetchCertificateById(certificateId) {
  try {
    const data = await get(`admin/certificates/${certificateId}`);
    return data.certificate;
  } catch (error) {
    toast.error('Failed to fetch certificate details');
    return null;
  }
}

export async function createCertificate(certificateData) {
  try {
    const result = await post('admin/certificates', certificateData);
    toast.success('Certificate created successfully!');
    return result.certificate;
  } catch (error) {
    toast.error(error.message || 'Failed to create certificate');
    return null;
  }
}

export async function updateCertificate(certificateId, certificateData) {
  try {
    const result = await put(`admin/certificates/${certificateId}`, certificateData);
    toast.success('Certificate updated successfully!');
    return result.certificate;
  } catch (error) {
    toast.error(error.message || 'Failed to update certificate');
    return null;
  }
}

export async function deleteCertificate(certificateId) {
  try {
    await del(`admin/certificates/${certificateId}`);
    toast.success('Certificate deleted successfully!');
    return true;
  } catch (error) {
    toast.error(error.message || 'Failed to delete certificate');
    return false;
  }
}

export async function issueCertificates(certificateId, recipients) {
  try {
    const result = await post('admin/certificates/issue', {
      certificateId,
      recipients
    });
    
    toast.success('Certificates issued successfully!');
    return result;
  } catch (error) {
    toast.error(error.message || 'Failed to issue certificates');
    return null;
  }
}

// User related functions
export async function fetchUserCertificates(userId) {
  try {
    const data = await get(`user/certificates?userId=${userId}`);
    return data.certificates;
  } catch (error) {
    toast.error('Failed to fetch your certificates');
    return [];
  }
}

// User enrollment functions
export async function getUserEnrollments(userId) {
  try {
    const data = await get(`enrollments?userId=${userId}`);
    return data.enrollments || [];
  } catch (error) {
    toast.error('Failed to fetch your enrollments');
    return [];
  }
}

// Date formatting helper function
export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Calculate end date based on start date and duration
export function calculateEndDate(startDate, durationInWeeks) {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + (durationInWeeks * 7));
  return formatDate(end);
}

// Learning page related functions
export async function getTasksGroupedByDay(batchId) {
  try {
    // First get the batch to determine its duration
    const batch = await fetchBatchById(batchId);
    if (!batch) {
      throw new Error('Batch not found');
    }
    
    const totalDays = batch.durationDays || 0;
    
    // Fetch tasks
    const tasks = await fetchTasksByBatchId(batchId);
    
    // Group tasks by day number
    const groupedTasks = tasks.reduce((acc, task) => {
      const day = task.dayNumber || 1;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(task);
      return acc;
    }, {});
    
    // Create array for all days, including those without tasks
    const allDays = [];
    
    // For each day in the batch duration, create an entry
    for (let day = 1; day <= totalDays; day++) {
      // If tasks exist for this day, use them; otherwise create a placeholder
      if (groupedTasks[day] && groupedTasks[day].length > 0) {
        allDays.push({
          dayNumber: day,
          tasks: groupedTasks[day].sort((a, b) => a.order - b.order)
        });
      } else {
        // Create a placeholder "Coming Soon" task for this day
        allDays.push({
          dayNumber: day,
          tasks: [{
            _id: `placeholder-${day}`,
            title: 'Coming Soon',
            description: 'This task will be available soon',
            dayNumber: day,
            isPlaceholder: true,
            contentType: 'coming-soon'
          }]
        });
      }
    }
    
    // Sort days by day number
    allDays.sort((a, b) => a.dayNumber - b.dayNumber);
    
    return allDays;
  } catch (error) {
    console.error('Error getting tasks grouped by day:', error);
    toast.error('Failed to load course tasks');
    return [];
  }
}

export async function getUserProgress(batchId, userId) {
  try {
    const result = await get(`enrollments/progress?batchId=${batchId}&userId=${userId}`);
    return {
      completedTasks: result.completedTasks || [],
      progress: result.progress || 0,
      lastCompletedTaskId: result.lastCompletedTaskId || null
    };
  } catch (error) {
    console.error('Error getting user progress:', error);
    return {
      completedTasks: [],
      progress: 0,
      lastCompletedTaskId: null
    };
  }
}

export function getTaskCompletionStatus(tasks, completedTaskIds) {
  if (!tasks || !tasks.length) return { completedCount: 0, totalCount: 0, percentage: 0 };
  
  const totalCount = tasks.length;
  const completedCount = tasks.filter(task => completedTaskIds.includes(task._id)).length;
  const percentage = Math.round((completedCount / totalCount) * 100);
  
  return { completedCount, totalCount, percentage };
} 