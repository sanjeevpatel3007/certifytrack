import { create } from 'zustand';
import {
  fetchSubmissions,
  fetchSubmissionById,
  submitTask,
  updateSubmission,
  deleteSubmission,
  reviewSubmission
} from '@/lib/submissionUtils';

export const useSubmissionStore = create((set, get) => ({
  submissions: [],
  currentSubmission: null,
  isLoading: false,
  error: null,
  
  // Fetch submissions with optional filters
  fetchUserSubmissions: async ({ userId, taskId, batchId, status }) => {
    set({ isLoading: true, error: null });
    try {
      const submissions = await fetchSubmissions({ userId, taskId, batchId, status });
      set({ submissions, isLoading: false });
      return submissions;
    } catch (error) {
      console.error('Error fetching user submissions:', error);
      set({ error: 'Failed to load submissions', isLoading: false });
      return [];
    }
  },
  
  // Fetch a specific submission by ID
  fetchSubmission: async (submissionId) => {
    set({ isLoading: true, error: null });
    try {
      const submission = await fetchSubmissionById(submissionId);
      set({ currentSubmission: submission, isLoading: false });
      return submission;
    } catch (error) {
      console.error('Error fetching submission:', error);
      set({ error: 'Failed to load submission details', isLoading: false });
      return null;
    }
  },
  
  // Create a new submission
  createSubmission: async (submissionData) => {
    set({ isLoading: true, error: null });
    try {
      const submission = await submitTask(submissionData);
      
      if (submission) {
        set(state => ({
          submissions: [...state.submissions, submission],
          currentSubmission: submission,
          isLoading: false
        }));
      } else {
        set({ isLoading: false, error: 'Failed to submit task' });
      }
      
      return submission;
    } catch (error) {
      console.error('Error submitting task:', error);
      set({ error: 'Failed to submit task', isLoading: false });
      return null;
    }
  },
  
  // Update an existing submission
  updateSubmission: async (submissionId, updateData) => {
    set({ isLoading: true, error: null });
    try {
      const submission = await updateSubmission(submissionId, updateData);
      
      if (submission) {
        // Update state
        set(state => {
          const updatedSubmissions = state.submissions.map(s => 
            s._id === submissionId ? submission : s
          );
          
          return {
            submissions: updatedSubmissions,
            currentSubmission: submission,
            isLoading: false
          };
        });
      } else {
        set({ isLoading: false, error: 'Failed to update submission' });
      }
      
      return submission;
    } catch (error) {
      console.error('Error updating submission:', error);
      set({ error: 'Failed to update submission', isLoading: false });
      return null;
    }
  },
  
  // Delete a submission
  deleteSubmission: async (submissionId) => {
    set({ isLoading: true, error: null });
    try {
      const success = await deleteSubmission(submissionId);
      
      if (success) {
        // Remove from state
        set(state => {
          const filteredSubmissions = state.submissions.filter(s => s._id !== submissionId);
          
          return {
            submissions: filteredSubmissions,
            currentSubmission: state.currentSubmission?._id === submissionId ? null : state.currentSubmission,
            isLoading: false
          };
        });
      } else {
        set({ isLoading: false, error: 'Failed to delete submission' });
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting submission:', error);
      set({ error: 'Failed to delete submission', isLoading: false });
      return false;
    }
  },
  
  // Review a submission (for instructors)
  reviewSubmission: async (submissionId, reviewData) => {
    set({ isLoading: true, error: null });
    try {
      const submission = await reviewSubmission(submissionId, reviewData);
      
      if (submission) {
        // Update state
        set(state => {
          const updatedSubmissions = state.submissions.map(s => 
            s._id === submissionId ? submission : s
          );
          
          return {
            submissions: updatedSubmissions,
            currentSubmission: submission,
            isLoading: false
          };
        });
      } else {
        set({ isLoading: false, error: 'Failed to review submission' });
      }
      
      return submission;
    } catch (error) {
      console.error('Error reviewing submission:', error);
      set({ error: 'Failed to review submission', isLoading: false });
      return null;
    }
  },
  
  // Set current submission directly
  setCurrentSubmission: (submission) => {
    set({ currentSubmission: submission });
  },
  
  // Reset store
  resetSubmissionStore: () => {
    set({
      submissions: [],
      currentSubmission: null,
      isLoading: false,
      error: null
    });
  }
})); 