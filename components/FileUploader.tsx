
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './Icon';

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  previewUrl: string | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, previewUrl }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleRemoveImage = () => {
    onFileSelect(null);
  };

  if (previewUrl) {
    return (
      <div className="relative w-full aspect-square max-w-md mx-auto">
        <img src={previewUrl} alt="پیش‌نمایش تصویر" className="rounded-lg object-cover w-full h-full" />
        <button
          onClick={handleRemoveImage}
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors"
          aria-label="حذف تصویر"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative w-full max-w-lg border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-gray-800' : 'border-gray-600 hover:border-gray-500'}`}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
      />
      <div className="flex flex-col items-center justify-center text-gray-400">
        <UploadIcon className="w-12 h-12 mb-4" />
        <p className="font-semibold">
          <label htmlFor="file-upload" className="text-indigo-400 cursor-pointer">بارگذاری تصویر</label> یا فایل را اینجا بکشید
        </p>
        <p className="text-xs mt-1">JPEG, PNG, WEBP (حداکثر ۲۰ مگابایت)</p>
      </div>
    </div>
  );
};

export default FileUploader;
