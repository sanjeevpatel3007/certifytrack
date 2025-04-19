import Link from 'next/link';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { FiStar } from "react-icons/fi";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"></div>
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:16px_16px]"></div>
      <div className="absolute top-10 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-10 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-blue-50 text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-200"></span>
              </span>
              Limited Time Offer
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
              Ready to Advance <br className="hidden md:block" />Your Career?
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of professionals who have transformed their careers with our industry-recognized certifications.
            </p>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-400/20 flex items-center justify-center mr-3">
                  <FiCheck className="h-3.5 w-3.5 text-blue-100" />
                </div>
                <p className="text-blue-50">Flexible learning schedules</p>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-400/20 flex items-center justify-center mr-3">
                  <FiCheck className="h-3.5 w-3.5 text-blue-100" />
                </div>
                <p className="text-blue-50">Expert instructor support</p>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-400/20 flex items-center justify-center mr-3">
                  <FiCheck className="h-3.5 w-3.5 text-blue-100" />
                </div>
                <p className="text-blue-50">Lifetime access to course materials</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/courses" 
                className="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-lg flex items-center"
              >
                Browse Courses <FiArrowRight className="ml-2" />
              </Link>
              <Link 
                href="/signup" 
                className="px-6 py-3 bg-blue-700/30 backdrop-blur-sm text-white font-medium rounded-lg border border-white/20 hover:bg-blue-600/50 transition-colors"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="absolute -left-10 -top-10 w-72 h-72 bg-gradient-to-br from-purple-400 to-purple-300 rounded-full opacity-20 mix-blend-multiply blur-3xl animate-blob animation-delay-4000"></div>
            
            {/* Course card */}
            <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="absolute -right-3 -top-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Best Seller
              </div>
              <div className="mb-4">
                <div className="h-48 w-full bg-blue-800/50 rounded-lg mb-4 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-white font-bold text-lg">Web Development Bootcamp</div>
                    <div className="text-blue-100 text-sm">Complete Frontend & Backend</div>
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="text-blue-100 font-medium">12-week program</div>
                  <div className="flex">
                    <div className="flex text-yellow-300">
                      <FiStar className="fill-yellow-300 h-4 w-4" />
                      <FiStar className="fill-yellow-300 h-4 w-4" />
                      <FiStar className="fill-yellow-300 h-4 w-4" />
                      <FiStar className="fill-yellow-300 h-4 w-4" />
                      <FiStar className="fill-yellow-300 h-4 w-4" />
                    </div>
                    <span className="text-blue-100 text-sm ml-1">5.0</span>
                  </div>
                </div>
                <div className="text-white font-bold text-2xl mb-4">$499 <span className="line-through text-blue-200 text-lg font-normal ml-2">$699</span></div>
                <div className="bg-blue-700 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-blue-600 transition-colors cursor-pointer">
                  Enroll Now
                </div>
              </div>
            </div>
            
            {/* Certificate badge */}
            <div className="absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center mr-3 text-white">
                  <FiCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-white font-medium">Certified</div>
                  <div className="text-blue-100 text-xs">Industry Recognized</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA; 