'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import AdminLayout from '@/components/admin/AdminLayout';
import { FiUser, FiMail, FiShield, FiCalendar, FiEdit, FiSave, FiX } from 'react-icons/fi';

export default function AdminSettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Add auth headers if needed based on your auth implementation
      const headers = {
        'Content-Type': 'application/json',
        'x-user-email': user?.email, // Add this header for the backend to identify the user
      };
      
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      // Update the store with new user data
      updateUser(data.user);
      setSuccess('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError(err.message || 'An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const toggleEditing = () => {
    setEditing(!editing);
    if (!editing) {
      // Reset form data when starting to edit
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
        });
      }
    }
    // Clear messages
    setSuccess('');
    setError('');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Settings</h1>
          {!editing ? (
            <button
              onClick={toggleEditing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FiEdit className="mr-2" />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={toggleEditing}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              <FiX className="mr-2" />
              Cancel
            </button>
          )}
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {!editing ? (
            // View mode
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Admin Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiUser className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-base font-medium text-gray-900">{user?.name || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiMail className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base font-medium text-gray-900">{user?.email || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiShield className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="text-base font-medium text-gray-900">{user?.isAdmin ? 'Admin' : 'User'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiCalendar className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Account Created</p>
                    <p className="text-base font-medium text-gray-900">{formatDate(user?.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-medium mb-3">Account Security</h3>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          ) : (
            // Edit mode
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Admin Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value="Admin"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md"
                  />
                  <p className="mt-1 text-sm text-gray-500">Role cannot be changed</p>
                </div>
                
                <div className="mt-6 flex items-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-3"
                  >
                    {loading ? 'Saving...' : (
                      <>
                        <FiSave className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
        
        {/* System Information Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">System Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Application Version</h3>
                <p className="text-gray-600">v1.0.0</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Environment</h3>
                <p className="text-gray-600">Production</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Last Updated</h3>
                <p className="text-gray-600">{formatDate(new Date())}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 