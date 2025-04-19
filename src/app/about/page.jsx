'use client';
import React from 'react';

import { FiUsers, FiTarget, FiAward, FiBookOpen, FiGlobe, FiClock, FiCheck } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function AboutPage() {
  // Team members
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Former Education Director with 15+ years experience in professional training and certification.',
      image: '/images/team/team-1.jpg'
    },
    {
      name: 'Robert Chen',
      role: 'CTO',
      bio: 'Tech leader with background in educational technology and scalable learning platforms.',
      image: '/images/team/team-2.jpg'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Director of Curriculum',
      bio: 'Expert in instructional design with focus on creating engaging certification programs.',
      image: '/images/team/team-3.jpg'
    },
    {
      name: 'David Park',
      role: 'Lead Instructor',
      bio: 'Award-winning educator specialized in technical certification programs and workshops.',
      image: '/images/team/team-4.jpg'
    }
  ];

  // Values 
  const values = [
    {
      icon: <FiUsers className="h-6 w-6" />,
      title: 'Student Success',
      description: 'We measure our success by the achievements of our students. Your career growth is our mission.'
    },
    {
      icon: <FiTarget className="h-6 w-6" />,
      title: 'Industry Relevance',
      description: 'Our courses are designed with input from industry leaders to ensure skills that employers value.'
    },
    {
      icon: <FiBookOpen className="h-6 w-6" />,
      title: 'Quality Learning',
      description: 'We are committed to creating engaging, comprehensive, and effective learning experiences.'
    },
    {
      icon: <FiGlobe className="h-6 w-6" />,
      title: 'Global Accessibility',
      description: 'Education should be accessible to everyone, regardless of location or background.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="relative py-20 md:py-28 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute top-10 left-0 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-blue-300 text-sm font-medium mb-4">
              About CertifyTrack
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Empowering Careers Through Quality Education
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              We're on a mission to transform professional education by making high-quality certification courses accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Our story section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
                Our Story
              </div>
              <h2 className="text-3xl font-bold mb-6 text-slate-900">From Classroom to Global Platform</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                CertifyTrack began in 2018 with a simple idea: professional certifications should be accessible, affordable, and actually prepare you for real-world success.
              </p>
              <p className="text-slate-600 mb-4 leading-relaxed">
                What started as a small team offering in-person certification prep courses has evolved into a global platform serving thousands of professionals across 50+ countries, but our mission remains the same: to help you advance your career through quality education.
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Today, we partner with industry leaders to create certification programs that employers trust and professionals rely on to advance their careers.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
                    <FiAward className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">200+</div>
                    <div className="text-sm text-slate-500">Certification Courses</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
                    <FiUsers className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">15,000+</div>
                    <div className="text-sm text-slate-500">Students Worldwide</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
                    <FiGlobe className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">50+</div>
                    <div className="text-sm text-slate-500">Countries Reached</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/about/about-main.jpg" 
                  width={600}
                  height={450}
                  alt="CertifyTrack team"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-64 h-64 rounded-2xl border-8 border-white bg-blue-50 -z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-40 h-40 rounded-xl border-8 border-white bg-slate-100 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our values section */}
      <section className="py-20 bg-slate-50 relative">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
              Our Values
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-900">What Drives Us Forward</h2>
            <p className="text-xl text-slate-600">
              Our core values guide everything we do — from course development to student support.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100">
                <div className="inline-block mb-5 p-3 rounded-xl bg-blue-50">
                  {React.cloneElement(value.icon, { className: "text-blue-600" })}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
              Our Team
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Meet the Experts Behind CertifyTrack</h2>
            <p className="text-xl text-slate-600">
              Our team combines expertise in education, technology, and professional development.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="relative rounded-2xl overflow-hidden mb-5 aspect-[3/4] bg-slate-100">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-100 text-blue-600">
                      <span className="text-4xl font-bold">{member.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-slate-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-20 bg-slate-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
                FAQs
              </div>
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Frequently Asked Questions</h2>
              <p className="text-slate-600 mb-8">
                Have questions? We're here to help. If you don't see your question answered below, please contact our support team.
              </p>
              
              <Link 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Us
              </Link>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-2">Are your certifications recognized by employers?</h3>
                <p className="text-slate-600">Yes, our certifications are designed in partnership with industry leaders and are recognized by employers worldwide. Many of our programs are aligned with industry-standard certifications.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-2">How long do I have access to course materials?</h3>
                <p className="text-slate-600">Once enrolled, you have lifetime access to all course materials, including future updates to the content. Learn at your own pace without worrying about deadlines.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-2">Do you offer job placement assistance?</h3>
                <p className="text-slate-600">Yes, we provide career guidance and job placement assistance through our network of partner companies. Our Career Success team helps students prepare for interviews and showcase their new certifications effectively.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-2">Can I get a refund if I'm not satisfied?</h3>
                <p className="text-slate-600">We offer a 30-day money-back guarantee for most of our courses. If you're not completely satisfied, contact our support team within 30 days of enrollment for a full refund.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of professionals advancing their careers with CertifyTrack's certification programs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/courses" 
                className="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-md"
              >
                Explore Courses
              </Link>
              <Link 
                href="/signup" 
                className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg border border-white/30 hover:bg-blue-800 transition-colors"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 