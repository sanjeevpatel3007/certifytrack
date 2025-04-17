import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Elevate Your Career with Expert Certification
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto lg:mx-0">
              Join our platform to access industry-leading courses and earn valuable certifications that boost your professional profile.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link 
                href="/courses" 
                className="px-8 py-4 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-lg flex items-center"
              >
                Explore Courses <FiArrowRight className="ml-2" />
              </Link>
              <Link 
                href="/signup" 
                className="px-8 py-4 bg-transparent text-white font-medium rounded-lg border border-white hover:bg-white/10 transition-colors"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
          <div className="hidden lg:block relative h-[500px]">
            <Image 
              src="/images/hero-image.png" 
              alt="Students learning online" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white"></div>
    </div>
  );
};

export default Hero;