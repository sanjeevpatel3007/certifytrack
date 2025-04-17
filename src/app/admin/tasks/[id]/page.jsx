'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { FiArrowLeft, FiEdit, FiTrash2, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function ViewTaskPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/admin/tasks/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch task');
        }
        
        const data = await response.json();
        setTask(data.task);
      } catch (error) {
        console.error('Error fetching task:', error);
        toast.error('Failed to load task');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTask();
  }, [id]);
  
  // Delete task
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete task');
      }
      
      toast.success('Task deleted successfully');
      
      // Redirect to tasks list
      setTimeout(() => {
        router.push('/admin/tasks');
      }, 1000);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(error.message || 'Failed to delete task');
      setShowDeleteConfirm(false);
    }
  };
  
  // Get color class for content type
  const getContentTypeClass = (contentType) => {
    switch (contentType) {
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'quiz':
        return 'bg-blue-100 text-blue-800';
      case 'assignment':
        return 'bg-green-100 text-green-800';
      case 'reading':
        return 'bg-yellow-100 text-yellow-800';
      case 'project':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!task) {
    return (
      <AdminLayout>
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-red-500 mb-4">Task not found</p>
          <button
            onClick={() => router.push('/admin/tasks')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
            <span>Back to Tasks</span>
          </button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/tasks')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">{task.title}</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/admin/tasks/${id}/edit`)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FiEdit className="h-5 w-5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FiTrash2 className="h-5 w-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Task Header */}
        <div className="p-6 border-b">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-500">Batch:</span>
                <span className="font-medium">{task.batchId?.title || 'Unknown Batch'}</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-500">Course:</span>
                <span className="font-medium">{task.batchId?.courseName || 'Unknown Course'}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                Day {task.dayNumber}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getContentTypeClass(task.contentType)}`}>
                {task.contentType.charAt(0).toUpperCase() + task.contentType.slice(1)}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${task.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {task.isPublished ? 'Published' : 'Draft'}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{task.description}</p>
          </div>
        </div>
        
        {/* Task Content */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium mb-4">Content</h2>
          
          {task.contentType === 'video' && task.videoUrl && (
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Video</h3>
              <div className="flex items-center gap-2">
                <a
                  href={task.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-2"
                >
                  <span>{task.videoUrl}</span>
                  <FiExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
          
          {task.contentType === 'assignment' && task.assignment && (
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Assignment</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-line">{task.assignment}</p>
              </div>
            </div>
          )}
          
          {/* Resources */}
          {task.resources && task.resources.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Resources</h3>
              <ul className="space-y-1">
                {task.resources.map((resource, index) => (
                  <li key={index} className="bg-gray-50 p-3 rounded-md">
                    <a
                      href={resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <span className="truncate">{resource}</span>
                      <FiExternalLink className="h-4 w-4 flex-shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Code Snippets */}
          {task.codeSnippets && task.codeSnippets.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Code Snippets</h3>
              <div className="space-y-3">
                {task.codeSnippets.map((snippet, index) => (
                  <div key={index} className="bg-gray-800 text-white p-4 rounded-md">
                    <pre className="overflow-x-auto whitespace-pre-wrap break-words">
                      <code>{snippet}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Attachments */}
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Attachments</h2>
          
          {/* PDFs */}
          {task.pdfs && task.pdfs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">PDFs</h3>
              <ul className="space-y-2">
                {task.pdfs.map((pdf, index) => (
                  <li key={index} className="bg-gray-50 p-3 rounded-md flex items-center justify-between">
                    <span className="text-gray-700">{pdf.split('/').pop()}</span>
                    <a
                      href={pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>View</span>
                      <FiExternalLink className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Images */}
          {task.images && task.images.length > 0 && (
            <div>
              <h3 className="text-md font-medium mb-2">Images</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {task.images.map((image, index) => (
                  <div key={index} className="bg-gray-100 rounded-md overflow-hidden">
                    <a href={image} target="_blank" rel="noopener noreferrer">
                      <img 
                        src={image} 
                        alt={`Task image ${index + 1}`} 
                        className="w-full h-48 object-cover hover:opacity-80 transition-opacity"
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {(!task.pdfs || task.pdfs.length === 0) && 
           (!task.images || task.images.length === 0) && (
            <p className="text-gray-500 italic">No attachments for this task</p>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmLabel="Delete"
          confirmVariant="danger"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </AdminLayout>
  );
} 