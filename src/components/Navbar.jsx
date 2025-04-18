'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiLogOut, 
  FiHome, 
  FiBook, 
  FiAward, 
  FiChevronDown 
} from 'react-icons/fi';
import { useAuthStore, logoutUser } from '@/store/authStore';
import { useBatchStore } from '@/store/batchStore';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  
  // Auth state from Zustand
  const { user, isLoggedIn } = useAuthStore();
  const { resetStore } = useBatchStore();
  
  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuRef]);
  
  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  
  const handleLogout = () => {
    logoutUser();
    resetStore();
    router.push('/');
    setIsUserMenuOpen(false);
  };
  
  const isActive = (path) => {
    if (path === '/' && pathname !== '/') {
      return false;
    }
    return pathname?.startsWith(path);
  };
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center"
          >
            <span className="text-2xl font-bold text-blue-600">CertifyTrack</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link 
              href="/" 
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <FiHome className="mr-1" />
              <span>Home</span>
            </Link>
            
            <Link 
              href="/courses" 
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                isActive('/courses') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <FiBook className="mr-1" />
              <span>Courses</span>
            </Link>
            
           
            
            {isLoggedIn && user ? (
              <div className="relative ml-3" ref={userMenuRef}>
                <button 
                  onClick={toggleUserMenu}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    isUserMenuOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <FiUser className="mr-1" />
                  <span className="mr-1">{user.name}</span>
                  <FiChevronDown className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                    <Link 
                      href="/profile" 
                      className={`block px-4 py-2 text-sm ${
                        isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Your Profile
                    </Link>
                    <Link 
                      href="/my-courses" 
                      className={`block px-4 py-2 text-sm ${
                        isActive('/my-courses') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      My Courses
                    </Link>
                    <Link 
                      href="/certificates" 
                      className={`block px-4 py-2 text-sm ${
                        isActive('/my-certificates') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      My Certificates
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        href="/admin" 
                        className={`block px-4 py-2 text-sm ${
                          isActive('/admin') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <FiLogOut className="mr-2" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 border border-transparent hover:border-gray-200 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none p-2"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-1 border-t border-gray-100">
            <Link 
              href="/" 
              className={`block px-4 py-2 rounded-md ${
                isActive('/') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <FiHome className="mr-2" />
                <span>Home</span>
              </div>
            </Link>
            
            <Link 
              href="/courses" 
              className={`block px-4 py-2 rounded-md ${
                isActive('/courses') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <FiBook className="mr-2" />
                <span>Courses</span>
              </div>
            </Link>
            
            <Link 
              href="/certificates" 
              className={`block px-4 py-2 rounded-md ${
                isActive('/certificates') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <FiAward className="mr-2" />
                <span>Certificates</span>
              </div>
            </Link>
            
            {isLoggedIn && user ? (
              <>
                <div className="border-t border-gray-100 my-2 pt-2">
                  <div className="px-4 py-1 text-xs text-gray-500">
                    ACCOUNT
                  </div>
                </div>
                <Link 
                  href="/profile" 
                  className={`block px-4 py-2 rounded-md ${
                    isActive('/profile') 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <FiUser className="mr-2" />
                    <span>Your Profile</span>
                  </div>
                </Link>
                <Link 
                  href="/my-courses" 
                  className={`block px-4 py-2 rounded-md ${
                    isActive('/my-courses') 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <FiBook className="mr-2" />
                    <span>My Courses</span>
                  </div>
                </Link>
                <Link 
                  href="/my-certificates" 
                  className={`block px-4 py-2 rounded-md ${
                    isActive('/my-certificates') 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <FiAward className="mr-2" />
                    <span>My Certificates</span>
                  </div>
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className={`block px-4 py-2 rounded-md ${
                      isActive('/admin') 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <FiUser className="mr-2" />
                      <span>Admin Dashboard</span>
                    </div>
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 rounded-md text-red-600 hover:bg-gray-50"
                >
                  <FiLogOut className="mr-2" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-4 py-2 border-t border-gray-100 mt-2">
                <Link 
                  href="/login" 
                  className="w-full px-4 py-2 text-center text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="w-full px-4 py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 