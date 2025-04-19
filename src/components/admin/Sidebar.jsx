'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiUsers, 
  FiBookOpen, 
  FiPlus,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiChevronDown,
  FiCheckSquare
} from 'react-icons/fi';
import { useState } from 'react';
import { logoutUser } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [batchesOpen, setBatchesOpen] = useState(true);
  const [tasksOpen, setTasksOpen] = useState(true);
  
  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleBatches = () => setBatchesOpen(!batchesOpen);
  const toggleTasks = () => setTasksOpen(!tasksOpen);
  
  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };
  
  const isActive = (path) => {
    return pathname === path ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-blue-800 hover:text-white';
  };
  
  return (
    <div className={`bg-gradient-to-b from-blue-900 to-blue-950 text-white ${collapsed ? 'w-20' : 'w-64'} min-h-screen transition-all duration-300 p-4 relative`}>
      {/* Collapse toggle button */}
      <button 
        onClick={toggleSidebar}
        className="absolute right-0 top-5 bg-blue-800 p-1 rounded-l-md hover:bg-blue-700 transition-colors z-10"
      >
        <FiMenu size={18} />
      </button>
      
      <div className="flex items-center mb-8 mt-2">
        {!collapsed && (
          <h2 className="text-xl font-bold ml-2">Admin Panel</h2>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <span className="font-bold text-2xl">A</span>
          </div>
        )}
      </div>
      
      <nav className="space-y-1">
        <Link 
          href="/admin"
          className={`flex items-center py-3 px-4 rounded ${isActive('/admin')} transition-colors`}
        >
          <FiHome size={collapsed ? 22 : 18} />
          {!collapsed && <span className="ml-3">Dashboard</span>}
        </Link>
        
        {/* Batches section */}
        <div>
          <button 
            onClick={toggleBatches}
            className={`w-full flex items-center justify-between py-3 px-4 rounded text-gray-300 hover:bg-blue-800 hover:text-white transition-colors ${
              pathname.includes('/admin/batches') ? 'bg-blue-800 text-white' : ''
            }`}
          >
            <div className="flex items-center">
              <FiBookOpen size={collapsed ? 22 : 18} />
              {!collapsed && <span className="ml-3">Batches</span>}
            </div>
            {!collapsed && (
              <FiChevronDown 
                size={16} 
                className={`transition-transform duration-200 ${batchesOpen ? 'rotate-180' : ''}`} 
              />
            )}
          </button>
          
          {(batchesOpen || collapsed) && (
            <div className={`${collapsed ? 'pl-0' : 'pl-9'} mt-1 space-y-1`}>
              <Link 
                href="/admin/batches"
                className={`flex items-center py-2 px-4 rounded ${isActive('/admin/batches')} transition-colors text-sm`}
              >
                {collapsed ? <FiBookOpen size={18} /> : <span>All Batches</span>}
              </Link>
              <Link 
                href="/admin/batches/create"
                className={`flex items-center py-2 px-4 rounded ${isActive('/admin/batches/create')} transition-colors text-sm`}
              >
                {collapsed ? <FiPlus size={18} /> : <span>Create Batch</span>}
              </Link>
            </div>
          )}
        </div>
        
        {/* Tasks section */}
        <div>
          <button 
            onClick={toggleTasks}
            className={`w-full flex items-center justify-between py-3 px-4 rounded text-gray-300 hover:bg-blue-800 hover:text-white transition-colors ${
              pathname.includes('/admin/tasks') ? 'bg-blue-800 text-white' : ''
            }`}
          >
            <div className="flex items-center">
              <FiCheckSquare size={collapsed ? 22 : 18} />
              {!collapsed && <span className="ml-3">Tasks</span>}
            </div>
            {!collapsed && (
              <FiChevronDown 
                size={16} 
                className={`transition-transform duration-200 ${tasksOpen ? 'rotate-180' : ''}`} 
              />
            )}
          </button>
          
          {(tasksOpen || collapsed) && (
            <div className={`${collapsed ? 'pl-0' : 'pl-9'} mt-1 space-y-1`}>
              <Link 
                href="/admin/tasks"
                className={`flex items-center py-2 px-4 rounded ${isActive('/admin/tasks')} transition-colors text-sm`}
              >
                {collapsed ? <FiCheckSquare size={18} /> : <span>All Tasks</span>}
              </Link>
              <Link 
                href="/admin/tasks/create"
                className={`flex items-center py-2 px-4 rounded ${isActive('/admin/tasks/create')} transition-colors text-sm`}
              >
                {collapsed ? <FiPlus size={18} /> : <span>Create Task</span>}
              </Link>
            </div>
          )}
        </div>
        
        <Link 
          href="/admin/users"
          className={`flex items-center py-3 px-4 rounded ${isActive('/admin/users')} transition-colors`}
        >
          <FiUsers size={collapsed ? 22 : 18} />
          {!collapsed && <span className="ml-3">Users</span>}
        </Link>
        
        <Link 
          href="/admin/submissions"
          className={`flex items-center py-3 px-4 rounded ${isActive('/admin/submissions')} transition-colors`}
        >
          <FiCheckSquare size={collapsed ? 22 : 18} />
          {!collapsed && <span className="ml-3">Submissions</span>}
        </Link>
        
        <Link 
          href="/admin/enrollments"
          className={`flex items-center py-3 px-4 rounded ${isActive('/admin/enrollments')} transition-colors`}
        >
          <FiUsers size={collapsed ? 22 : 18} />
          {!collapsed && <span className="ml-3">Enrollments</span>}
        </Link>
        
        <Link 
          href="/admin/settings"
          className={`flex items-center py-3 px-4 rounded ${isActive('/admin/settings')} transition-colors`}
        >
          <FiSettings size={collapsed ? 22 : 18} />
          {!collapsed && <span className="ml-3">Settings</span>}
        </Link>
      </nav>
      
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center py-3 px-4 rounded text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          <FiLogOut size={collapsed ? 22 : 18} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
} 