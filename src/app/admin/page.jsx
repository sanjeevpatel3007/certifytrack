'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  FiHome, 
  FiUsers, 
  FiActivity, 
  FiCheckCircle, 
  FiGrid,
  FiBookOpen,
  FiPlusCircle,
  FiFileText,
  FiUserCheck,
  FiPieChart,
  FiTrendingUp
} from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBatches: 0,
    activeBatches: 0,
    totalUsers: 0,
    pendingSubmissions: 0
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
          totalUsers: usersData.users?.length || 0,
          pendingSubmissions: 12 // Mock data
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome to the admin dashboard</p>
          </div>
          <Link 
            href="/" 
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FiHome className="mr-2" />
            <span>Go to Main Website</span>
          </Link>
        </div>
      
      {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
            </div>
        </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Users" 
              value={stats.totalUsers} 
              icon={<FiUsers className="text-indigo-500" size={24} />} 
              trend="+12%"
              trendUp={true}
              bgColor="bg-indigo-50" 
              textColor="text-indigo-700"
            />
            <StatsCard 
              title="Total Batches" 
              value={stats.totalBatches} 
              icon={<FiGrid className="text-emerald-500" size={24} />} 
              trend="+5%"
              trendUp={true}
              bgColor="bg-emerald-50" 
              textColor="text-emerald-700"
            />
            <StatsCard 
              title="Active Batches" 
              value={stats.activeBatches} 
              icon={<FiActivity className="text-amber-500" size={24} />} 
              trend="+2%"
              trendUp={true}
              bgColor="bg-amber-50" 
              textColor="text-amber-700"
            />
            <StatsCard 
              title="Pending Submissions" 
              value={stats.pendingSubmissions} 
              icon={<FiFileText className="text-rose-500" size={24} />} 
              trend="-8%"
              trendUp={false}
              bgColor="bg-rose-50" 
              textColor="text-rose-700"
            />
        </div>
      )}
      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Activity Overview</h2>
              <div className="flex items-center gap-2">
                <span className="flex items-center text-xs text-slate-500">
                  <span className="w-3 h-3 rounded-full bg-indigo-500 mr-1"></span>
                  <span>Enrollments</span>
                </span>
                <span className="flex items-center text-xs text-slate-500">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 mr-1"></span>
                  <span>Submissions</span>
                </span>
              </div>
            </div>
            <div className="h-60 w-full bg-slate-50 rounded-lg flex items-center justify-center">
              <FiPieChart size={48} className="text-slate-300" />
              <span className="ml-3 text-slate-400">Activity chart will be displayed here</span>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <ActivityItem 
                icon={<FiUserCheck className="text-indigo-500" />}
                title="New user enrolled"
                time="5 minutes ago"
                description="John Doe enrolled in JavaScript Basics"
              />
              <ActivityItem 
                icon={<FiFileText className="text-emerald-500" />}
                title="New submission"
                time="1 hour ago"
                description="Task #3 submitted by Jane Smith"
              />
              <ActivityItem 
                icon={<FiCheckCircle className="text-amber-500" />}
                title="Task approved"
                time="3 hours ago"
                description="Task #2 approved for Mike Johnson"
              />
              <ActivityItem 
                icon={<FiPlusCircle className="text-rose-500" />}
                title="New batch created"
                time="Yesterday"
                description="Web Development - Batch #4"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <QuickActionCard 
            title="Create New Batch" 
            description="Add a new batch with details and assign an instructor" 
            link="/admin/batches/create" 
              icon={<FiPlusCircle size={18} />}
          />
          <QuickActionCard 
            title="Manage Batches" 
            description="View, edit or delete existing batches" 
            link="/admin/batches" 
              icon={<FiBookOpen size={18} />}
          />
          <QuickActionCard 
            title="Manage Users" 
            description="View and manage user accounts" 
            link="/admin/users" 
              icon={<FiUsers size={18} />}
          />
          <QuickActionCard 
            title="Review Submissions" 
            description="Review, approve or reject user task submissions" 
            link="/admin/submissions" 
              icon={<FiCheckCircle size={18} />}
          />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatsCard({ title, value, icon, trend, trendUp, bgColor, textColor }) {
  return (
    <div className={`rounded-xl shadow-sm border border-slate-200 bg-white p-6`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value.toLocaleString()}</h3>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'} flex items-center`}>
          {trendUp ? <FiTrendingUp className="mr-1" size={14} /> : <FiTrendingUp className="mr-1 transform rotate-180" size={14} />}
          {trend}
        </span>
        <span className="text-xs text-slate-500 ml-2">vs last month</span>
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, time, description }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="p-2 rounded-full bg-slate-100 mt-0.5">
        {icon}
      </div>
      <div>
        <div className="flex items-center">
          <h4 className="font-medium text-slate-800">{title}</h4>
          <span className="ml-2 text-xs text-slate-500">{time}</span>
        </div>
        <p className="text-sm text-slate-600 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function QuickActionCard({ title, description, link, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-3">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 mr-3">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      </div>
      <p className="text-sm text-slate-600 mb-4">{description}</p>
      <Link 
        href={link} 
        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        Go to {title}
        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </Link>
    </div>
  );
}
