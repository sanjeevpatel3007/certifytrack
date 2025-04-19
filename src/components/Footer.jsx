import Link from 'next/link';
import { FiMail, FiMapPin, FiPhone, FiTwitter, FiInstagram, FiLinkedin, FiGithub, FiExternalLink } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white relative">
      <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:20px_20px]"></div>
      
      {/* Top curved divider */}
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-white translate-y-px">
          <path d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,133.3C672,117,768,107,864,128C960,149,1056,203,1152,202.7C1248,203,1344,149,1392,122.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>
      
      <div className="container-custom relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-16 pt-8 pb-16">
          {/* Logo and About */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold flex items-center text-white">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                <span className="font-bold">CT</span>
              </div>
              CertifyTrack
            </Link>
            <p className="mt-4 text-slate-400">
              Elevate your career with our professional certification courses
              designed to help you succeed in today's competitive job market.
            </p>

            <div className="mt-6 flex space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <FiTwitter size={18} className="text-white" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <FiInstagram size={18} className="text-white" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-800 transition-colors"
              >
                <FiLinkedin size={18} className="text-white" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gray-600 transition-colors"
              >
                <FiGithub size={18} className="text-white" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors inline-flex items-center">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-slate-400 hover:text-white transition-colors inline-flex items-center">
                  <span>Courses</span>
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="text-slate-400 hover:text-white transition-colors inline-flex items-center">
                  <span>Certificates</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-400 hover:text-white transition-colors inline-flex items-center">
                  <span>Login</span>
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-slate-400 hover:text-white transition-colors inline-flex items-center">
                  <span>Sign Up</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start text-slate-400">
                <FiMapPin className="mt-1 mr-3 flex-shrink-0 text-blue-500" />
                <span>
                  123 Education Street, Learning City, 10001
                </span>
              </li>
              <li className="flex items-center text-slate-400">
                <FiPhone className="mr-3 text-blue-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center text-slate-400">
                <FiMail className="mr-3 text-blue-500" />
                <span>info@certifytrack.com</span>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <h4 className="font-medium text-white mb-3">Business Hours</h4>
              <p className="text-slate-400 text-sm">Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p className="text-slate-400 text-sm">Saturday: 10:00 AM - 2:00 PM</p>
              <p className="text-slate-400 text-sm">Sunday: Closed</p>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Stay Updated</h3>
            <p className="text-slate-400 mb-4">Subscribe to our newsletter for the latest updates on courses and certification opportunities.</p>
            
            <form className="mb-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full py-3 px-4 bg-slate-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700"
                  required
                />
                <button 
                  type="submit" 
                  className="absolute right-1 top-1 bottom-1 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-slate-500 mt-2 text-xs">We respect your privacy. Unsubscribe at any time.</p>
            </form>
            
            <div className="bg-slate-800 rounded-lg p-4 mt-6">
              <div className="flex items-center text-white font-semibold">
                <div className="mr-2 h-4 w-4 rounded-full bg-green-500 animate-pulse"></div>
                <span>Live Support Available</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">Our support team is here to help you</p>
              <a href="#" className="text-blue-400 hover:text-blue-300 mt-2 inline-flex items-center text-sm">
                Chat with us <FiExternalLink className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom copyright section */}
      <div className="border-t border-slate-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} CertifyTrack. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-slate-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 