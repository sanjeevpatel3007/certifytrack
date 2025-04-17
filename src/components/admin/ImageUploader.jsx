'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

export default function ImageUploader({
  initialImage = '',
  onImageChange = () => {},
  label = 'Upload Image',
  height = '200px',
  accept = 'image/*'
}) {
  const [image, setImage] = useState(initialImage);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setImage(imageUrl);
      onImageChange(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImage('');
    onImageChange('');
  };

  return (
    <div 
      className={`relative border-2 rounded-lg ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'} 
                 transition-colors cursor-pointer overflow-hidden`}
      style={{ height }}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
      
      {image ? (
        <>
          <img 
            src={image} 
            alt="Uploaded image"
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            onClick={(e) => { 
              e.stopPropagation();
              removeImage();
            }}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
          >
            <FiX className="h-4 w-4 text-red-500" />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <FiUpload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-xs text-gray-500 mt-1">Drag and drop or click to select</p>
        </div>
      )}
    </div>
  );
} 