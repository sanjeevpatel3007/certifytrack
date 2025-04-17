'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [taskToDelete, setTaskToDelete] = useState(null);
  
  // Fetch tasks and batches on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all batches for filter dropdown
        const batchesResponse = await fetch('/api/admin/batches');
        if (!batchesResponse.ok) throw new Error('Failed to fetch batches');
        const batchesData = await batchesResponse.json();
        
        // Fetch tasks
        const tasksUrl = selectedBatch 
          ? `/api/admin/tasks?batchId=${selectedBatch}` 
          : '/api/admin/tasks';
          
        const tasksResponse = await fetch(tasksUrl);
        if (!tasksResponse.ok) throw new Error('Failed to fetch tasks');
        const tasksData = await tasksResponse.json();
        
        setBatches(batchesData.batches || []);
        setTasks(tasksData.tasks || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedBatch]);
  
  // Filter tasks by batch
  const handleBatchChange = (e) => {
    setSelectedBatch(e.target.value);
  };
  
  // Delete task
  const deleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      const response = await fetch(`/api/admin/tasks/${taskToDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete task');
      }
      
      // Remove task from list
      setTasks(tasks.filter(task => task._id !== taskToDelete));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(error.message || 'Failed to delete task');
    } finally {
      setTaskToDelete(null);
    }
  };
  
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
  
  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks Management</h1>
        <button
          onClick={() => router.push('/admin/tasks/create')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <FiPlus className="h-5 w-5" />
          <span>Create Task</span>
        </button>
      </div>
      
      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            <span className="font-medium">Filter:</span>
          </div>
          
          <div className="flex-1">
            <select
              value={selectedBatch}
              onChange={handleBatchChange}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Batches</option>
              {batches.map(batch => (
                <option key={batch._id} value={batch._id}>
                  {batch.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Tasks List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-4">No tasks found</p>
          <button
            onClick={() => router.push('/admin/tasks/create')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FiPlus className="h-5 w-5" />
            <span>Create First Task</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map(task => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {task.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {task.description.substring(0, 100)}
                        {task.description.length > 100 ? '...' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {task.batchId?.title || 'Unknown Batch'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {task.batchId?.courseName || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Day {task.dayNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getContentTypeClass(task.contentType)}`}>
                        {task.contentType.charAt(0).toUpperCase() + task.contentType.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${task.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {task.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => router.push(`/admin/tasks/${task._id}`)}
                          className="text-gray-500 hover:text-blue-600"
                          title="View task"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/tasks/${task._id}/edit`)}
                          className="text-gray-500 hover:text-green-600"
                          title="Edit task"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => setTaskToDelete(task._id)}
                          className="text-gray-500 hover:text-red-600"
                          title="Delete task"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      {taskToDelete && (
        <ConfirmDialog
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmLabel="Delete"
          confirmVariant="danger"
          onConfirm={deleteTask}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
    </AdminLayout>
  );
} 