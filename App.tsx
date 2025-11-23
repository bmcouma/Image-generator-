import React, { useState } from 'react';
import { Wand2, Download, Image as ImageIcon, RotateCcw, Sparkles, Layers } from 'lucide-react';
import { generateOrEditImage } from './services/geminiService';
import { AppMode, ImageAsset } from './types';
import { Button } from './components/Button';
import { ImageUploader } from './components/ImageUploader';

const EXAMPLE_PROMPT = `Create a professional LinkedIn banner for Bravin Ouma and Teklini Technologies. Use a deep blue digital technology theme with soft glowing network lines and futuristic light effects. Place the Teklini Technologies logo clearly on the left side. Add the text on the right side with clean, modern typography: "The Future of Technology" as the main headline.`;

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description for the image.");
      return;
    }
    if (mode === AppMode.EDIT && !selectedImage) {
      setError("Please upload an image to edit.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await generateOrEditImage(prompt, mode === AppMode.EDIT ? selectedImage! : undefined);
      setResultImage(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while processing the image.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadExamplePrompt = () => {
    setPrompt(EXAMPLE_PROMPT);
    if (mode === AppMode.EDIT) {
      // Switch to Generate mode for this specific example as it describes creating something new
      setMode(AppMode.GENERATE);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `nanogen-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              NanoGen Studio
            </h1>
          </div>
          <div className="text-xs font-medium text-indigo-400 border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 rounded-full">
            Powered by Gemini 2.5 Flash Image
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Mode Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800 p-1 rounded-xl inline-flex shadow-lg shadow-black/20">
            <button
              onClick={() => handleModeChange(AppMode.GENERATE)}
              className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === AppMode.GENERATE 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Generate
            </button>
            <button
              onClick={() => handleModeChange(AppMode.EDIT)}
              className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === AppMode.EDIT 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Layers className="w-4 h-4 mr-2" />
              Edit Image
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Wand2 className="w-5 h-5 mr-2 text-indigo-400" />
                {mode === AppMode.EDIT ? 'Edit Configuration' : 'Generation Settings'}
              </h2>

              {/* Upload Area for Edit Mode */}
              {mode === AppMode.EDIT && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Source Image
                  </label>
                  <ImageUploader 
                    onImageSelected={setSelectedImage} 
                    selectedImage={selectedImage} 
                  />
                </div>
              )}

              {/* Prompt Input */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="prompt" className="block text-sm font-medium text-slate-400">
                    Prompt
                  </label>
                  <button 
                    onClick={loadExamplePrompt}
                    className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    Try example
                  </button>
                </div>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    mode === AppMode.EDIT 
                    ? "Describe how to change the image (e.g., 'Add a retro filter', 'Make it snowy')..."
                    : "Describe the image you want to create..."
                  }
                  className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600 resize-none"
                />
              </div>

              {/* Action Button */}
              <Button 
                onClick={handleGenerate}
                isLoading={isLoading}
                disabled={mode === AppMode.EDIT && !selectedImage}
                className="w-full py-3 text-base shadow-lg shadow-indigo-500/20"
                icon={<Sparkles size={18} />}
              >
                {mode === AppMode.EDIT ? 'Edit Image' : 'Generate Image'}
              </Button>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Instructions / Tips */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Pro Tips</h3>
              <ul className="text-sm text-slate-500 space-y-2 list-disc pl-4">
                {mode === AppMode.EDIT ? (
                  <>
                    <li>Upload a clear, high-quality image for best results.</li>
                    <li>Be specific about what you want to change vs keep.</li>
                    <li>Try commands like "Change background to..." or "Add a hat".</li>
                  </>
                ) : (
                  <>
                    <li>Describe lighting, style, and mood.</li>
                    <li>Mention specific colors or artistic styles (e.g., "Cyberpunk", "Oil painting").</li>
                    <li>Complex prompts yield more detailed results.</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 h-full min-h-[500px] flex flex-col shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Result</h2>
                {resultImage && (
                  <Button 
                    variant="secondary" 
                    onClick={handleDownload}
                    icon={<Download size={16} />}
                    className="!py-1.5 !px-3 !text-xs"
                  >
                    Download
                  </Button>
                )}
              </div>

              <div className="flex-1 rounded-xl bg-slate-900/50 border-2 border-dashed border-slate-700 overflow-hidden relative flex items-center justify-center">
                {isLoading ? (
                  <div className="text-center p-8">
                     <div className="inline-block relative w-20 h-20 mb-4">
                       <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/30 rounded-full"></div>
                       <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 rounded-full animate-spin"></div>
                     </div>
                     <p className="text-indigo-300 font-medium animate-pulse">Dreaming up pixels...</p>
                     <p className="text-slate-500 text-xs mt-2">This usually takes a few seconds</p>
                  </div>
                ) : resultImage ? (
                  <img 
                    src={resultImage} 
                    alt="Generated Result" 
                    className="w-full h-full object-contain animate-in fade-in duration-700"
                  />
                ) : (
                  <div className="text-center p-8 text-slate-600">
                    <div className="bg-slate-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="w-10 h-10 opacity-50" />
                    </div>
                    <p className="font-medium mb-1">No image generated yet</p>
                    <p className="text-sm">
                      {mode === AppMode.EDIT 
                        ? 'Upload an image and describe your edits to see magic happen.' 
                        : 'Describe your imagination to bring it to life.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
