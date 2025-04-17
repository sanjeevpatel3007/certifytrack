'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin, isAuthenticated } from '@/store/authStore';
import AdminSidebar from './Sidebar';
import ToastProvider from '@/components/ToastProvider';

export default function AdminLayout({ children }) {
  const router = useRouter();
  
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
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <ToastProvider />
          {children}
        </main>
        <footer className="py-4 px-6 text-center text-gray-500 text-sm border-t bg-white">
          <p>CertifyTrack Admin Portal &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
} 