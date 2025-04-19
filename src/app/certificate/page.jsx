'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiDownload, FiShare2, FiAward, FiCalendar, FiUser, FiFileText, FiCheckCircle } from 'react-icons/fi';
import Footer from '@/components/Footer';

export default function CertificatePage() {
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  // Dummy certificate data
  const certificate = {
    id: 'CERT-2023-8752',
    title: 'Advanced Web Development',
    issuedTo: 'John Doe',
    issuedOn: 'May 15, 2023',
    expiresOn: 'May 15, 2025',
    issuer: 'CertifyTrack',
    issuerLogo: '/images/logo.png',
    credential: 'Web Development Professional',
    skills: [
      'React.js',
      'Node.js',
      'Express',
      'MongoDB',
      'RESTful API Design',
      'Authentication & Security',
      'Cloud Deployment'
    ],
    description: 'This certificate verifies that John Doe has successfully completed the Advanced Web Development certification program, demonstrating proficiency in modern web development technologies and best practices.',
    verificationLink: 'https://certifytrack.com/verify/CERT-2023-8752'
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero section */}
      <section className="relative py-12 md:py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:16px_16px]"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-blue-100 text-sm font-medium mb-4 backdrop-blur-sm">
                Certificate of Completion
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{certificate.title}</h1>
              <p className="text-blue-100">Issued to <span className="font-semibold text-white">{certificate.issuedTo}</span></p>
            </div>
            
            <div className="mt-6 md:mt-0 flex flex-wrap gap-3">
              <button 
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                onClick={handleShare}
              >
                <FiShare2 className="mr-2" />
                Share
              </button>
              
              <button className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                <FiDownload className="mr-2" />
                Download PDF
              </button>
              
              {showShareOptions && (
                <div className="absolute top-24 right-4 md:right-12 bg-white shadow-lg rounded-xl p-4 z-20">
                  <div className="text-slate-900 mb-2 font-medium">Share with</div>
                  <div className="flex gap-3">
                    <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </button>
                    <button className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-900">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </button>
                    <button className="p-2 bg-slate-900 text-white rounded-full hover:bg-slate-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                    <button className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </button>
                    <button className="p-2 bg-slate-500 text-white rounded-full hover:bg-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Certificate Preview */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                
                <div className="p-8 md:p-12">
                  <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-100">
                    <div className="relative h-16 w-48">
                      <Image 
                        src={certificate.issuerLogo || "/images/logo.png"} 
                        alt={certificate.issuer} 
                        width={180}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">Certificate ID</div>
                      <div className="font-mono text-sm font-medium">{certificate.id}</div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Certificate of Completion</h2>
                    <p className="text-slate-500">This certifies that</p>
                    <p className="text-3xl font-bold text-slate-900 my-4">{certificate.issuedTo}</p>
                    <p className="text-slate-500">has successfully completed</p>
                    <h3 className="text-2xl font-bold text-blue-600 mt-2">{certificate.title}</h3>
                    <p className="text-lg text-slate-700 mt-1">{certificate.credential}</p>
                  </div>
                  
                  <div className="text-slate-600 text-center max-w-2xl mx-auto mb-10">
                    {certificate.description}
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between mb-8 pb-8 border-b border-slate-100">
                    <div className="text-center mb-4 md:mb-0">
                      <div className="text-sm text-slate-500 mb-1">Issued On</div>
                      <div className="font-medium">{certificate.issuedOn}</div>
                    </div>
                    <div className="text-center mb-4 md:mb-0">
                      <div className="text-sm text-slate-500 mb-1">Valid Until</div>
                      <div className="font-medium">{certificate.expiresOn}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-500 mb-1">Issued By</div>
                      <div className="font-medium">{certificate.issuer}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="relative h-20 w-28">
                      <div className="text-6xl text-slate-200 font-bold italic leading-none">SEAL</div>
                    </div>
                    <div className="w-32 h-16 border-b border-slate-800 flex items-end justify-center">
                      <div className="text-sm text-slate-500">Authorized Signature</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Certificate Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-3">
                      <FiAward />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">Credential Type</div>
                      <div className="text-slate-600">{certificate.credential}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-3">
                      <FiCalendar />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">Issued On</div>
                      <div className="text-slate-600">{certificate.issuedOn}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-3">
                      <FiUser />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">Recipient</div>
                      <div className="text-slate-600">{certificate.issuedTo}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-3">
                      <FiFileText />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">ID</div>
                      <div className="text-slate-600 font-mono text-sm">{certificate.id}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-slate-900 mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {certificate.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center text-green-600 mb-4">
                    <FiCheckCircle className="mr-2" />
                    <span className="font-medium">Verified Certificate</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    This certificate can be verified using the link below or by scanning the QR code.
                  </p>
                  <Link 
                    href={certificate.verificationLink} 
                    target="_blank" 
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Verify Certificate
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* More Certificates */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">More Certificates</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                <div className="p-6">
                  <h3 className="font-semibold text-slate-900">
                    {i === 1 ? 'Data Science Fundamentals' : i === 2 ? 'Cloud Computing Essentials' : 'UI/UX Design Principles'}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">Issued on {i === 1 ? 'January 10, 2023' : i === 2 ? 'March 22, 2023' : 'November 5, 2022'}</p>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      Credential ID: CERT-2023-{8000 + i}
                    </div>
                    <Link 
                      href={`/certificate/CERT-2023-${8000 + i}`}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 