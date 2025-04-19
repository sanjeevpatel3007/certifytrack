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
  FiChevronDown,
  FiSettings,
  FiSearch,
  FiBell,
  FiGrid,
  FiShield
} from 'react-icons/fi';
import { useAuthStore, logoutUser } from '@/store/authStore';
import { useBatchStore } from '@/store/batchStore';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);
  
  // Auth state from Zustand
  const { user, isLoggedIn } = useAuthStore();
  const { resetStore } = useBatchStore();
  
  // Check if on admin pages
  const isAdminPage = pathname?.startsWith('/admin');
  
  // Handle scroll for transparent to solid navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
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
    setIsUserMenuOpen(false);
    router.push('/login');
  };
  
  const isActive = (path) => {
    if (path === '/' && pathname !== '/') {
      return false;
    }
    return pathname?.startsWith(path);
  };
  
  const navbarClasses = isAdminPage
    ? "bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50"
    : `${isScrolled 
        ? 'bg-white/95 shadow-sm backdrop-blur-md border-b border-gray-100' 
        : 'bg-transparent'} 
        sticky top-0 z-50 transition-all duration-300`;
  
  return (
    <nav className={navbarClasses}>
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link 
            href={isAdminPage ? "/admin" : "/"} 
            className="flex items-center"
          >
            <div className={`h-10 w-10 rounded-xl ${isAdminPage ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} flex items-center justify-center mr-2.5 shadow-sm`}>
              <span className="font-bold text-white">CT</span>
            </div>
            <span className={`text-xl font-bold tracking-tight ${isAdminPage ? 'text-white' : (isScrolled ? 'text-slate-900' : 'text-slate-900')}`}>
              {isAdminPage ? "Admin" : "CertifyTrack"}
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* Admin Navigation */}
            {isAdminPage ? (
              <>
                <Link 
                  href="/admin" 
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === '/admin'
                      ? 'text-white bg-slate-800/80 shadow-sm' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <FiGrid className="mr-1.5" size={16} />
                  <span>Dashboard</span>
                </Link>
                
                <Link 
                  href="/admin/users" 
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/admin/users') 
                      ? 'text-white bg-slate-800/80 shadow-sm' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <FiUser className="mr-1.5" size={16} />
                  <span>Users</span>
                </Link>
                
                <Link 
                  href="/admin/batches" 
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/admin/batches') 
                      ? 'text-white bg-slate-800/80 shadow-sm' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <FiBook className="mr-1.5" size={16} />
                  <span>Batches</span>
                </Link>
                
                <Link 
                  href="/" 
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-200"
                >
                  <FiHome className="mr-1.5" size={16} />
                  <span>Main Website</span>
                </Link>
              </>
            ) : (
              <>
                {/* User Navigation */}
            <Link 
              href="/" 
                  className={`flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/') 
                      ? 'text-blue-600 bg-blue-50 shadow-sm' 
                      : `${isScrolled ? 'text-slate-700' : 'text-slate-800'} hover:text-blue-600 hover:bg-blue-50`
              }`}
            >
              <span>Home</span>
            </Link>
            
            <Link 
              href="/courses" 
                  className={`flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/courses') 
                      ? 'text-blue-600 bg-blue-50 shadow-sm' 
                      : `${isScrolled ? 'text-slate-700' : 'text-slate-800'} hover:text-blue-600 hover:bg-blue-50`
              }`}
            >
              <span>Courses</span>
            </Link>
            
                <Link 
                  href="/certificate" 
                  className={`flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/certificate') 
                      ? 'text-blue-600 bg-blue-50 shadow-sm' 
                      : `${isScrolled ? 'text-slate-700' : 'text-slate-800'} hover:text-blue-600 hover:bg-blue-50`
                  }`}
                >
                  <span>Certificates</span>
                </Link>
                
                <Link 
                  href="/about" 
                  className={`flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/about') 
                      ? 'text-blue-600 bg-blue-50 shadow-sm' 
                      : `${isScrolled ? 'text-slate-700' : 'text-slate-800'} hover:text-blue-600 hover:bg-blue-50`
                  }`}
                >
                  <span>About</span>
                </Link>
              </>
            )}
            
            {/* User Menu / Login Options */}
            {isLoggedIn && user ? (
              <div className="relative ml-4" ref={userMenuRef}>
                <button 
                  onClick={toggleUserMenu}
                  className={`flex items-center pl-3 pr-2.5 py-2 rounded-lg transition-all duration-200 ${
                    isAdminPage ? 
                      (isUserMenuOpen ? 'bg-slate-800/80 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800/60') :
                      (isUserMenuOpen ? 'text-blue-600 bg-blue-50 shadow-sm' : `${isScrolled ? 'text-slate-700' : 'text-slate-800'} hover:text-blue-600 hover:bg-blue-50`)
                  }`}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-2.5 text-white shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="mr-1.5 text-sm font-medium">{user.name}</span>
                  <FiChevronDown className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} size={14} />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg py-2 z-10 border border-gray-100 overflow-hidden animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    {user.isAdmin && !isAdminPage && (
                        <Link 
                          href="/admin" 
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                        <FiShield className="mr-2.5 text-gray-500" size={16} />
                          Admin Dashboard
                        </Link>
                    )}
                    
                    {!isAdminPage ? (
                      <>
                        <Link 
                          href="/profile" 
                          className={`flex items-center px-4 py-2.5 text-sm ${
                            isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                          } transition-colors`}
                        >
                          <FiUser className="mr-2.5 text-gray-500" size={16} />
                          Your Profile
                        </Link>
                        <Link 
                          href="/my-courses" 
                          className={`flex items-center px-4 py-2.5 text-sm ${
                            isActive('/my-courses') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                          } transition-colors`}
                        >
                          <FiBook className="mr-2.5 text-gray-500" size={16} />
                          My Courses
                        </Link>
                        <Link 
                          href="/certificate" 
                          className={`flex items-center px-4 py-2.5 text-sm ${
                            isActive('/certificate') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                          } transition-colors`}
                        >
                          <FiAward className="mr-2.5 text-gray-500" size={16} />
                          My Certificates
                        </Link>
                      </>
                    ) : (
                      <Link 
                        href="/admin/settings" 
                        className={`flex items-center px-4 py-2.5 text-sm ${
                          isActive('/admin/settings') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                        } transition-colors`}
                      >
                        <FiSettings className="mr-2.5 text-gray-500" size={16} />
                        Settings
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut className="mr-2.5 text-red-500" size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/login" 
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isAdminPage ? 
                      'border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600' :
                      'border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm"
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
              className={`${
                isAdminPage ? 'text-white hover:bg-slate-800/60' : `${isScrolled ? 'text-slate-700' : 'text-slate-900'} hover:bg-gray-100`
              } p-2 rounded-lg focus:outline-none transition-colors`}
              aria-label="Toggle menu"
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
          <div className={`md:hidden py-4 space-y-1 border-t ${isAdminPage ? 'border-slate-800' : 'border-gray-100'} animate-fadeIn`}>
            {/* Admin Mobile Links */}
            {isAdminPage ? (
              <>
                <Link 
                  href="/admin" 
                  className={`block px-4 py-2.5 rounded-lg ${
                    pathname === '/admin'
                      ? 'bg-slate-800/80 text-white shadow-sm' 
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  } transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <FiGrid className="mr-2.5" />
                    <span>Dashboard</span>
                  </div>
                </Link>
                
            <Link 
                  href="/admin/users" 
                  className={`block px-4 py-2.5 rounded-lg ${
                    isActive('/admin/users')
                      ? 'bg-slate-800/80 text-white shadow-sm' 
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  } transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                    <FiUser className="mr-2.5" />
                    <span>Users</span>
              </div>
            </Link>
            
            <Link 
                  href="/admin/batches" 
                  className={`block px-4 py-2.5 rounded-lg ${
                    isActive('/admin/batches')
                      ? 'bg-slate-800/80 text-white shadow-sm' 
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  } transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                    <FiBook className="mr-2.5" />
                    <span>Batches</span>
              </div>
            </Link>
            
            <Link 
                  href="/admin/settings" 
                  className={`block px-4 py-2.5 rounded-lg ${
                    isActive('/admin/settings')
                      ? 'bg-slate-800/80 text-white shadow-sm' 
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  } transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                    <FiSettings className="mr-2.5" />
                    <span>Settings</span>
              </div>
            </Link>
            
                <Link 
                  href="/" 
                  className="block px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <FiHome className="mr-2.5" />
                    <span>Main Website</span>
                  </div>
                </Link>
              </>
            ) : (
              <>
                {/* User Mobile Links */}
                <Link 
                  href="/" 
                  className={`block px-4 py-2.5 rounded-lg ${
                    isActive('/') 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <FiHome className="mr-2.5" />
                    <span>Home</span>
                  </div>
                </Link>
                
                <Link 
                  href="/courses" 
                  className={`block px-4 py-2.5 rounded-lg ${
                    isActive('/courses') 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <FiBook className="mr-2.5" />
                    <span>Courses</span>
                  </div>
                </Link>
                
                <Link 
                  href="/certificate" 
                  className={`block px-4 py-2.5 rounded-lg ${
                    isActive('/certificate') 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <FiAward className="mr-2.5" />
                    <span>Certificates</span>
                  </div>
                </Link>
                
                <Link 
                  href="/about" 
                  className={`block px-4 py-2.5 rounded-lg ${
                    isActive('/about') 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <FiUser className="mr-2.5" />
                    <span>About</span>
                  </div>
                </Link>
                
                {isLoggedIn && (
                  <>
                    <div className="border-t border-gray-100 my-2 pt-2">
                      <div className="px-4 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account
                      </div>
                    </div>
                    
                    {user.isAdmin && (
                  <Link 
                    href="/admin" 
                        className={`block px-4 py-2.5 rounded-lg ${
                      isActive('/admin') 
                            ? 'bg-blue-50 text-blue-600 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50'
                        } transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                          <FiShield className="mr-2.5" />
                      <span>Admin Dashboard</span>
                    </div>
                  </Link>
                )}
                    
                    <Link 
                      href="/profile" 
                      className={`block px-4 py-2.5 rounded-lg ${
                        isActive('/profile') 
                          ? 'bg-blue-50 text-blue-600 shadow-sm' 
                          : 'text-gray-700 hover:bg-gray-50'
                      } transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <FiUser className="mr-2.5" />
                        <span>Your Profile</span>
                      </div>
                    </Link>
                    
                    <Link 
                      href="/my-courses" 
                      className={`block px-4 py-2.5 rounded-lg ${
                        isActive('/my-courses') 
                          ? 'bg-blue-50 text-blue-600 shadow-sm' 
                          : 'text-gray-700 hover:bg-gray-50'
                      } transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <FiBook className="mr-2.5" />
                        <span>My Courses</span>
                      </div>
                    </Link>
                  </>
                )}
              </>
            )}
            
            {/* Login/Logout for mobile */}
            {isLoggedIn ? (
                <button
                onClick={handleLogout}
                className={`flex items-center w-full px-4 py-2.5 rounded-lg ${
                  isAdminPage ? 'text-red-400 hover:bg-slate-800/60' : 'text-red-600 hover:bg-red-50'
                } transition-colors`}
              >
                <FiLogOut className="mr-2.5" />
                  <span>Logout</span>
                </button>
            ) : (
              <div className={`flex flex-col space-y-2.5 px-4 py-3 border-t ${isAdminPage ? 'border-slate-800' : 'border-gray-100'} mt-2`}>
                <Link 
                  href="/login" 
                  className={`w-full px-4 py-2.5 text-center rounded-lg transition-colors ${
                    isAdminPage ? 'text-white border border-slate-700 hover:bg-slate-800/60' : 'text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="w-full px-4 py-2.5 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm"
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