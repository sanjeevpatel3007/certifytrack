'use client';

import { useState, useEffect, useRef } from 'react';
import { FiUpload, FiX, FiPaperclip, FiLink, FiSave, FiRefreshCw } from 'react-icons/fi';
import { useSubmissionStore } from '@/store/submissionStore';
import { uploadFile } from '@/lib/submissionUtils';
import toast from 'react-hot-toast';

export default function TaskSubmission({ task, user, batchId, onSubmitComplete }) {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ url: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const fileInputRef = useRef(null);
  
  const { 
    fetchUserSubmissions, 
    createSubmission, 
    updateSubmission, 
    isLoading 
  } = useSubmissionStore();
  
  // Fetch any existing submission for this task
  useEffect(() => {
    const getExistingSubmission = async () => {
      if (!task?._id || !user?._id) return;
      
      const submissions = await fetchUserSubmissions({
        userId: user._id,
        taskId: task._id
      });
      
      if (submissions.length > 0) {
        const submission = submissions[0];
        setExistingSubmission(submission);
        setContent(submission.content || '');
        setFiles(submission.files || []);
        setLinks(submission.links || []);
      }
    };
    
    getExistingSubmission();
  }, [task, user, fetchUserSubmissions]);
  
  // Handler for file upload button click
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handler for file input change
  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    
    // Show loading toast
    const loadingToast = toast.loading(`Uploading ${selectedFiles.length} file(s)...`);
    
    try {
      for (const file of selectedFiles) {
        try {
          // Upload each file individually
          const uploadedFile = await uploadFile(file);
          
          // Add to files state if upload was successful
          if (uploadedFile) {
            setFiles(prevFiles => [...prevFiles, uploadedFile]);
          }
        } catch (fileError) {
          console.error(`Error uploading file ${file.name}:`, fileError);
          // Continue with other files even if one fails
        }
      }
      
      toast.success(`Uploaded files successfully`, { id: loadingToast });
    } catch (error) {
      console.error('Error in handleFileChange:', error);
      toast.error('There was a problem uploading one or more files', { id: loadingToast });
    } finally {
      // Dismiss loading toast if it's still showing
      toast.dismiss(loadingToast);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Handler for removing a file
  const handleRemoveFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  // Handler for adding a link
  const handleAddLink = () => {
    if (!newLink.url.trim()) {
      toast.error('Please enter a URL');
      return;
    }
    
    setLinks(prevLinks => [...prevLinks, { ...newLink }]);
    setNewLink({ url: '', description: '' });
  };
  
  // Handler for removing a link
  const handleRemoveLink = (index) => {
    setLinks(prevLinks => prevLinks.filter((_, i) => i !== index));
  };
  
  // Handler for submitting the task
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // Validate files to ensure correct structure
      const validatedFiles = files.map(file => ({
        url: file.url || '',
        name: file.name || 'Unnamed file',
        type: file.type || 'unknown',
        size: typeof file.size === 'number' ? file.size : 0,
        publicId: file.publicId || ''
      }));
      
      // Validate links to ensure correct structure
      const validatedLinks = links.map(link => ({
        url: link.url || '',
        description: link.description || ''
      }));
      
      // Check if files are properly formatted
      if (validatedFiles.length > 0) {
        console.log('Submitting task with files:', validatedFiles);
      }
      
      const submissionData = {
        taskId: task._id,
        userId: user._id,
        batchId,
        content: content || '',
        files: validatedFiles,
        links: validatedLinks
      };
      
      let result;
      
      if (existingSubmission) {
        // Update existing submission
        result = await updateSubmission(existingSubmission._id, submissionData);
      } else {
        // Create new submission
        result = await createSubmission(submissionData);
      }
      
      if (result) {
        toast.success(existingSubmission ? 'Submission updated successfully!' : 'Task submitted successfully!');
        setExistingSubmission(result);
        onSubmitComplete?.(result);
      } else {
        toast.error('Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error(`Failed to submit task: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {existingSubmission ? 'Update Your Submission' : 'Submit Your Work'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        {/* Content text area */}
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe your work or add any notes about your submission..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
          />
        </div>
        
        {/* File uploads */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Files
          </label>
          
          <div className="space-y-2">
            {/* List of uploaded files */}
            {files.length > 0 && (
              <ul className="space-y-2 mb-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <FiPaperclip className="text-gray-500 flex-shrink-0" />
                      <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        {file.name}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            
            {/* File upload button */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              <button
                type="button"
                onClick={handleFileButtonClick}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
              >
                <FiUpload />
                <span>Upload File</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Links */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Links
          </label>
          
          <div className="space-y-2">
            {/* List of added links */}
            {links.length > 0 && (
              <ul className="space-y-2 mb-2">
                {links.map((link, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <FiLink className="text-gray-500 flex-shrink-0" />
                      <div className="overflow-hidden">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate block"
                        >
                          {link.url}
                        </a>
                        {link.description && (
                          <span className="text-sm text-gray-500 truncate block">
                            {link.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            
            {/* Add link form */}
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <label htmlFor="link-url" className="block text-xs font-medium text-gray-500 mb-1">
                  URL
                </label>
                <input
                  id="link-url"
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="link-description" className="block text-xs font-medium text-gray-500 mb-1">
                  Description (Optional)
                </label>
                <input
                  id="link-description"
                  type="text"
                  value={newLink.description}
                  onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                  placeholder="Description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddLink}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        
        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className={`flex items-center space-x-2 px-4 py-2 ${
              existingSubmission ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              existingSubmission ? 'focus:ring-green-500' : 'focus:ring-blue-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting || isLoading ? (
              <>
                <FiRefreshCw className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : existingSubmission ? (
              <>
                <FiSave />
                <span>Update Submission</span>
              </>
            ) : (
              <>
                <FiUpload />
                <span>Submit Task</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 