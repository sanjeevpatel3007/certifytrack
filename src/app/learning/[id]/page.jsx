'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useBatchStore } from '@/store/batchStore';
import { useTaskStore } from '@/store/taskStore';
import Navbar from '@/components/Navbar';
import TaskSidebar from '@/components/learning/TaskSidebar';
import TaskContent from '@/components/learning/TaskContent';
import ProgressSummary from '@/components/learning/ProgressSummary';
import Footer from '@/components/Footer';
import { use } from 'react';
import { fetchLearningPageData, selectInitialTask, handleLearningError } from '@/lib/learningUtils';
import LearningPageLoadingSkeleton from '@/components/Loading/Learning-page-loading';
export default function LearningPage({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const batchId = unwrappedParams.id;
  
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();
  
  // Batch state
  const { 
    currentBatch: batch,
    setBatch,
    clearBatchData
  } = useBatchStore();
  
  // Task state
  const { 
    tasks, 
    tasksByDay,
    currentTask,
    completedTasks,
    userProgress,
    isLoading: tasksLoading,
    error,
    setTasks,
    setTasksByDay,
    setCurrentTask,
    setCompletedTasks,
    setUserProgress,
    toggleTaskCompletion,
    clearTaskData
  } = useTaskStore();
  
  // Local state
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Avoid multiple initializations
    if (isInitialized) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      console.log("Learning page initialization started");
      
      try {
        // Skip authentication check if there's no user yet
        if (!isLoggedIn || !user || !user._id) {
          console.log("User not logged in or user data not available yet");
          setIsLoading(false);
          return;
        }
        
        console.log(`Fetching learning page data for batch: ${batchId}, user: ${user._id}`);
        
        // Try to retrieve data from sessionStorage first
        const cachedData = sessionStorage.getItem(`learning_${batchId}_${user._id}`);
        if (cachedData) {
          try {
            const parsedData = JSON.parse(cachedData);
            console.log("Retrieved cached learning data from sessionStorage");
            
            // Check if the cached data is still valid (not too old)
            const cacheTime = parsedData.timestamp || 0;
            const currentTime = new Date().getTime();
            const cacheMaxAge = 30 * 60 * 1000; // 30 minutes
            
            if (currentTime - cacheTime < cacheMaxAge) {
              // Set enrollment data from cache
              setIsEnrolled(true);
              setEnrollment(parsedData.enrollment);
              
              // Set batch data from cache
              setBatch(parsedData.batch);
              
              // Set task data from cache
              setTasks(parsedData.tasks);
              setTasksByDay(parsedData.tasksByDay);
              setCompletedTasks(parsedData.progress.completedTasks || []);
              setUserProgress(parsedData.progress.progress || 0);
              
              // Select initial task from cache
              if (parsedData.tasks && parsedData.tasks.length > 0 && !currentTask) {
                const initialTask = selectInitialTask(parsedData.tasks, parsedData.progress);
                setCurrentTask(initialTask);
              }
              
              setIsInitialized(true);
              setIsLoading(false);
              
              // Also fetch fresh data in the background
              fetchFreshData();
              return;
            } else {
              console.log("Cached data expired, fetching fresh data");
            }
          } catch (e) {
            console.error("Error parsing cached data, fetching fresh data", e);
          }
        }
        
        // Fetch fresh data if no valid cache exists
        fetchFreshData();
      } catch (error) {
        console.error('Error loading learning page:', error);
        handleLearningError(error);
        setIsLoading(false);
      }
    };
    
    // Function to fetch fresh data from API
    const fetchFreshData = async () => {
      try {
        // Use the new utility function to fetch all data at once
        const result = await fetchLearningPageData(batchId, user._id);
        
        // Handle errors or redirects
        if (!result.success) {
          console.error("Error loading learning page:", result.error);
          toast.error(result.error || 'Failed to load course content');
          
          if (result.redirectTo) {
            console.log(`Redirecting to: ${result.redirectTo}`);
            router.push(result.redirectTo);
          }
          
          setIsLoading(false);
          return;
        }
        
        // Set enrollment data
        setIsEnrolled(true);
        setEnrollment(result.enrollment);
        
        // Set batch data
        setBatch(result.batch);
        
        // Set task data
        setTasks(result.tasks);
        setTasksByDay(result.tasksByDay);
        setCompletedTasks(result.progress.completedTasks || []);
        setUserProgress(result.progress.progress || 0);
        
        // Select initial task
        if (result.tasks && result.tasks.length > 0 && !currentTask) {
          const initialTask = selectInitialTask(result.tasks, result.progress);
          setCurrentTask(initialTask);
        }
        
        // Cache the data in sessionStorage with timestamp
        const cacheData = {
          ...result,
          timestamp: new Date().getTime()
        };
        sessionStorage.setItem(
          `learning_${batchId}_${user._id}`, 
          JSON.stringify(cacheData)
        );
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error fetching fresh learning page data:', error);
        handleLearningError(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Cleanup on unmount
    return () => {
      clearBatchData();
      clearTaskData();
    };
  }, [
    batchId, 
    isLoggedIn, 
    user, 
    router, 
    clearBatchData,
    clearTaskData,
    currentTask,
    isInitialized,
    setBatch,
    setTasks,
    setTasksByDay,
    setCurrentTask,
    setCompletedTasks,
    setUserProgress
  ]);
  
  const handleTaskSelect = (task) => {
    setCurrentTask(task);
    // Scroll to top on mobile when selecting a task
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleTaskCompletion = async (isCompleted) => {
    if (!currentTask) return false;
    
    try {
      const success = await toggleTaskCompletion(currentTask._id, user._id, isCompleted);
      
      if (success) {
        if (isCompleted) {
          toast.success('Task marked as completed!');
        } else {
          toast.success('Task marked as incomplete');
        }
        
        // Update the cached data in sessionStorage
        const cachedDataKey = `learning_${batchId}_${user._id}`;
        const cachedData = sessionStorage.getItem(cachedDataKey);
        
        if (cachedData) {
          try {
            const parsedData = JSON.parse(cachedData);
            
            // Update completedTasks in the cached progress data
            if (parsedData.progress) {
              if (isCompleted) {
                // Add task to completedTasks if not already there
                if (!parsedData.progress.completedTasks.includes(currentTask._id)) {
                  parsedData.progress.completedTasks.push(currentTask._id);
                }
              } else {
                // Remove task from completedTasks
                parsedData.progress.completedTasks = parsedData.progress.completedTasks.filter(
                  id => id !== currentTask._id
                );
              }
              
              // Update progress percentage
              if (parsedData.tasks && parsedData.tasks.length > 0) {
                parsedData.progress.progress = Math.round(
                  (parsedData.progress.completedTasks.length / parsedData.tasks.length) * 100
                );
              }
              
              // Update the timestamp
              parsedData.timestamp = new Date().getTime();
              
              // Save updated data back to sessionStorage
              sessionStorage.setItem(cachedDataKey, JSON.stringify(parsedData));
            }
          } catch (e) {
            console.error("Error updating cached task completion data", e);
          }
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error updating task completion:', error);
      toast.error('Failed to update task status');
      return false;
    }
  };
  
  // Show loading indicator while checking auth or fetching initial data
  if (isLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LearningPageLoadingSkeleton />
      </div>
    );
  }
  
  // Only show the login error if we're certain the user is not logged in
  if (!isLoggedIn && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Authentication Required</h1>
            <p className="text-lg text-gray-600 mb-8">Please log in to access your course content.</p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Error Loading Course</h1>
            <p className="text-lg text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => router.push('/courses')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Courses
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Only show "Course Not Found" if we've already tried to fetch data (isInitialized) and no batch was found
  if (!batch && isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Course Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">The course you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/courses')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Courses
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // If we haven't initialized yet and don't have batch data, show loading
  if (!batch && !isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-700">Loading course content...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // If the user is not enrolled, redirect to the batch page
  if (!isEnrolled && isInitialized) {
    router.push(`/batch/${batchId}`);
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{batch.title}</h1>
          <p className="text-lg text-gray-600">{batch.courseName}</p>
        </div>
        
        {/* Progress summary */}
        <ProgressSummary 
          batch={batch}
          progress={userProgress}
          completedTasksCount={completedTasks.length}
          totalTasksCount={tasks.length}
          tasksByDay={tasksByDay}
        />
       

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Task sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <TaskSidebar
              days={tasksByDay}
              completedTasks={completedTasks}
              currentTaskId={currentTask?._id}
              onSelectTask={handleTaskSelect}
            />
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <TaskContent
              task={currentTask}
              isCompleted={currentTask ? completedTasks.includes(currentTask._id) : false}
              onToggleComplete={handleTaskCompletion}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 