'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useBatchStore } from '@/store/batchStore';
import { useTaskStore } from '@/store/taskStore';
import Certificate from '@/components/Certificate';
import Footer from '@/components/Footer';
import { FiDownload, FiArrowLeft, FiLogIn } from 'react-icons/fi';
import { getUserProgress } from '@/lib/fetchUtils';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function CertificatePage({ params }) {
  const { id: batchId } = params;
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();
  const { currentBatch: batch, fetchBatchById } = useBatchStore();
  const { userProgress, setUserProgress } = useTaskStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [certificateData, setCertificateData] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [batchData, setBatchData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!isLoggedIn || !user?._id) {
        // Just load the batch data for display purposes, don't redirect
        try {
          const batch = await fetchBatchById(batchId);
          setBatchData(batch);
        } catch (err) {
          console.error('Error loading batch data:', err);
        } finally {
          setIsLoading(false);
        }
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
        
        setBatchData(batchData);
        
        // Load progress data directly - don't rely on store state that might not be initialized
        const progressData = await getUserProgress(batchId, user._id);
        setProgress(progressData.progress);
        setUserProgress(progressData.progress);
        
        // Check if certificate is earned (100% completion)
        if (progressData.progress < 100) {
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
          backgroundImage: '/certificate/bg.png'
        });
      } catch (err) {
        console.error('Error loading certificate:', err);
        setError('Failed to load certificate data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn, user, batchId, router, fetchBatchById, setUserProgress]);

  const handleBack = () => {
    router.push(isLoggedIn ? `/learning/${batchId}` : '/courses');
  };

  const handleViewAllCertificates = () => {
    router.push('/certificate');
  };

  // Sample certificate data for preview when not logged in
  const dummyCertificateData = batchData ? {
    id: 'SAMPLE-CERTIFICATE',
    recipientName: 'Sample Student',
    courseName: batchData.title || 'Web Development Course',
    issueDate: new Date().toISOString(),
    issuerName: batchData.instructor || 'CertifyTrack',
    issuerLogo: '/logo.png',
    verificationUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/verify-certificate/sample`,
    backgroundImage: '/certificate-bg.jpg'
  } : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
    
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <button 
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-3 sm:mb-0"
          >
            <FiArrowLeft className="mr-2" />
            <span>Back to {isLoggedIn ? 'Course' : 'Courses'}</span>
          </button>
          
          <button 
            onClick={handleViewAllCertificates}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <span>View All Certificates</span>
          </button>
        </div>
        
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {!isLoggedIn && !isLoading && batchData && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Certificate Preview</h2>
              <p className="text-gray-600 mb-6">
                This is a sample certificate for {batchData.title}. Log in and complete this course to earn your own certificate.
              </p>
              
              <div className="mb-6">
                <Certificate 
                  certificateData={dummyCertificateData}
                  showControls={false}
                  className="mb-4"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href={`/login?redirect=/certificate/${batchId}`}
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FiLogIn className="mr-2" />
                  <span>Log in</span>
                </Link>
                
                <Link 
                  href={`/courses`}
                  className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors mt-3 sm:mt-0"
                >
                  Explore Courses
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {error && !isLoading && isLoggedIn && (
          <div className="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto text-center border border-gray-100 transform transition-all duration-300 hover:shadow-lg">
            <div className="text-red-500 text-xl mb-4">
              {error}
            </div>
            <p className="text-gray-600 mb-6">
              Complete all the required tasks to earn your certificate.
            </p>
            <p className="text-gray-600 mb-6">
              Current progress: {progress}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Return to Course
            </button>
          </div>
        )}
        
        {certificateData && !isLoading && !error && isLoggedIn && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Course Certificate</h1>
            <div className="transition-all duration-300 hover:shadow-xl rounded-lg overflow-hidden">
              <Certificate 
                certificateData={certificateData}
                showControls={true}
                className="mb-8"
              />
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mt-8 border border-gray-100 transition-all duration-300 hover:shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">About this Certificate</h2>
              <p className="text-gray-600 mb-4">
                This certificate verifies that {certificateData.recipientName} has successfully completed all required tasks and 
                assignments for the course "{certificateData.courseName}".
              </p>
              <p className="text-gray-600 mb-4">
                You can download this certificate to share your achievement with others or add it to your professional profile.
              </p>
              <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                <p className="text-sm text-blue-800">
                  <strong>Certificate ID:</strong> {certificateData.id}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Issue Date:</strong> {new Date(certificateData.issueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 