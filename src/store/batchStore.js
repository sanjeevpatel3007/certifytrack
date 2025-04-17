import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { get, post } from '@/lib/api';
import { fetchBatches, fetchBatchById, checkEnrollment, getUserEnrollments, enrollInBatch } from '@/lib/fetchUtils';

export const useBatchStore = create((set, get) => ({
  batches: [],
  userBatches: [],
  enrollments: [],
  currentBatch: null,
  isLoading: false,
  error: null,
  
  // Fetch all published batches
  fetchAllBatches: async () => {
    set({ isLoading: true, error: null });
    try {
      const batches = await fetchBatches();
      set({ batches, isLoading: false });
    } catch (error) {
      console.error('Error fetching batches:', error);
      set({ error: 'Failed to load courses', isLoading: false });
    }
  },
  
  fetchBatchById: async (batchId) => {
    set({ isLoading: true, error: null });
    try {
      const batch = await fetchBatchById(batchId);
      set({ currentBatch: batch, isLoading: false });
      return batch;
    } catch (error) {
      console.error('Error fetching batch:', error);
      set({ error: 'Failed to load course details', isLoading: false });
      return null;
    }
  },
  
  // Set current batch directly
  setBatch: (batch) => {
    set({ currentBatch: batch });
  },
  
  checkUserEnrollment: async (batchId, userId) => {
    if (!batchId || !userId) {
      console.warn('Cannot check enrollment: missing batchId or userId');
      return { isEnrolled: false, enrollment: null };
    }
    
    try {
      console.log(`Checking enrollment for batch: ${batchId}, user: ${userId}`);
      
      try {
        const result = await checkEnrollment(batchId, userId);
        console.log('Enrollment check result:', result);
        
        // Update the enrollment status in the store for future reference
        if (result.isEnrolled && result.enrollment) {
          const { enrollments } = get();
          
          // If this enrollment is not already in the list, add it
          const existingIndex = enrollments.findIndex(e => 
            (e._id === result.enrollment._id) || 
            (e.batchId === batchId && e.userId === userId) ||
            (e.batchId?._id === batchId && e.userId?._id === userId)
          );
          
          if (existingIndex === -1) {
            set({ enrollments: [...enrollments, result.enrollment] });
          } else {
            // Update existing enrollment
            const updatedEnrollments = [...enrollments];
            updatedEnrollments[existingIndex] = result.enrollment;
            set({ enrollments: updatedEnrollments });
          }
        }
        
        return result;
      } catch (error) {
        // Handle API error but don't fail - check local state as fallback
        console.error('API error checking enrollment:', error);
        
        // Fallback to checking in local state
        const { enrollments } = get();
        const enrollmentInState = enrollments.find(e => {
          const enrollmentBatchId = e.batchId?._id || e.batchId;
          const enrollmentUserId = e.userId?._id || e.userId;
          
          // Check all possible variants of IDs (object vs string)
          return (
            (enrollmentBatchId === batchId && enrollmentUserId === userId) ||
            (String(enrollmentBatchId) === String(batchId) && String(enrollmentUserId) === String(userId))
          );
        });
        
        if (enrollmentInState) {
          console.log('Found enrollment in local state:', enrollmentInState);
          return { isEnrolled: true, enrollment: enrollmentInState };
        }
        
        return { isEnrolled: false, enrollment: null };
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
      return { isEnrolled: false, enrollment: null };
    }
  },
  
  fetchUserEnrolledBatches: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/enrollments?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch enrolled courses');
      }
      
      const data = await response.json();
      set({ userBatches: data.enrollments || [], isLoading: false });
      return data.enrollments || [];
    } catch (error) {
      console.error('Error fetching user enrolled batches:', error);
      set({ error: 'Failed to load your courses', isLoading: false });
      return [];
    }
  },
  
  isUserEnrolled: (batchId) => {
    const { userBatches } = get();
    return userBatches.some(enrollment => {
      const enrollmentBatchId = enrollment.batchId?._id || enrollment.batchId;
      return enrollmentBatchId === batchId;
    });
  },
  
  fetchEnrollments: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const enrollments = await getUserEnrollments(userId);
      set({ enrollments, isLoading: false });
      return enrollments;
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      set({ error: 'Failed to fetch your enrollments', isLoading: false });
      return [];
    }
  },
  
  enrollUserInBatch: async (batchId, userId) => {
    try {
      const result = await enrollInBatch(batchId, userId);
      
      // If enrollment was successful, update the enrollments list
      if (result && result.enrollment) {
        const { enrollments } = get();
        set({ enrollments: [...enrollments, result.enrollment] });
      }
      
      return result;
    } catch (error) {
      console.error('Error enrolling in batch:', error);
      return null;
    }
  },
  
  clearBatchData: () => {
    set({ 
      currentBatch: null,
      error: null
    });
  },
  
  resetBatchStore: () => {
    set({ 
      batches: [],
      userBatches: [],
      enrollments: [],
      currentBatch: null,
      isLoading: false,
      error: null
    });
  }
})); 