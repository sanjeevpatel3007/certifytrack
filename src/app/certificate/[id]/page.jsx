'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useBatchStore } from '@/store/batchStore';
import { useTaskStore } from '@/store/taskStore';
import Certificate from '@/components/Certificate';
import Footer from '@/components/Footer';
import { FiDownload, FiArrowLeft, FiLogIn, FiAlertCircle, FiBookOpen, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { getUserProgress } from '@/lib/fetchUtils';
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
    <div className="min-h-screen bg-gray-50">
    
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button 
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" />
            <span>Back to {isLoggedIn ? 'Course' : 'Courses'}</span>
          </button>
        </div>
        
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="max-w-5xl mx-auto animate-pulse">
            {/* Certificate Header */}
            <div className="mb-6 text-center">
              <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
            </div>
            
            {/* Certificate Container */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              {/* Certificate Border */}
              <div className="border-8 border-gray-100 m-2 p-8">
                {/* Certificate Header */}
                <div className="mb-6 text-center">
                  <div className="h-6 w-32 bg-gray-200 rounded mx-auto mb-2"></div>
                  <div className="h-10 w-96 bg-gray-200 rounded mx-auto mb-4"></div>
                </div>
                
                {/* Certificate Body */}
                <div className="text-center mb-8">
                  <div className="h-4 w-full max-w-lg bg-gray-200 rounded mx-auto mb-3"></div>
                  <div className="h-4 w-full max-w-md bg-gray-200 rounded mx-auto mb-3"></div>
                  <div className="h-4 w-full max-w-sm bg-gray-200 rounded mx-auto"></div>
                </div>
                
                {/* Certificate Recipient */}
                <div className="text-center mb-8">
                  <div className="h-10 w-72 bg-gray-200 rounded mx-auto mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
                </div>
                
                {/* Certificate Course */}
                <div className="text-center mb-10">
                  <div className="h-6 w-64 bg-gray-200 rounded mx-auto mb-2"></div>
                  <div className="h-8 w-80 bg-gray-200 rounded mx-auto"></div>
                </div>
                
                {/* Certificate Footer */}
                <div className="flex justify-between items-end">
                  <div className="text-center">
                    <div className="h-1 w-32 bg-gray-300 mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                  
                  <div className="text-center">
                    <div className="h-12 w-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>
                  
                  <div className="text-center">
                    <div className="h-1 w-32 bg-gray-300 mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions Skeleton */}
            <div className="flex justify-center space-x-4 mb-8">
              <div className="h-10 w-44 bg-gray-200 rounded"></div>
              <div className="h-10 w-44 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {!isLoading && error && (
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <FiAlertCircle className="text-red-500 w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Certificate Not Available</h2>
              <p className="text-lg text-gray-600 mb-6">{error}</p>
              
              {!isLoggedIn && (
                <div className="mb-6">
                  <p className="text-gray-500 mb-4">Please log in to view your certificates.</p>
                  <Link 
                    href="/login"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    <FiLogIn className="mr-2" />
                    <span>Log In</span>
                  </Link>
                </div>
              )}
              
              {isLoggedIn && progress < 100 && batchData && (
                <div className="mb-6">
                  <p className="text-gray-500 mb-2">Your current progress:</p>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    <span className="font-medium">{progress}%</span> completed
                  </p>
                  <Link 
                    href={`/learning/${batchId}`}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    <FiBookOpen className="mr-2" />
                    <span>Continue Learning</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Certificate Preview */}
        {!isLoading && !error && certificateData && (
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Your Certificate</h1>
            <p className="text-gray-500 text-center mb-8">Congratulations on completing the course!</p>
            
            <Certificate 
              certificateData={certificateData}
              className="mb-8"
              showBorder={true}
            />
            
          
            
            <div className="text-center text-gray-500 text-sm mb-8">
              <p>Share this certificate on your social media profiles or add it to your resume.</p>
            </div>
            
            {/* View All Certificates Button */}
            <div className="text-center mb-8">
              <button
                onClick={handleViewAllCertificates}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <span>View All Certificates</span>
                <FiArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        )}
        
        {/* For Not Logged In Users */}
        {!isLoading && !isLoggedIn && batchData && (
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <FiAward className="text-blue-500 w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Certificate for {batchData.title}</h2>
              <p className="text-lg text-gray-600 mb-6">
                Log in to view or earn this certificate.
              </p>
              <div className="mb-6">
                <Link 
                  href="/login"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  <FiLogIn className="mr-2" />
                  <span>Log In</span>
                </Link>
              </div>
              <p className="text-sm text-gray-500">
                Don't have an account yet? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>.
              </p>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 