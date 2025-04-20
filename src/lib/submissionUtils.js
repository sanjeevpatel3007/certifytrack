import toast from 'react-hot-toast';
import { get, post, put, del } from './api';

/**
 * Fetch submissions for a given user and task
 * @param {string} userId - User ID
 * @param {string} taskId - Task ID (optional)
 * @param {string} batchId - Batch ID (optional)
 * @returns {Array} List of submissions
 */
export async function fetchSubmissions({ userId, taskId, batchId, status }) {
  try {
    // Build query string
    let queryParams = [];
    if (userId) queryParams.push(`userId=${userId}`);
    if (taskId) queryParams.push(`taskId=${taskId}`);
    if (batchId) queryParams.push(`batchId=${batchId}`);
    if (status) queryParams.push(`status=${status}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    const data = await get(`task-submissions${queryString}`);
    return data.submissions || [];
  } catch (error) {
    console.error('Error fetching submissions:', error);
    toast.error('Failed to load submissions');
    return [];
  }
}

/**
 * Fetch a specific submission by ID
 * @param {string} submissionId - Submission ID
 * @returns {Object} Submission object
 */
export async function fetchSubmissionById(submissionId) {
  try {
    const data = await get(`task-submissions/${submissionId}`);
    return data.submission || null;
  } catch (error) {
    console.error('Error fetching submission:', error);
    toast.error('Failed to load submission details');
    return null;
  }
}

/**
 * Submit a task
 * @param {Object} submissionData - Submission data
 * @returns {Object} Submission result
 */
export async function submitTask(submissionData) {
  try {
    const { taskId, userId, batchId, content, files, links } = submissionData;
    
    if (!taskId || !userId || !batchId) {
      toast.error('Missing required fields');
      return null;
    }
    
    // Validate files to ensure correct structure
    const validatedFiles = Array.isArray(files) ? files.map(file => ({
      url: file.url || '',
      name: file.name || 'Unnamed file',
      type: file.type || 'unknown',
      size: typeof file.size === 'number' ? file.size : 0,
      publicId: file.publicId || ''
    })) : [];
    
    // Validate links to ensure correct structure
    const validatedLinks = Array.isArray(links) ? links.map(link => ({
      url: link.url || '',
      description: link.description || ''
    })) : [];
    
    const result = await post('task-submissions', {
      taskId,
      userId,
      batchId,
      content: content || '',
      files: validatedFiles,
      links: validatedLinks
    });
    
    if (result.success) {
      toast.success('Task submitted successfully!');
      return result.submission;
    } else {
      toast.error(result.error || 'Failed to submit task');
      return null;
    }
  } catch (error) {
    console.error('Error submitting task:', error);
    toast.error(error.message || 'Failed to submit task');
    return null;
  }
}

/**
 * Update an existing submission
 * @param {string} submissionId - Submission ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated submission
 */
export async function updateSubmission(submissionId, updateData) {
  try {
    // If files are provided, ensure they have the right format
    if (updateData.files) {
      updateData.files = updateData.files.map(file => ({
        url: file.url || '',
        name: file.name || 'Unnamed file',
        type: file.type || 'unknown',
        size: typeof file.size === 'number' ? file.size : 0,
        publicId: file.publicId || ''
      }));
    }
    
    // If links are provided, ensure they have the right format
    if (updateData.links) {
      updateData.links = updateData.links.map(link => ({
        url: link.url || '',
        description: link.description || ''
      }));
    }
    
    // Ensure content is a string
    if (updateData.content !== undefined) {
      updateData.content = updateData.content || '';
    }
    
    const result = await put(`task-submissions/${submissionId}`, updateData);
    
    if (result.success) {
      toast.success('Submission updated successfully!');
      return result.submission;
    } else {
      toast.error(result.error || 'Failed to update submission');
      return null;
    }
  } catch (error) {
    console.error('Error updating submission:', error);
    toast.error(error.message || 'Failed to update submission');
    return null;
  }
}

/**
 * Delete a submission
 * @param {string} submissionId - Submission ID
 * @returns {boolean} Success status
 */
export async function deleteSubmission(submissionId) {
  try {
    const result = await del(`task-submissions/${submissionId}`);
    
    if (result.success) {
      toast.success('Submission deleted successfully!');
      return true;
    } else {
      toast.error(result.error || 'Failed to delete submission');
      return false;
    }
  } catch (error) {
    console.error('Error deleting submission:', error);
    toast.error(error.message || 'Failed to delete submission');
    return false;
  }
}

/**
 * Review a submission (for instructors)
 * @param {string} submissionId - Submission ID
 * @param {Object} reviewData - Review data
 * @returns {Object} Updated submission
 */
export async function reviewSubmission(submissionId, reviewData) {
  try {
    const { status, feedback, grade, reviewedBy } = reviewData;
    
    const result = await put(`task-submissions/${submissionId}`, {
      status,
      feedback,
      grade,
      reviewedBy
    });
    
    if (result.success) {
      toast.success('Submission reviewed successfully!');
      return result.submission;
    } else {
      toast.error(result.error || 'Failed to review submission');
      return null;
    }
  } catch (error) {
    console.error('Error reviewing submission:', error);
    toast.error(error.message || 'Failed to review submission');
    return null;
  }
}

/**
 * Upload a file for task submission
 * @param {File} file - File object to upload
 * @returns {Object} File details including URL
 */
export async function uploadFile(file) {
  if (!file || !(file instanceof File)) {
    console.error('Invalid file object provided:', file);
    toast.error('Invalid file provided');
    return null;
  }
  
  // Create a unique loading toast ID
  const loadingToastId = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  toast.loading(`Uploading ${file.name}...`, { id: loadingToastId });
  
  try {
    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File too large: ${file.name} (max 10MB)`, { id: loadingToastId });
      return null;
    }
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    
    // Custom fetch instead of our API helpers since we're sending FormData
    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If parsing JSON fails, use the default message
      }
      
      toast.error(`Failed to upload ${file.name}: ${errorMessage}`, { id: loadingToastId });
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    if (data.success) {
      toast.success(`Uploaded ${file.name} successfully`, { id: loadingToastId });
      return data.file;
    } else {
      toast.error(`Failed to upload ${file.name}: ${data.error || 'Unknown error'}`, { id: loadingToastId });
      throw new Error(data.error || 'Failed to upload file');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    const errorMessage = error.message || 'Failed to upload file';
    toast.error(`Error uploading ${file.name}: ${errorMessage}`, { id: loadingToastId });
    return null;
  }
}

/**
 * Get submission status label
 * @param {string} status - Submission status
 * @returns {string} Formatted status label
 */
export function getSubmissionStatusLabel(status) {
  switch (status) {
    case 'pending':
      return 'Pending Review';
    case 'reviewed':
      return 'Reviewed';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Needs Revision';
    default:
      return 'Unknown';
  }
}

/**
 * Format submission date
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
export function formatSubmissionDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
} 