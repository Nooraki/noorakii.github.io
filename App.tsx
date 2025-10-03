
import React, { useState, useCallback } from 'react';
import { AppState } from './types';
import { editImageWithNanoBanana } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';
import FileUploader from './components/FileUploader';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setError(null);
    if (!file) {
      setImageFile(null);
      setOriginalImagePreview(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`حجم فایل بیش از حد مجاز است (${MAX_FILE_SIZE_MB} مگابایت)`);
      setImageFile(null);
      setOriginalImagePreview(null);
      return;
    }
    
    setImageFile(file);
    setOriginalImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = useCallback(async () => {
    if (!imageFile || !prompt) {
      setError('لطفاً یک تصویر بارگذاری کرده و یک متن وارد کنید.');
      return;
    }

    setAppState(AppState.PROCESSING);
    setError(null);
    setGeneratedImage(null);

    try {
      const { base64Data, mimeType } = await fileToBase64(imageFile);
      const resultBase64 = await editImageWithNanoBanana(base64Data, mimeType, prompt);

      if (resultBase64) {
        setGeneratedImage(`data:${mimeType};base64,${resultBase64}`);
        setAppState(AppState.RESULT);
      } else {
        throw new Error('پاسخی از سرویس دریافت نشد. لطفاً دوباره تلاش کنید.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'یک خطای ناشناخته رخ داد.');
      setAppState(AppState.IDLE);
    }
  }, [imageFile, prompt]);

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setImageFile(null);
    setOriginalImagePreview(null);
    setPrompt('');
    setGeneratedImage(null);
    setError(null);
  };
  
  const handleRegenerate = () => {
      setAppState(AppState.IDLE);
      setGeneratedImage(null);
      setError(null);
  }

  const renderContent = () => {
    switch (appState) {
      case AppState.PROCESSING:
        return (
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-lg text-gray-300 mt-4">در حال تولید تصویر... لطفاً صبر کنید</p>
          </div>
        );
      case AppState.RESULT:
        return (
          <ResultDisplay
            originalImage={originalImagePreview!}
            generatedImage={generatedImage!}
            prompt={prompt}
            onRegenerate={handleRegenerate}
            onNewImage={handleReset}
          />
        );
      case AppState.IDLE:
      default:
        return (
          <div className="w-full max-w-lg space-y-6">
            <FileUploader
              onFileSelect={handleFileChange}
              previewUrl={originalImagePreview}
            />
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                متن یا پرامپت (فارسی یا انگلیسی)
              </label>
              <textarea
                id="prompt"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="مثال: یک گربه فضانورد روی ماه اضافه کن"
              />
            </div>
            {error && <p className="text-red-400 text-center">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={!imageFile || !prompt}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
            >
              تولید تصویر
            </button>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            تبدیل تصویر با نانو بنانا
          </h1>
          <p className="text-gray-400 mt-2">تصویر خود را بارگذاری کرده و با یک دستور متنی، آن را ویرایش کنید</p>
        </header>
        <main className="w-full flex justify-center">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
