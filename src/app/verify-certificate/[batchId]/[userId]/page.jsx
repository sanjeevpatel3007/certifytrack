'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiCheck, FiX, FiArrowLeft } from 'react-icons/fi';
import { useBatchStore } from '@/store/batchStore';
import { useTaskStore } from '@/store/taskStore';
import Footer from '@/components/Footer';
import Certificate from '@/components/Certificate';

export default function VerifyCertificatePage({ params }) {
  const { batchId, userId } = params;
  const router = useRouter();
  const { fetchBatchById } = useBatchStore();
  const { fetchUserProgress } = useTaskStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [verification, setVerification] = useState({
    isValid: false,
    studentName: '',
    courseName: '',
    issueDate: '',
    progress: 0
  });
  const [certificateData, setCertificateData] = useState(null);

  useEffect(() => {
    const verifyData = async () => {
      setIsLoading(true);
      try {
        // First, fetch the batch data
        const batchData = await fetchBatchById(batchId);
        if (!batchData) {
          setVerification({
            isValid: false,
            error: 'Certificate validation failed: Course not found.'
          });
          setIsLoading(false);
          return;
        }
        
        // Fetch user data by ID
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          setVerification({
            isValid: false,
            error: 'Certificate validation failed: Student not found.'
          });
          setIsLoading(false);
          return;
        }
        
        const userData = await response.json();
        if (!userData.user) {
          setVerification({
            isValid: false,
            error: 'Certificate validation failed: Invalid student data.'
          });
          setIsLoading(false);
          return;
        }
        
        // Fetch user progress for this course
        const progressData = await fetchUserProgress(batchId, userId);
        
        // Check if certificate is valid (100% completion)
        if (!progressData || progressData.progress < 100) {
          setVerification({
            isValid: false,
            error: 'Certificate validation failed: Course not completed by this student.'
          });
          setIsLoading(false);
          return;
        }
        
        // Certificate is valid
        const studentName = userData.user.name || userData.user.username;
        
        // Create verification result
        setVerification({
          isValid: true,
          studentName,
          courseName: batchData.title,
          issueDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          progress: progressData.progress
        });
        
        // Create certificate data for display
        setCertificateData({
          id: `CERT-${batchId.substring(0, 8)}-${userId.substring(0, 8)}`,
          recipientName: studentName,
          courseName: batchData.title,
          issueDate: new Date().toISOString(),
          issuerName: batchData.instructor || 'CertifyTrack',
          issuerLogo: '/logo.png',
          verificationUrl: `${window.location.origin}/verify-certificate/${batchId}/${userId}`,
          backgroundImage: '/certificate/bg.png'
        });
      } catch (err) {
        console.error('Error verifying certificate:', err);
        setVerification({
          isValid: false,
          error: 'Certificate validation failed: Error processing request.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyData();
  }, [batchId, userId, fetchBatchById, fetchUserProgress]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
     
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" />
            <span>Home</span>
          </Link>
        </div>
        
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Certificate Verification</h1>
          
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Verifying certificate...</span>
            </div>
          )}
          
          {!isLoading && verification.isValid && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                  <FiCheck className="w-10 h-10" />
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-green-600 mb-4">
                Certificate is Valid
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="font-medium text-gray-800">{verification.studentName}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Course</p>
                  <p className="font-medium text-gray-800">{verification.courseName}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Issue Date</p>
                  <p className="font-medium text-gray-800">{verification.issueDate}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Completion</p>
                  <p className="font-medium text-gray-800">{verification.progress}%</p>
                </div>
              </div>
              
              {certificateData && (
                <div className="mt-8 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Certificate Preview</h3>
                  <Certificate 
                    certificateData={certificateData}
                    showControls={true}
                    className="mb-4"
                  />
                </div>
              )}
              
              <p className="text-gray-600 text-sm">
                This certificate verifies that the student has successfully completed all requirements for this course.
              </p>
            </div>
          )}
          
          {!isLoading && !verification.isValid && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                  <FiX className="w-10 h-10" />
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                Invalid Certificate
              </h2>
              
              <p className="text-gray-600 mb-6">
                {verification.error || 'This certificate could not be verified.'}
              </p>
              
              <p className="text-gray-500 text-sm">
                If you believe this is an error, please contact support for assistance.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 