'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';
import toast from 'react-hot-toast';
import { FiSave, FiX, FiPlus, FiTrash, FiArrowLeft } from 'react-icons/fi';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function EditTaskPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [availableDays, setAvailableDays] = useState([]);
  const [currentDayNumber, setCurrentDayNumber] = useState(null);
  const [isLoadingDays, setIsLoadingDays] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dayNumber: '',
    batchId: '',
    contents: [],
    resources: [],
    pdfs: [],
    images: [],
    codeSnippets: [],
    isPublished: false
  });
  
  // Function to add a new content type
  const addContentType = () => {
    setFormData(prev => ({
      ...prev,
      contents: [
        ...prev.contents,
        {
          type: 'video',
          videoUrl: '',
          assignment: '',
          quiz: [],
          readingContent: '',
          projectDetails: ''
        }
      ]
    }));
  };
  
  // Function to remove a content type
  const removeContentType = (index) => {
    setFormData(prev => ({
      ...prev,
      contents: prev.contents.filter((_, i) => i !== index)
    }));
  };
  
  // Function to update a content type
  const updateContentType = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      contents: prev.contents.map((content, i) => {
        if (i === index) {
          return { ...content, [field]: value };
        }
        return content;
      })
    }));
  };
  
  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/tasks/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch task');
        }
        
        const data = await response.json();
        const task = data.task;
        
        // Set form data
        setFormData({
          ...task,
          // Convert legacy format to new format if needed
          contents: task.contents || [{
            type: task.contentType || 'video',
            videoUrl: task.videoUrl || '',
            assignment: task.assignment || '',
            quiz: task.quiz || [],
            readingContent: '',
            projectDetails: ''
          }],
          // Some fields may be null/undefined, set defaults
          resources: task.resources || [],
          pdfs: task.pdfs || [],
          images: task.images || [],
          codeSnippets: task.codeSnippets || []
        });
        
        // Set batch and day
        setSelectedBatch(task.batchId._id);
        setCurrentDayNumber(task.dayNumber);
      } catch (error) {
        console.error('Error fetching task:', error);
        toast.error('Failed to load task');
        setTimeout(() => router.push('/admin/tasks'), 1000);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTask();
  }, [id, router]);
  
  // Fetch batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch('/api/admin/batches');
        if (!response.ok) throw new Error('Failed to fetch batches');
        
        const data = await response.json();
        setBatches(data.batches || []);
      } catch (error) {
        console.error('Error fetching batches:', error);
        toast.error('Failed to load batches');
      }
    };
    
    fetchBatches();
  }, []);
  
  // Fetch available days when batch is selected or changes
  useEffect(() => {
    const fetchAvailableDays = async () => {
      if (!selectedBatch) {
        setAvailableDays([]);
        return;
      }
      
      try {
        setIsLoadingDays(true);
        const response = await fetch(`/api/admin/tasks/available-days?batchId=${selectedBatch}`);
        if (!response.ok) throw new Error('Failed to fetch available days');
        
        const data = await response.json();
        
        // If we're editing, we need to include the current day as an option
        let days = data.availableDays || [];
        if (currentDayNumber && !days.includes(currentDayNumber)) {
          days = [...days, currentDayNumber].sort((a, b) => a - b);
        }
        
        setAvailableDays(days);
        
        // Only update batchId in form data, keep the day number if it's valid
        setFormData(prev => {
          const newData = {
            ...prev,
            batchId: selectedBatch
          };
          
          // If the day is not in available days and we have current day number, use that
          if (!days.includes(prev.dayNumber) && currentDayNumber) {
            newData.dayNumber = currentDayNumber;
          } else if (days.length > 0 && !days.includes(prev.dayNumber)) {
            // Fallback to the first available day if current day is not available
            newData.dayNumber = days[0];
          }
          
          return newData;
        });
      } catch (error) {
        console.error('Error fetching available days:', error);
        toast.error('Failed to load available days');
      } finally {
        setIsLoadingDays(false);
      }
    };
    
    fetchAvailableDays();
  }, [selectedBatch, currentDayNumber]);
  
  // Handle batch selection
  const handleBatchChange = (e) => {
    const newBatchId = e.target.value;
    
    // If the batch is changing, reset the day number
    if (newBatchId !== selectedBatch) {
      setCurrentDayNumber(null);
    }
    
    setSelectedBatch(newBatchId);
  };
  
  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If dayNumber changes, update currentDayNumber
    if (name === 'dayNumber') {
      setCurrentDayNumber(parseInt(value));
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle checkbox
  const handleCheckbox = (e) => {
    setFormData({
      ...formData,
      isPublished: e.target.checked
    });
  };
  
  // Add resource
  const addResource = () => {
    const newResource = document.getElementById('resourceInput').value.trim();
    if (newResource) {
      setFormData({
        ...formData,
        resources: [...formData.resources, newResource]
      });
      document.getElementById('resourceInput').value = '';
    }
  };
  
  // Add code snippet
  const addCodeSnippet = () => {
    const newSnippet = document.getElementById('codeSnippetInput').value.trim();
    if (newSnippet) {
      setFormData({
        ...formData,
        codeSnippets: [...formData.codeSnippets, newSnippet]
      });
      document.getElementById('codeSnippetInput').value = '';
    }
  };
  
  // Remove item from array
  const removeArrayItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };
  
  // Handle image upload for PDF or image
  const handleFileUpload = async (file, field) => {
    if (!file) return;
    
    const loadingToast = toast.loading(`Uploading ${field}...`);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      
      // Add URL to appropriate array
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], data.url]
      }));
      
      toast.dismiss(loadingToast);
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} uploaded successfully`);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`Failed to upload ${field}`);
      console.error('Upload error:', error);
    }
  };
  
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
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.batchId) {
      toast.error('Please select a batch');
      return;
    }
    
    if (!formData.dayNumber) {
      toast.error('Please select a day');
      return;
    }

    if (formData.contents.length === 0) {
      toast.error('Please add at least one content type');
      return;
    }

    // Add contentType for backward compatibility
    const submissionData = {
      ...formData,
      contentType: formData.contents[0].type,
      videoUrl: formData.contents[0].type === 'video' ? formData.contents[0].videoUrl : '',
      assignment: formData.contents[0].type === 'assignment' ? formData.contents[0].assignment : '',
      quiz: formData.contents[0].type === 'quiz' ? formData.contents[0].quiz : []
    };
    
    const loadingToast = toast.loading('Updating task...');
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/admin/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task');
      }
      
      toast.dismiss(loadingToast);
      toast.success('Task updated successfully!');
      
      // Redirect to task list
      router.push('/admin/tasks');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to update task');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/admin/tasks/${id}`)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">Edit Task</h1>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
          >
            <FiTrash className="mr-2 h-4 w-4" /> Delete
          </button>
          <button
            type="button"
            onClick={() => router.push(`/admin/tasks/${id}`)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiX className="mr-2 h-4 w-4" /> Cancel
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Batch Selection */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-medium mb-4">Batch Selection</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Batch *
                  </label>
                  <select
                    value={selectedBatch}
                    onChange={handleBatchChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a batch</option>
                    {batches.map(batch => (
                      <option key={batch._id} value={batch._id}>
                        {batch.title} ({batch.courseName})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Day *
                  </label>
                  <select
                    name="dayNumber"
                    value={formData.dayNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedBatch || isLoadingDays}
                    required
                  >
                    {isLoadingDays ? (
                      <option value="">Loading available days...</option>
                    ) : !selectedBatch ? (
                      <option value="">Select a batch first</option>
                    ) : availableDays.length === 0 ? (
                      <option value="">No available days for this batch</option>
                    ) : (
                      availableDays.map(day => (
                        <option key={day} value={day}>
                          Day {day} {day === currentDayNumber ? '(Current)' : ''}
                        </option>
                      ))
                    )}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Note: Changing the day might conflict with other tasks. Only available days are shown.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Task Details */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-medium mb-4">Task Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
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
              </div>
            </div>
            
            {/* Content Types Section */}
            <div className="border-b pb-6 px-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Content Types</h2>
                <button
                  type="button"
                  onClick={addContentType}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FiPlus className="mr-2 h-4 w-4" /> Add Content Type
                </button>
              </div>

              <div className="space-y-6">
                {formData.contents.map((content, index) => (
                  <div key={index} className="border rounded-lg p-4 relative">
                    <button
                      type="button"
                      onClick={() => removeContentType(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <FiX className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content Type *
                        </label>
                        <select
                          value={content.type}
                          onChange={(e) => updateContentType(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="video">Video</option>
                          <option value="quiz">Quiz</option>
                          <option value="assignment">Assignment</option>
                          <option value="reading">Reading</option>
                          <option value="project">Project</option>
                        </select>
                      </div>

                      {content.type === 'video' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Video URL
                          </label>
                          <input
                            type="url"
                            value={content.videoUrl || ''}
                            onChange={(e) => updateContentType(index, 'videoUrl', e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      )}

                      {content.type === 'assignment' && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assignment Details
                          </label>
                          <textarea
                            value={content.assignment || ''}
                            onChange={(e) => updateContentType(index, 'assignment', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                          />
                        </div>
                      )}

                      {content.type === 'reading' && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reading Content
                          </label>
                          <textarea
                            value={content.readingContent || ''}
                            onChange={(e) => updateContentType(index, 'readingContent', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                          />
                        </div>
                      )}

                      {content.type === 'project' && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Details
                          </label>
                          <textarea
                            value={content.projectDetails || ''}
                            onChange={(e) => updateContentType(index, 'projectDetails', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {formData.contents.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    Click "Add Content Type" to add content to this task
                  </div>
                )}
              </div>
            </div>
            
            {/* Additional Content */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-medium mb-4">Additional Content</h2>
              
              {/* Resources */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resources
                </label>
                <div className="flex mb-2">
                  <input
                    type="url"
                    id="resourceInput"
                    placeholder="https://example.com/resource"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addResource}
                    className="px-4 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-r-md hover:bg-gray-100"
                  >
                    <FiPlus className="h-5 w-5" />
                  </button>
                </div>
                
                {formData.resources.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {formData.resources.map((resource, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                        <a 
                          href={resource} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm truncate"
                        >
                          {resource}
                        </a>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('resources', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Code Snippets */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code Snippets
                </label>
                <div className="flex mb-2">
                  <textarea
                    id="codeSnippetInput"
                    placeholder="Paste your code snippet here..."
                    rows="3"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  ></textarea>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={addCodeSnippet}
                      className="h-full px-4 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-tr-md hover:bg-gray-100"
                    >
                      <FiPlus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {formData.codeSnippets.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {formData.codeSnippets.map((snippet, index) => (
                      <div key={index} className="relative">
                        <pre className="bg-gray-800 text-white p-3 rounded-md text-sm overflow-x-auto">
                          <code>{snippet}</code>
                        </pre>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('codeSnippets', index)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        >
                          <FiTrash className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* PDFs */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDFs
                </label>
                <div className="mb-2">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'pdfs')}
                    className="block w-full text-sm text-gray-500 
                              file:mr-4 file:py-2 file:px-4 
                              file:rounded-md file:border-0
                              file:text-sm file:font-medium
                              file:bg-blue-50 file:text-blue-700
                              hover:file:bg-blue-100"
                  />
                </div>
                
                {formData.pdfs.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {formData.pdfs.map((pdf, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                        <a 
                          href={pdf} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm truncate flex-1"
                        >
                          {pdf.split('/').pop()}
                        </a>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('pdfs', index)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <FiTrash className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Images */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Task image ${index + 1}`} 
                        className="w-full h-40 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('images', index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiTrash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div>
                    <ImageUploader
                      initialImage=""
                      onImageChange={(image) => {
                        if (image) {
                          setFormData({
                            ...formData,
                            images: [...formData.images, image]
                          });
                        }
                      }}
                      label="Add Image"
                      height="160px"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Publication Settings */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={handleCheckbox}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Publish task</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                If unchecked, the task will be saved as a draft and won't be visible to students.
              </p>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 text-right">
            <button
              type="submit"
              disabled={isSubmitting || !selectedBatch || !formData.dayNumber}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              <FiSave className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
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