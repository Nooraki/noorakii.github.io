
import React from 'react';
import { DownloadIcon, RedoIcon, NewImageIcon } from './Icon';

interface ResultDisplayProps {
  originalImage: string;
  generatedImage: string;
  prompt: string;
  onRegenerate: () => void;
  onNewImage: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  originalImage,
  generatedImage,
  prompt,
  onRegenerate,
  onNewImage,
}) => {
  return (
    <div className="w-full max-w-4xl animate-fade-in">
      <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-400">تصویر شما آماده شد!</h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">«{prompt}»</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-300">تصویر اصلی</h3>
          <img src={originalImage} alt="تصویر اصلی" className="rounded-xl shadow-lg w-full h-auto aspect-square object-cover" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-300">تصویر تولید شده</h3>
          <img src={generatedImage} alt="تصویر تولید شده" className="rounded-xl shadow-lg w-full h-auto aspect-square object-cover border-2 border-indigo-500" />
        </div>
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href={generatedImage}
          download="generated-image.png"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
        >
          <DownloadIcon className="w-5 h-5" />
          دانلود تصویر
        </a>
         <button
          onClick={onRegenerate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300"
        >
          <RedoIcon className="w-5 h-5" />
          تولید مجدد
        </button>
        <button
          onClick={onNewImage}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-indigo-400 font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
        >
           <NewImageIcon className="w-5 h-5" />
          بارگذاری تصویر جدید
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
