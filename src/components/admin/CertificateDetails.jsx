'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import ImageUploader from './ImageUploader';
import { FiSave, FiTrash2, FiEye } from 'react-icons/fi';
import Certificate from '../Certificate';

export default function CertificateDetails({ 
  certificate = null,
  onSave = () => {},
  onDelete = () => {},
  isLoading = false
}) {
  const [previewMode, setPreviewMode] = useState(false);
  const [certificateData, setCertificateData] = useState({
    id: '',
    recipientName: '',
    courseName: '',
    issueDate: '',
    expiryDate: '',
    issuerName: '',
    issuerLogo: '',
    signature: '',
    verificationUrl: '',
    backgroundImage: '/certificate-bg.jpg'
  });

  const { register, handleSubmit, setValue, watch, formState: { errors, isDirty } } = useForm({
    defaultValues: certificateData
  });

  // Update form when certificate data changes
  useEffect(() => {
    if (certificate) {
      const formattedCertificate = {
        ...certificate,
        issueDate: certificate.issueDate ? format(new Date(certificate.issueDate), 'yyyy-MM-dd') : '',
        expiryDate: certificate.expiryDate ? format(new Date(certificate.expiryDate), 'yyyy-MM-dd') : '',
      };
      
      Object.entries(formattedCertificate).forEach(([key, value]) => {
        setValue(key, value || '');
      });
      
      setCertificateData(formattedCertificate);
    }
  }, [certificate, setValue]);

  // Watch for form changes to update preview
  const watchedValues = watch();
  useEffect(() => {
    setCertificateData({
      ...certificateData,
      ...watchedValues
    });
  }, [watchedValues]);

  const onSubmit = (data) => {
    // Format dates back to ISO strings for API
    const formattedData = {
      ...data,
      issueDate: data.issueDate ? new Date(data.issueDate).toISOString() : null,
      expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : null
    };
    onSave(formattedData);
  };

  const handleImageChange = (field, imageUrl) => {
    setValue(field, imageUrl, { shouldDirty: true });
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">{certificate?.id ? 'Edit Certificate' : 'Create Certificate'}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <FiEye className="h-4 w-4" />
            <span>{previewMode ? 'Edit Mode' : 'Preview'}</span>
          </button>
        </div>
      </div>

      {previewMode ? (
        <div className="p-6">
          <Certificate 
            certificateData={certificateData}
            showControls={false}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  {...register('recipientName', { required: 'Recipient name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.recipientName && <p className="mt-1 text-sm text-red-600">{errors.recipientName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                <input
                  type="text"
                  {...register('courseName', { required: 'Course name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.courseName && <p className="mt-1 text-sm text-red-600">{errors.courseName.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    {...register('issueDate', { required: 'Issue date is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.issueDate && <p className="mt-1 text-sm text-red-600">{errors.issueDate.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    {...register('expiryDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issuer Name</label>
                <input
                  type="text"
                  {...register('issuerName', { required: 'Issuer name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.issuerName && <p className="mt-1 text-sm text-red-600">{errors.issuerName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification URL</label>
                <input
                  type="text"
                  {...register('verificationUrl')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issuer Logo</label>
                <ImageUploader
                  initialImage={certificateData.issuerLogo}
                  onImageChange={(imageUrl) => handleImageChange('issuerLogo', imageUrl)}
                  label="Upload Issuer Logo"
                  height="150px"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Signature</label>
                <ImageUploader
                  initialImage={certificateData.signature}
                  onImageChange={(imageUrl) => handleImageChange('signature', imageUrl)}
                  label="Upload Signature"
                  height="100px"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
                <ImageUploader
                  initialImage={certificateData.backgroundImage}
                  onImageChange={(imageUrl) => handleImageChange('backgroundImage', imageUrl)}
                  label="Upload Background"
                  height="150px"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8 border-t pt-4">
            {certificate?.id && (
              <button
                type="button"
                onClick={() => onDelete(certificate.id)}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
              >
                <FiTrash2 className="h-5 w-5" />
                <span>Delete</span>
              </button>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                disabled={isLoading || !isDirty}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="h-5 w-5" />
                <span>Save Certificate</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
} 