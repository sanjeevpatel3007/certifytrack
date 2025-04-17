'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';
import toast from 'react-hot-toast';
import { FiSave, FiX, FiTrash2 } from 'react-icons/fi';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function EditBatchPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseName: '',
    startDate: '',
    bannerImage: '',
    durationDays: '',
    whatYouLearn: [],
    prerequisites: [],
    benefits: [],
    isActive: true,
    instructor: '',
    price: '0',
    maxStudents: ''
  });
  
  // Fetch batch data
  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const response = await fetch(`/api/admin/batches/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch batch');
        }
        
        const data = await response.json();
        
        // Format the date to YYYY-MM-DD
        const formattedDate = data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '';
        
        setFormData({
          ...data,
          startDate: formattedDate,
          durationDays: data.durationDays.toString(),
          price: data.price.toString(),
          maxStudents: data.maxStudents.toString(),
          whatYouLearn: Array.isArray(data.whatYouLearn) ? data.whatYouLearn : [],
          prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites : [],
          benefits: Array.isArray(data.benefits) ? data.benefits : []
        });
        
        setIsLoading(false);
      } catch (err) {
        toast.error(err.message || 'Error loading batch');
        console.error('Fetch error:', err);
        router.push('/admin/batches');
      }
    };
    
    fetchBatch();
  }, [id, router]);
  
  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle checkbox
  const handleCheckbox = (e) => {
    setFormData({
      ...formData,
      isActive: e.target.checked
    });
  };
  
  // Handle comma-separated list inputs
  const handleListInput = (e, field) => {
    const items = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData({
      ...formData,
      [field]: items
    });
  };
  
  // Handle image URL change from ImageUploader
  const handleImageChange = (imageUrl) => {
    setFormData({
      ...formData,
      bannerImage: imageUrl
    });
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.bannerImage) {
      toast.error('Please upload a banner image');
      return;
    }
    
    const loadingToast = toast.loading('Updating batch...');
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/admin/batches/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          durationDays: parseInt(formData.durationDays, 10),
          price: parseFloat(formData.price),
          maxStudents: parseInt(formData.maxStudents, 10)
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update batch');
      }
      
      toast.dismiss(loadingToast);
      toast.success('Batch updated successfully!');
      
      setTimeout(() => {
        router.push('/admin/batches');
      }, 1000);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || 'Failed to update batch');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Delete batch
  const handleDelete = async () => {
    const loadingToast = toast.loading('Deleting batch...');
    
    try {
      const response = await fetch(`/api/admin/batches/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete batch');
      }
      
      toast.dismiss(loadingToast);
      toast.success('Batch deleted successfully!');
      
      setTimeout(() => {
        router.push('/admin/batches');
      }, 1000);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || 'Failed to delete batch');
      console.error('Delete error:', err);
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
  
  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Batch</h1>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
          >
            <FiTrash2 className="mr-2 h-4 w-4" /> Delete
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/batches')}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiX className="mr-2 h-4 w-4" /> Cancel
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="border-b pb-6">
              <h2 className="text-lg font-medium mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="border-b pb-6">
              <h2 className="text-lg font-medium mb-4">Course Details</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (Days) *
                  </label>
                  <input
                    type="number"
                    name="durationDays"
                    value={formData.durationDays}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Students *
                  </label>
                  <input
                    type="number"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="border-b pb-6">
              <h2 className="text-lg font-medium mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor *
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (0 for free)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image *
                </label>
                <ImageUploader 
                  initialImage={formData.bannerImage}
                  onImageChange={handleImageChange}
                  required={true}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What You'll Learn (comma-separated)
                </label>
                <textarea
                  value={formData.whatYouLearn.join(', ')}
                  onChange={(e) => handleListInput(e, 'whatYouLearn')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="e.g. Programming fundamentals, Web development, Database design"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prerequisites (comma-separated)
                </label>
                <textarea
                  value={formData.prerequisites.join(', ')}
                  onChange={(e) => handleListInput(e, 'prerequisites')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="e.g. Basic computer knowledge, Internet connection"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits (comma-separated)
                </label>
                <textarea
                  value={formData.benefits.join(', ')}
                  onChange={(e) => handleListInput(e, 'benefits')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="e.g. Career advancement, Skill development, Industry recognition"
                ></textarea>
              </div>
            </div>
          
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleCheckbox}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active Batch</span>
              </label>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              <FiSave className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Updating...' : 'Update Batch'}
            </button>
          </div>
        </form>
      </div>
      
      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Batch"
          message="Are you sure you want to delete this batch? This action cannot be undone."
          confirmLabel="Delete"
          confirmVariant="danger"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </AdminLayout>
  );
} 