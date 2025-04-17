import { create } from 'zustand';
import { 
  fetchCertificates, 
  fetchCertificateById, 
  createCertificate, 
  updateCertificate, 
  deleteCertificate,
  issueCertificates,
  fetchUserCertificates
} from '@/lib/fetchUtils';

export const useCertificateStore = create((set, get) => ({
  // State
  certificates: [],
  userCertificates: [],
  currentCertificate: null,
  isLoading: false,
  error: null,
  
  // Actions
  fetchAllCertificates: async () => {
    set({ isLoading: true, error: null });
    try {
      const certificates = await fetchCertificates();
      set({ certificates, isLoading: false });
      return certificates;
    } catch (error) {
      console.error('Error fetching certificates:', error);
      set({ error: 'Failed to load certificates', isLoading: false });
      return [];
    }
  },
  
  fetchCertificateById: async (certificateId) => {
    set({ isLoading: true, error: null });
    try {
      const certificate = await fetchCertificateById(certificateId);
      set({ currentCertificate: certificate, isLoading: false });
      return certificate;
    } catch (error) {
      console.error('Error fetching certificate:', error);
      set({ error: 'Failed to load certificate details', isLoading: false });
      return null;
    }
  },
  
  fetchUserCertificates: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const certificates = await fetchUserCertificates(userId);
      set({ userCertificates: certificates, isLoading: false });
      return certificates;
    } catch (error) {
      console.error('Error fetching user certificates:', error);
      set({ error: 'Failed to load your certificates', isLoading: false });
      return [];
    }
  },
  
  createCertificate: async (certificateData) => {
    set({ isLoading: true, error: null });
    try {
      const certificate = await createCertificate(certificateData);
      if (certificate) {
        // Update certificates list
        set(state => ({
          certificates: [...state.certificates, certificate],
          isLoading: false
        }));
      }
      return certificate;
    } catch (error) {
      console.error('Error creating certificate:', error);
      set({ error: 'Failed to create certificate', isLoading: false });
      return null;
    }
  },
  
  updateCertificate: async (certificateId, certificateData) => {
    set({ isLoading: true, error: null });
    try {
      const certificate = await updateCertificate(certificateId, certificateData);
      if (certificate) {
        // Update certificate in list
        set(state => ({
          certificates: state.certificates.map(cert => 
            cert._id === certificateId ? certificate : cert
          ),
          currentCertificate: certificate,
          isLoading: false
        }));
      }
      return certificate;
    } catch (error) {
      console.error('Error updating certificate:', error);
      set({ error: 'Failed to update certificate', isLoading: false });
      return null;
    }
  },
  
  deleteCertificate: async (certificateId) => {
    set({ isLoading: true, error: null });
    try {
      const success = await deleteCertificate(certificateId);
      if (success) {
        // Remove certificate from list
        set(state => ({
          certificates: state.certificates.filter(cert => cert._id !== certificateId),
          isLoading: false
        }));
      }
      return success;
    } catch (error) {
      console.error('Error deleting certificate:', error);
      set({ error: 'Failed to delete certificate', isLoading: false });
      return false;
    }
  },
  
  issueCertificates: async (certificateId, recipients) => {
    set({ isLoading: true, error: null });
    try {
      const result = await issueCertificates(certificateId, recipients);
      set({ isLoading: false });
      return result;
    } catch (error) {
      console.error('Error issuing certificates:', error);
      set({ error: 'Failed to issue certificates', isLoading: false });
      return null;
    }
  },
  
  clearCertificateData: () => {
    set({ 
      currentCertificate: null,
      error: null
    });
  },
  
  resetCertificateStore: () => {
    set({ 
      certificates: [],
      userCertificates: [],
      currentCertificate: null,
      isLoading: false,
      error: null
    });
  }
})); 