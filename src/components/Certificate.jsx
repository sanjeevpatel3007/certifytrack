'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FiDownload, FiShare2 } from 'react-icons/fi';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import CertificateBackground from '@/app/certificate-background';
import { useSearchParams } from 'next/navigation';

export default function Certificate({ 
  certificateData = {
    id: '',
    recipientName: '',
    courseName: '',
    issueDate: '',
    expiryDate: '',
    issuerName: '',
    issuerLogo: '',
    signature: '',
    verificationUrl: '',
    backgroundImage: '/certificate/bg.png'
  },
  showControls = true,
  className = ''
}) {
  const certificateRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  
  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadCertificate = useCallback(async () => {
    if (!certificateRef.current) return;
    
    setIsLoading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      
      const link = document.createElement('a');
      link.download = `${certificateData.recipientName}-Certificate.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating certificate:', error);
    } finally {
      setIsLoading(false);
    }
  }, [certificateData.recipientName]);
  
  const shareCertificate = useCallback(async () => {
    if (!certificateRef.current || !navigator.share) return;
    
    setIsLoading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `${certificateData.recipientName}-Certificate.png`, { type: 'image/png' });
        
        try {
          await navigator.share({
            title: `Certificate for ${certificateData.courseName}`,
            text: `${certificateData.recipientName}'s Certificate of Completion for ${certificateData.courseName}`,
            files: [file]
          });
        } catch (err) {
          console.error('Error sharing certificate:', err);
        } finally {
          setIsLoading(false);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error generating certificate for sharing:', error);
      setIsLoading(false);
    }
  }, [certificateData.recipientName, certificateData.courseName]);

  // Auto-download if URL has download=true parameter
  useEffect(() => {
    if (searchParams.get('download') === 'true') {
      downloadCertificate();
    }
  }, [searchParams, downloadCertificate]);

  return (
    <div className={`${className}`}>
      {/* Certificate Card */}
      <div 
        ref={certificateRef}
        className="relative w-full aspect-[1.414/1] bg-white shadow-lg rounded-lg overflow-hidden"
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >
        {/* Background Image or SVG Background */}
        {certificateData.backgroundImage ? (
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/certificate/bg.png"
              alt="Certificate Background"
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full">
            <CertificateBackground 
              primaryColor="#4285F4"
              secondaryColor="#34A853"
            />
          </div>
        )}
        
        {/* Certificate Content */}
        <div className="relative z-10 p-4 sm:p-8 flex flex-col items-center justify-between h-full text-center">
          {/* Header */}
          <div className="w-full">
            {certificateData.issuerLogo && (
              <div className="flex justify-center mb-4">
                <Image
                  src={certificateData.issuerLogo}
                  alt={certificateData.issuerName || "Issuer"}
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">CERTIFICATE OF COMPLETION</h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-4 sm:mb-6"></div>
          </div>
          
          {/* Certificate Body */}
          <div className="flex-1 flex flex-col justify-center py-3 sm:py-6">
            <p className="text-base sm:text-lg text-gray-600 mb-2">This is to certify that</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2">{certificateData.recipientName || "Recipient Name"}</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">has successfully completed the course</p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 px-2">{certificateData.courseName || "Course Name"}</h3>
            
            <div className="flex justify-center gap-6 sm:gap-10 text-gray-700 mb-4 sm:mb-6">
              <div>
                <p className="text-xs sm:text-sm font-semibold">ISSUED ON</p>
                <p className="text-sm sm:text-base">{formatDate(certificateData.issueDate) || "Date of Issue"}</p>
              </div>
              {certificateData.expiryDate && (
                <div>
                  <p className="text-xs sm:text-sm font-semibold">VALID UNTIL</p>
                  <p className="text-sm sm:text-base">{formatDate(certificateData.expiryDate)}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="w-full">
            <div className="flex justify-between items-end">
              {/* Signature */}
              <div className="flex-1 flex flex-col items-center">
                {certificateData.signature && (
                  <div className="h-12 sm:h-16 mb-1">
                    <Image
                      src={certificateData.signature}
                      alt="Signature"
                      width={150}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="w-24 sm:w-32 border-t border-gray-400 mb-1"></div>
                <p className="text-xs sm:text-sm text-gray-700">{certificateData.issuerName || "Issuer"}</p>
              </div>
              
              {/* QR Code */}
              {certificateData.verificationUrl && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 p-1 bg-white">
                    <QRCode
                      value={certificateData.verificationUrl}
                      size={80}
                      level="H"
                      fgColor="#000000"
                      bgColor="#FFFFFF"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Scan to verify</p>
                </div>
              )}
            </div>
            
            {/* Certificate ID */}
            <div className="mt-3 sm:mt-4 text-center">
              <p className="text-xs text-gray-500">Certificate ID: {certificateData.id || "ID-00000000"}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      {showControls && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={downloadCertificate}
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-1"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FiDownload className="h-5 w-5" />
                <span>Download</span>
              </>
            )}
          </button>
          
          {navigator?.share && (
            <button
              onClick={shareCertificate}
              disabled={isLoading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-70"
            >
              <FiShare2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
} 