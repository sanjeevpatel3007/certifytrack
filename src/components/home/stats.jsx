import React from 'react';
import { FiUsers, FiAward, FiBriefcase, FiGlobe } from 'react-icons/fi';

const Stats = () => {
  const stats = [
    {
      icon: <FiUsers />,
      value: '15,000+',
      label: 'Active Students'
    },
    {
      icon: <FiAward />,
      value: '200+',
      label: 'Certification Courses'
    },
    {
      icon: <FiBriefcase />,
      value: '92%',
      label: 'Job Placement Rate'
    },
    {
      icon: <FiGlobe />,
      value: '50+',
      label: 'Countries Represented'
    }
  ];

  return (
    <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
      <div className="absolute top-10 left-0 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 right-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      
      <div className="container-custom relative z-10">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-blue-300 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-300"></span>
            </span>
            Our Impact
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-50">
            Transforming Careers Through Education
          </h2>
          <p className="text-xl text-blue-100/80">
            Our platform has helped thousands of professionals advance their careers and achieve their goals.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-blue-300">
                {React.cloneElement(stat.icon, { size: 28 })}
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                {stat.value}
              </div>
              <p className="text-blue-200 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
        
        {/* Bottom ribbon */}
        <div className="mt-16 py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-100 text-center md:text-left mb-4 md:mb-0">Join our growing community of learners and professionals</p>
          <button className="px-5 py-2.5 bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default Stats; 