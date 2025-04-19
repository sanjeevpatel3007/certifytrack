import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 pt-16 pb-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      {/* Blurred shapes */}
      <div className="absolute top-24 left-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-36 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm leading-6 text-white ring-1 ring-white/20 mb-6">
              <span className="font-medium">New courses available</span>
              <Link href="/courses" className="ml-2 font-semibold text-indigo-200 hover:text-white transition-colors">
                See what's new <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Elevate Your Career with 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-300"> Expert Certification</span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-xl mx-auto lg:mx-0">
              Join our platform to access industry-leading courses and earn valuable certifications that boost your professional profile.
            </p>
            
            <div className="mb-10 text-blue-100 space-y-2">
              <div className="flex items-center justify-center lg:justify-start">
                <FiCheckCircle className="mr-2 text-sky-300" />
                <span>Structured learning paths for career advancement</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <FiCheckCircle className="mr-2 text-sky-300" />
                <span>Industry-recognized certifications</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <FiCheckCircle className="mr-2 text-sky-300" />
                <span>Learn at your own pace, anywhere, anytime</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link 
                href="/courses" 
                className="btn-primary bg-white text-blue-700 hover:bg-blue-50 shadow-lg shadow-blue-700/30 flex items-center"
              >
                Explore Courses <FiArrowRight className="ml-2" />
              </Link>
              <Link 
                href="/signup" 
                className="btn-secondary bg-transparent text-white border-white hover:bg-white/10"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
          
          <div className="relative hidden lg:flex justify-end">
            <div className="relative h-[500px] w-[500px]">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-transparent rounded-full filter blur-3xl opacity-30"></div>
              <div className="relative z-10">
                <Image 
                  src="/images/hero-image.png" 
                  alt="Students learning online" 
                  width={500}
                  height={500}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
              
              {/* Floating badges */}
              <div className="absolute top-20 -left-10 bg-white rounded-lg p-3 shadow-xl animate-float">
                <div className="flex items-center gap-2">
                  <div className="bg-green-500 h-8 w-8 rounded-full flex items-center justify-center text-white font-bold">+</div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Learning Progress</p>
                    <p className="font-bold text-gray-800">92% Completed</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-20 -right-10 bg-white rounded-lg p-3 shadow-xl animate-float animation-delay-1000">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center text-white font-bold">★</div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Certification</p>
                    <p className="font-bold text-gray-800">Industry Approved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Companies section */}
        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="text-center font-medium text-blue-200 mb-6">Trusted by leading companies worldwide</p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-8">
            <div className="w-32 h-8 bg-white/10 rounded-md flex items-center justify-center text-white font-bold">COMPANY 1</div>
            <div className="w-32 h-8 bg-white/10 rounded-md flex items-center justify-center text-white font-bold">COMPANY 2</div>
            <div className="w-32 h-8 bg-white/10 rounded-md flex items-center justify-center text-white font-bold">COMPANY 3</div>
            <div className="w-32 h-8 bg-white/10 rounded-md flex items-center justify-center text-white font-bold">COMPANY 4</div>
            <div className="w-32 h-8 bg-white/10 rounded-md flex items-center justify-center text-white font-bold">COMPANY 5</div>
          </div>
        </div>
      </div>
      
      {/* Bottom curved divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto fill-white">
          <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;