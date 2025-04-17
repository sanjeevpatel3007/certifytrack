'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBatches: 0,
    activeBatches: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch batches
        const batchesRes = await fetch('/api/admin/batches');
        const batchesData = await batchesRes.json();
        
        // Fetch users
        const usersRes = await fetch('/api/admin/users');
        const usersData = await usersRes.json();
        
        setStats({
          totalBatches: batchesData.batches?.length || 0,
          activeBatches: batchesData.batches?.filter(b => b.isActive)?.length || 0,
          totalUsers: usersData.users?.length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <p className="text-lg">Loading stats...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Total Batches" value={stats.totalBatches} bgColor="bg-blue-500" />
          <StatsCard title="Active Batches" value={stats.activeBatches} bgColor="bg-green-500" />
          <StatsCard title="Total Users" value={stats.totalUsers} bgColor="bg-purple-500" />
        </div>
      )}
      
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard 
            title="Create New Batch" 
            description="Add a new batch with details and assign an instructor" 
            link="/admin/batches/create" 
          />
          <QuickActionCard 
            title="Manage Batches" 
            description="View, edit or delete existing batches" 
            link="/admin/batches" 
          />
          <QuickActionCard 
            title="Manage Users" 
            description="View and manage user accounts" 
            link="/admin/users" 
          />
        </div>
      </div>
    </AdminLayout>
  );
}

function StatsCard({ title, value, bgColor }) {
  return (
    <div className={`${bgColor} text-white rounded-lg shadow-md p-6`}>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function QuickActionCard({ title, description, link }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <a 
        href={link} 
        className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        Go to {title}
      </a>
    </div>
  );
}
