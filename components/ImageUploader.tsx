import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageAsset } from '../types';

interface ImageUploaderProps {
  onImageSelected: (image: ImageAsset | null) => void;
  selectedImage: ImageAsset | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, selectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix for API usage if needed, but for display we keep it.
      // The API service handles stripping usually, but here we store pure base64 in data prop if we strip,
      // or we just pass the full string and let service handle it.
      // Let's store the raw base64 data without prefix in the `data` field for the API service to be cleaner.
      const base64Data = base64String.split(',')[1];
      
      onImageSelected({
        data: base64Data,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    onImageSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />

      {selectedImage ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shadow-md">
           <img 
            src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} 
            alt="Original Upload" 
            className="w-full h-64 object-contain"
          />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors backdrop-blur-sm"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs text-center text-white backdrop-blur-sm">
            Original Image
          </div>
        </div>
      ) : (
        <div
          className={`relative h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer
            ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="p-4 rounded-full bg-slate-700/50 mb-4">
            <Upload className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-300">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-slate-500 mt-2">
            PNG, JPG up to 10MB
          </p>
        </div>
      )}
    </div>
  );
};
