import React from "react";

import { 
  FiBook, 
  FiAward, 
  FiUsers, 
  FiLayers, 
  FiCheck, 
  FiTrendingUp,
  FiShield,
  FiClock
} from 'react-icons/fi';

const Feature = () => {
  const features = [
    {
      icon: <FiBook />,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with years of practical experience in their fields.'
    },
    {
      icon: <FiAward />,
      title: 'Recognized Certifications',
      description: 'Earn certificates that are recognized by top companies and institutions worldwide.'
    },
    {
      icon: <FiUsers />,
      title: 'Community Support',
      description: 'Join a community of learners and professionals to expand your network and knowledge.'
    },
    {
      icon: <FiLayers />,
      title: 'Structured Learning',
      description: 'Follow a well-designed curriculum that builds your skills step by step, from basics to advanced.'
    },
    {
      icon: <FiClock />,
      title: 'Self-Paced Learning',
      description: 'Learn at your own pace with lifetime access to course materials and resources.'
    },
    {
      icon: <FiTrendingUp />,
      title: 'Career Advancement',
      description: 'Boost your resume and open new opportunities in your professional journey.'
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <div className="container-custom relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Our Platform Benefits
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Why Choose CertifyTrack?
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            Our platform offers everything you need to advance your skills and career with industry-recognized certifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 group"
            >
              <div className="mb-5 h-12 w-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors duration-300">
                {React.cloneElement(feature.icon, { size: 24 })}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Trust badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-medium">
            <FiShield className="mr-2" /> Trusted by 500+ companies worldwide
          </div>
        </div>
      </div>
      
      {/* Bottom divider */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Feature;