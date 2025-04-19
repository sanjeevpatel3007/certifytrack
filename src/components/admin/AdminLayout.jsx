'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin, isAuthenticated } from '@/store/authStore';
import AdminSidebar from './Sidebar';
import ToastProvider from '@/components/ToastProvider';
import { FiUser, FiBell, FiSearch } from 'react-icons/fi';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(3);
  
  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    if (!isAdmin()) {
      router.push('/');
      return;
    }
  }, [router]);
  
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="relative w-80">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
            />
            <FiSearch className="absolute left-3 top-3 text-slate-400" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors relative">
                <FiBell />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-semibold">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </button>
            </div>
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <FiUser />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <ToastProvider />
          {children}
        </main>
        <footer className="py-4 px-6 text-center text-slate-500 text-sm border-t bg-white">
          <p>CertifyTrack Admin Portal &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
} 