'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useBatchStore } from '@/store/batchStore';
import { useTaskStore } from '@/store/taskStore';
import Certificate from '@/components/Certificate';
import Footer from '@/components/Footer';
import { FiDownload, FiArrowLeft } from 'react-icons/fi';

export default function CertificatePage({ params }) {
  const { id: batchId } = params;
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();
  const { currentBatch: batch, fetchBatchById } = useBatchStore();
  const { userProgress, fetchUserProgress } = useTaskStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [certificateData, setCertificateData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!isLoggedIn || !user?._id) {
        router.push('/login');
        return;
      }

      setIsLoading(true);
      try {
        // Load batch data
        const batchData = await fetchBatchById(batchId);
        if (!batchData) {
          setError('Course not found');
          setIsLoading(false);
          return;
        }
        
        // Load progress data
        await fetchUserProgress(batchId, user._id);
        
        // Check if certificate is earned (100% completion)
        if (userProgress < 100) {
          setError('You have not completed this course yet.');
          setIsLoading(false);
          return;
        }
        
        // Create certificate data
        const today = new Date();
        setCertificateData({
          id: `CERT-${batchId.substring(0, 8)}-${user._id.substring(0, 8)}`,
          recipientName: user.name || user.username || 'Student',
          courseName: batchData.title,
          issueDate: today.toISOString(),
          issuerName: batchData.instructor || 'CertifyTrack',
          issuerLogo: '/logo.png',
          verificationUrl: `${window.location.origin}/verify-certificate/${batchId}/${user._id}`,
          backgroundImage: '/certificate-bg.jpg'
        });
      } catch (err) {
        console.error('Error loading certificate:', err);
        setError('Failed to load certificate data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn, user, batchId, router, fetchBatchById, fetchUserProgress, userProgress]);

  const handleBack = () => {
    router.push(`/learning/${batchId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <button 
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" />
            <span>Back to Course</span>
          </button>
        </div>
        
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && !isLoading && (
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-lg mx-auto text-center">
            <div className="text-red-500 text-xl mb-4">
              {error}
            </div>
            <p className="text-gray-600 mb-6">
              Complete all the required tasks to earn your certificate.
            </p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Course
            </button>
          </div>
        )}
        
        {certificateData && !isLoading && !error && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Course Certificate</h1>
            <Certificate 
              certificateData={certificateData}
              showControls={true}
              className="mb-8"
            />
            
            <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">About this Certificate</h2>
              <p className="text-gray-600 mb-4">
                This certificate verifies that {certificateData.recipientName} has successfully completed all required tasks and 
                assignments for the course "{certificateData.courseName}".
              </p>
              <p className="text-gray-600">
                You can download this certificate to share your achievement with others or add it to your professional profile.
              </p>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 