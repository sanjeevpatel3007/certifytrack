'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiUser } from 'react-icons/fi';

import { 
  FiHome, 
  FiUsers, 
  FiBookOpen, 
  FiPlus,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiChevronDown,
  FiCheckSquare,
  FiFileText,
  FiUserCheck,
  FiGrid
} from 'react-icons/fi';
import { useState } from 'react';
import { logoutUser, useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthStore();
  
  const toggleSidebar = () => setCollapsed(!collapsed);
  
  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };
  
  const isActive = (path) => {
    if (path === '/admin' && pathname !== '/admin') return false;
    return pathname?.startsWith(path);
  };
  
  return (
    <div className={`bg-gradient-to-b from-slate-900 to-slate-800 text-white ${collapsed ? 'w-20' : 'w-64'} min-h-screen transition-all duration-300 relative shadow-xl`}>
      {/* Collapse toggle button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-indigo-600 p-1.5 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-10 border-2 border-white"
      >
        <FiMenu size={16} className="text-white" />
      </button>
      
     
      
      <div className="p-4">
       
        <nav className="space-y-1.5">
          <Link 
            href="/admin"
            className={`flex items-center rounded-lg py-3 px-4 ${
              isActive('/admin') && pathname === '/admin'
                ? 'bg-indigo-700 text-white shadow-md' 
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            } transition-all duration-200`}
          >
            <FiGrid size={collapsed ? 22 : 18} />
            {!collapsed && <span className="ml-3">Dashboard</span>}
          </Link>
          
          {!collapsed && (
            <div className="my-4 px-4">
              <h3 className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Content</h3>
            </div>
          )}
          
          {/* Batches section - simplified */}
          <Link 
            href="/admin/batches"
            className={`flex items-center rounded-lg py-3 px-4 ${
              isActive('/admin/batches')
                ? 'bg-indigo-700 text-white shadow-md' 
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            } transition-all duration-200`}
          >
            <FiBookOpen size={collapsed ? 22 : 18} />
            {!collapsed && <span className="ml-3">Batches</span>}
          </Link>
          
          {/* Tasks section - simplified */}
          <Link 
            href="/admin/tasks"
            className={`flex items-center rounded-lg py-3 px-4 ${
              isActive('/admin/tasks')
                ? 'bg-indigo-700 text-white shadow-md' 
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            } transition-all duration-200`}
          >
            <FiCheckSquare size={collapsed ? 22 : 18} />
            {!collapsed && <span className="ml-3">Tasks</span>}
          </Link>
          
          {!collapsed && (
            <div className="my-4 px-4">
              <h3 className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Management</h3>
            </div>
          )}
          
          <Link 
            href="/admin/users"
            className={`flex items-center rounded-lg py-3 px-4 ${
              isActive('/admin/users')
                ? 'bg-indigo-700 text-white shadow-md' 
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            } transition-all duration-200`}
          >
            <FiUsers size={collapsed ? 22 : 18} />
            {!collapsed && <span className="ml-3">Users</span>}
          </Link>
          
          <Link 
            href="/admin/submissions"
            className={`flex items-center rounded-lg py-3 px-4 ${
              isActive('/admin/submissions')
                ? 'bg-indigo-700 text-white shadow-md' 
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            } transition-all duration-200`}
          >
            <FiFileText size={collapsed ? 22 : 18} />
            {!collapsed && <span className="ml-3">Submissions</span>}
          </Link>
          
          <Link 
            href="/admin/enrollments"
            className={`flex items-center rounded-lg py-3 px-4 ${
              isActive('/admin/enrollments')
                ? 'bg-indigo-700 text-white shadow-md' 
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            } transition-all duration-200`}
          >
            <FiUserCheck size={collapsed ? 22 : 18} />
            {!collapsed && <span className="ml-3">Enrollments</span>}
          </Link>
          
          {!collapsed && (
            <div className="my-4 px-4">
              <h3 className="text-xs uppercase text-slate-400 font-semibold tracking-wider">System</h3>
            </div>
          )}
          
          <Link 
            href="/admin/settings"
            className={`flex items-center rounded-lg py-3 px-4 ${
              isActive('/admin/settings')
                ? 'bg-indigo-700 text-white shadow-md' 
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            } transition-all duration-200`}
          >
            <FiSettings size={collapsed ? 22 : 18} />
            {!collapsed && <span className="ml-3">Settings</span>}
          </Link>
        </nav>
      </div>
      
      <div className={`absolute bottom-6 ${collapsed ? 'left-0 right-0 px-3' : 'left-4 right-4'}`}>
        {!collapsed && (
          <div className="bg-slate-700/30 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center">
                <FiUser size={16} />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-slate-400 mt-1">{user?.email || 'admin@certifytrack.com'}</p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg ${
            collapsed ? 'bg-red-600/20' : 'bg-red-600/10'
          } text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200`}
        >
          <FiLogOut size={collapsed ? 20 : 18} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
} 