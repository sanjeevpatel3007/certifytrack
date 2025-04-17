'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

export default function BatchDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const response = await fetch(`/api/admin/batches/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch batch');
        }
        
        const data = await response.json();
        setBatch(data.batch);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching batch:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBatch();
  }, [id]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this batch?')) {
      try {
        const response = await fetch(`/api/admin/batches/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete batch');
        }
        
        router.push('/admin/batches');
      } catch (err) {
        alert('Error deleting batch: ' + err.message);
        console.error('Error deleting batch:', err);
      }
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading batch data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </AdminLayout>
    );
  }

  if (!batch) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <p className="text-lg mb-4">Batch not found</p>
          <Link
            href="/admin/batches"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Batches
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Batch Details</h1>
        <div className="flex space-x-2">
          <Link
            href="/admin/batches"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Back to List
          </Link>
          <Link
            href={`/admin/batches/${id}/edit`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Batch
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="relative h-56 bg-gray-200">
          <img
            src={batch.bannerImage || '/placeholder.png'}
            alt={batch.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
            <h2 className="text-2xl font-bold">{batch.title}</h2>
            <p className="text-sm opacity-90">{batch.courseName}</p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Instructor</span>
              <span className="font-medium">{batch.instructor}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Start Date</span>
              <span className="font-medium">{formatDate(batch.startDate)}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Duration</span>
              <span className="font-medium">{batch.durationDays} days</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Status</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                batch.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {batch.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Price</span>
              <span className="font-medium">
                {batch.price > 0 ? `$${batch.price.toFixed(2)}` : 'Free'}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Max Students</span>
              <span className="font-medium">{batch.maxStudents}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{batch.description}</p>
          </div>

          {batch.whatYouLearn && batch.whatYouLearn.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">What You'll Learn</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {batch.whatYouLearn.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {batch.prerequisites && batch.prerequisites.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Prerequisites</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {batch.prerequisites.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {batch.benefits && batch.benefits.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Benefits</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {batch.benefits.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-sm text-gray-500">
            <div>
              <span>Created: {formatDate(batch.createdAt)}</span>
            </div>
            <div className="text-right">
              <span>Last Updated: {formatDate(batch.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 