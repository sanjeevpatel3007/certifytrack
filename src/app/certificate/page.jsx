'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useBatchStore } from '@/store/batchStore';
import { useTaskStore } from '@/store/taskStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiDownload, FiEye, FiLock, FiAward } from 'react-icons/fi';
import CertificateIcon from '@/components/CertificateIcon';
import Link from 'next/link';

export default function CertificatesPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();
  const { fetchUserEnrolledBatches, userBatches } = useBatchStore();
  const { fetchUserProgress } = useTaskStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [completedBatches, setCompletedBatches] = useState([]);
  const [inProgressBatches, setInProgressBatches] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      if (!isLoggedIn || !user?._id) {
        router.push('/login');
        return;
      }
      
      setIsLoading(true);
      try {
        // Load user's enrolled batches
        const batches = await fetchUserEnrolledBatches(user._id);
        
        const completed = [];
        const inProgress = [];
        
        // Check progress for each batch
        for (const enrollment of batches) {
          const batchId = enrollment.batchId?._id || enrollment.batchId;
          const batch = enrollment.batchId;
          
          if (!batch || !batchId) continue;
          
          const progressData = await fetchUserProgress(batchId, user._id);
          
          if (progressData && progressData.progress === 100) {
            completed.push({
              batchId,
              batch,
              progress: 100,
              enrollmentId: enrollment._id
            });
          } else {
            inProgress.push({
              batchId,
              batch,
              progress: progressData?.progress || 0,
              enrollmentId: enrollment._id
            });
          }
        }
        
        setCompletedBatches(completed);
        setInProgressBatches(inProgress);
      } catch (err) {
        console.error('Error loading certificates:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [isLoggedIn, user, router, fetchUserEnrolledBatches, fetchUserProgress]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
    
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Certificates</h1>
          <p className="text-gray-600 mt-2">View and download certificates for courses you've completed</p>
        </div>
        
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {!isLoading && completedBatches.length === 0 && inProgressBatches.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <FiAward className="h-16 w-16 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Certificates Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't enrolled in any courses yet or are still working on completing them.
            </p>
            <Link 
              href="/courses"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Explore Courses
            </Link>
          </div>
        )}
        
        {!isLoading && completedBatches.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Completed Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedBatches.map((item) => (
                <div key={item.batchId} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 relative">
                    <div className="absolute top-4 right-4">
                      <CertificateIcon isUnlocked={true} size="md" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.batch.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.batch.shortDescription}</p>
                    <div className="flex items-center text-sm text-green-600">
                      <FiAward className="mr-1" />
                      <span>Completed! (100%)</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white flex border-t border-gray-100">
                    <Link 
                      href={`/certificate/${item.batchId}`}
                      className="flex items-center justify-center flex-1 px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors mr-2"
                    >
                      <FiEye className="w-4 h-4 mr-1" />
                      <span>View</span>
                    </Link>
                    <Link 
                      href={`/certificate/${item.batchId}`}
                      className="flex items-center justify-center flex-1 px-3 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <FiDownload className="w-4 h-4 mr-1" />
                      <span>Download</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!isLoading && inProgressBatches.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">In Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgressBatches.map((item) => (
                <div key={item.batchId} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                  <div className="p-6 relative">
                    <div className="absolute top-4 right-4">
                      <CertificateIcon isUnlocked={false} size="md" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.batch.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.batch.shortDescription}</p>
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700">Progress</span>
                        <span className="text-xs font-medium text-gray-700">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiLock className="mr-1" />
                      <span>Complete the course to earn your certificate</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white border-t border-gray-100">
                    <Link 
                      href={`/learning/${item.batchId}`}
                      className="flex items-center justify-center w-full px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 