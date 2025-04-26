'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiCheck, FiArrowLeft } from 'react-icons/fi';
import Footer from '@/components/Footer';
import Certificate from '@/components/Certificate';

export default function SampleVerifyCertificatePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [certificateData, setCertificateData] = useState(null);

  useEffect(() => {
    // Simulate loading a certificate
    const timer = setTimeout(() => {
      setCertificateData({
        id: 'SAMPLE-CERTIFICATE',
        recipientName: 'Sample Student',
        courseName: 'Web Development Masterclass',
        issueDate: new Date().toISOString(),
        issuerName: 'CertifyTrack',
        issuerLogo: '/logo.png',
        verificationUrl: `${window.location.origin}/verify-certificate/sample`,
        backgroundImage: '/certificate/bg.png'
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">CertifyTrack</Link>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" />
            <span>Home</span>
          </Link>
        </div>
        
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Certificate Verification</h1>
          
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Verifying certificate...</span>
            </div>
          )}
          
          {!isLoading && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                  <FiCheck className="w-10 h-10" />
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-green-600 mb-4">
                Sample Certificate - Valid
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="font-medium text-gray-800">Sample Student</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Course</p>
                  <p className="font-medium text-gray-800">Web Development Masterclass</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Issue Date</p>
                  <p className="font-medium text-gray-800">
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Completion</p>
                  <p className="font-medium text-gray-800">100%</p>
                </div>
              </div>
              
              <div className="mt-8 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Certificate Preview</h3>
                <Certificate 
                  certificateData={certificateData}
                  showControls={true}
                  className="mb-4"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800 mt-6">
                <p className="text-sm"><strong>Note:</strong> This is a sample certificate for demonstration purposes only.</p>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 