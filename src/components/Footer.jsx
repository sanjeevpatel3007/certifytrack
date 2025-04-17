import Link from 'next/link';
import { FiMail, FiMapPin, FiPhone, FiTwitter, FiInstagram, FiLinkedin, FiGithub } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold">
              CertifyTrack
            </Link>
            <p className="mt-4 text-gray-400">
              Elevate your career with our professional certification courses
              designed to help you succeed in today's competitive job market.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-gray-400 hover:text-white transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="text-gray-400 hover:text-white transition-colors">
                  Certificates
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-400 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FiMapPin className="mt-1 mr-2 flex-shrink-0 text-gray-400" />
                <span className="text-gray-400">
                  123 Education Street, Learning City, 10001
                </span>
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-2 text-gray-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FiMail className="mr-2 text-gray-400" />
                <span className="text-gray-400">info@certifytrack.com</span>
              </li>
            </ul>
          </div>
          
          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <FiTwitter size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <FiInstagram size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-800 transition-colors"
              >
                <FiLinkedin size={18} />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-600 transition-colors"
              >
                <FiGithub size={18} />
              </a>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Subscribe to our Newsletter</h3>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow py-2 px-4 bg-gray-800 text-white rounded-l-md focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="py-2 px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} CertifyTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 