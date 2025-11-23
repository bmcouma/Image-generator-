import React, { useState, useEffect } from 'react';
import { Wand2, Download, Image as ImageIcon, RotateCcw, Sparkles, Layers, History, Trash2, Eye, EyeOff, Monitor, Smartphone, Square, Linkedin, Share2, Server, ShieldCheck, Cpu, Code, User, X } from 'lucide-react';
import { generateOrEditImage } from './services/geminiService';
import { AppMode, ImageAsset, AspectRatio, HistoryItem } from './types';
import { Button } from './components/Button';
import { ImageUploader } from './components/ImageUploader';
import { TekliniLogo } from './components/TekliniLogo';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem('teklini_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const saveToHistory = (imageUrl: string, usedPrompt: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      imageUrl,
      prompt: usedPrompt,
      timestamp: Date.now(),
      mode,
      aspectRatio
    };
    const updated = [newItem, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('teklini_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('teklini_history');
  };

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
      const result = await generateOrEditImage(
        prompt, 
        mode === AppMode.EDIT ? selectedImage! : undefined,
        aspectRatio
      );
      setResultImage(result);
      saveToHistory(result, prompt);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while processing the image.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyPreset = (presetPrompt: string, ratio: AspectRatio = '16:9') => {
    setPrompt(presetPrompt);
    setAspectRatio(ratio);
    if (mode === AppMode.EDIT) setMode(AppMode.GENERATE);
  };

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `teklini-asset-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const AspectRatioButton = ({ ratio, icon: Icon, label }: { ratio: AspectRatio, icon: any, label: string }) => (
    <button
      onClick={() => setAspectRatio(ratio)}
      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
        aspectRatio === ratio
          ? 'bg-brand-blue/30 border-brand-accent text-brand-accent shadow-lg shadow-brand-accent/10'
          : 'bg-teklini-900 border-teklini-800 text-teklini-400 hover:bg-teklini-800 hover:text-teklini-200'
      }`}
    >
      <Icon className="w-5 h-5 mb-1" />
      <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#020914] text-slate-100 selection:bg-brand-accent/30 font-sans">
      
      {/* Navbar */}
      <header className="border-b border-teklini-800/50 bg-[#020914]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <TekliniLogo />
          </div>
          
          <div className="flex items-center gap-6">
             {/* System Status Indicator - Professional Touch */}
             <div className="hidden md:flex flex-col items-end mr-4">
                <div className="flex items-center space-x-2 text-[10px] font-bold text-teklini-400 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  <span>Gemini 2.5 Active</span>
                </div>
                <span className="text-[10px] text-teklini-600 font-mono">v2.5.0-PRO</span>
             </div>

             {/* Profile Button */}
             <button 
               onClick={() => setShowProfile(true)}
               className="p-2 rounded-full bg-teklini-800/50 hover:bg-teklini-700 border border-teklini-700 transition-all text-teklini-300 hover:text-white"
               title="Founder Profile"
             >
               <User size={20} />
             </button>
          </div>
        </div>
      </header>

      {/* Founder Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b1623] border border-teklini-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-teklini-800 flex justify-between items-start bg-gradient-to-r from-teklini-900 to-[#0b1623]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-blue to-teklini-600 flex items-center justify-center text-2xl font-bold text-white border-2 border-brand-silver/30 shadow-lg">
                  BO
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Bravin Ouma</h2>
                  <p className="text-brand-accent font-medium text-sm">Founder, Teklini Technologies</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-teklini-800 text-teklini-300 border border-teklini-700">Full Stack</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-teklini-800 text-teklini-300 border border-teklini-700">AI Engineer</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-teklini-800 text-teklini-300 border border-teklini-700">Digital Strategist</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowProfile(false)} className="text-teklini-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh]">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-brand-silver mb-3 flex items-center">
                  <Code className="w-4 h-4 mr-2" /> Engineering & Infrastructure
                </h3>
                <p className="text-sm text-teklini-300 leading-relaxed">
                  Building robust digital infrastructure with full-stack expertise. From hands-on software engineering to managing secure, reliable networks and systems. Leveraging the Power Learn Project AI program to integrate automation into every layer of development.
                </p>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-brand-silver mb-3 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2" /> Security & Strategy
                </h3>
                <p className="text-sm text-teklini-300 leading-relaxed">
                   Cybersecurity-aware development practices ensuring user protection and risk mitigation. Combining technical skill with high-level digital strategy—SEO, content growth, and community building across major social platforms.
                </p>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-brand-silver mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" /> The Teklini Vision
                </h3>
                <p className="text-sm text-teklini-300 leading-relaxed italic border-l-2 border-brand-accent pl-4">
                  "Teklini is not just a service; it's a platform for empowerment. We bridge the gap between complex technology and community impact, delivering clean, professional digital solutions."
                </p>
              </div>
            </div>

            <div className="p-4 bg-teklini-900/50 border-t border-teklini-800 text-center text-xs text-teklini-500">
              © {new Date().getFullYear()} Teklini Technologies. Built for the Future.
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8 pb-40">
        
        {/* Mode Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#0b1623] p-1 rounded-xl inline-flex shadow-2xl border border-teklini-800">
            <button
              onClick={() => handleModeChange(AppMode.GENERATE)}
              className={`flex items-center px-8 py-3 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 ${
                mode === AppMode.GENERATE 
                  ? 'bg-gradient-to-r from-brand-blue to-teklini-700 text-white shadow-lg shadow-brand-blue/30' 
                  : 'text-teklini-400 hover:text-white hover:bg-teklini-800/50'
              }`}
            >
              <Cpu className="w-4 h-4 mr-2" />
              GENERATE
            </button>
            <button
              onClick={() => handleModeChange(AppMode.EDIT)}
              className={`flex items-center px-8 py-3 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 ${
                mode === AppMode.EDIT 
                  ? 'bg-gradient-to-r from-brand-blue to-teklini-700 text-white shadow-lg shadow-brand-blue/30' 
                  : 'text-teklini-400 hover:text-white hover:bg-teklini-800/50'
              }`}
            >
              <Layers className="w-4 h-4 mr-2" />
              ENHANCE
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Configuration */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="glass-panel rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xs uppercase tracking-widest font-bold text-brand-silver mb-6 flex items-center">
                <Wand2 className="w-4 h-4 mr-2 text-brand-accent" />
                Control Center
              </h2>

              {/* Upload Area for Edit Mode */}
              {mode === AppMode.EDIT && (
                <div className="mb-6 animate-in fade-in slide-in-from-left-4 duration-500">
                  <label className="block text-[10px] font-bold text-teklini-300 mb-2 uppercase tracking-wide">
                    Source Asset
                  </label>
                  <ImageUploader 
                    onImageSelected={setSelectedImage} 
                    selectedImage={selectedImage} 
                  />
                </div>
              )}

              {/* Smart Presets - Digital Strategy Feature */}
              <div className="mb-4">
                 <label className="block text-[10px] font-bold text-teklini-300 mb-2 uppercase tracking-wide">
                    Quick Strategies
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button 
                      onClick={() => applyPreset("Create a professional LinkedIn banner for Teklini Technologies. Deep blue digital theme, futuristic light effects, clean typography: 'The Future of Technology'.", "16:9")}
                      className="flex-shrink-0 px-3 py-1.5 bg-teklini-800/50 hover:bg-brand-accent/20 border border-teklini-700 hover:border-brand-accent rounded text-xs text-teklini-300 transition-all"
                    >
                      <Linkedin size={12} className="inline mr-1" /> LinkedIn Banner
                    </button>
                    <button 
                       onClick={() => applyPreset("A minimalist, high-tech logo mockup for a cybersecurity firm named Teklini. Metallic silver finish on matte black background.", "1:1")}
                       className="flex-shrink-0 px-3 py-1.5 bg-teklini-800/50 hover:bg-brand-accent/20 border border-teklini-700 hover:border-brand-accent rounded text-xs text-teklini-300 transition-all"
                    >
                      <ShieldCheck size={12} className="inline mr-1" /> Security Brand
                    </button>
                    <button 
                       onClick={() => applyPreset("Isometric server room diagram with glowing blue cables and data streams, representing robust digital infrastructure.", "16:9")}
                       className="flex-shrink-0 px-3 py-1.5 bg-teklini-800/50 hover:bg-brand-accent/20 border border-teklini-700 hover:border-brand-accent rounded text-xs text-teklini-300 transition-all"
                    >
                      <Server size={12} className="inline mr-1" /> Infra Diagram
                    </button>
                  </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <label htmlFor="prompt" className="block text-[10px] font-bold text-teklini-300 mb-2 uppercase tracking-wide">
                  Directive / Prompt
                </label>
                <div className="relative group">
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      mode === AppMode.EDIT 
                      ? "Instructions: 'Add a cybernetic overlay', 'Make the lighting neon blue'..."
                      : "Describe the asset: 'Futuristic dashboard interface', 'Abstract network nodes'..."
                    }
                    className="w-full h-32 bg-[#06101c] border border-teklini-800 rounded-xl p-4 text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent transition-all placeholder:text-teklini-700 resize-none text-teklini-100 shadow-inner font-mono leading-relaxed"
                  />
                  <div className="absolute bottom-2 right-2 text-[10px] text-teklini-600 font-mono group-focus-within:text-brand-accent transition-colors">
                    {prompt.length} chars
                  </div>
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="mb-8">
                <label className="block text-[10px] font-bold text-teklini-300 mb-2 uppercase tracking-wide">
                  Output Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <AspectRatioButton ratio="1:1" icon={Square} label="Social (1:1)" />
                  <AspectRatioButton ratio="16:9" icon={Monitor} label="Web (16:9)" />
                  <AspectRatioButton ratio="9:16" icon={Smartphone} label="Mobile (9:16)" />
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={handleGenerate}
                isLoading={isLoading}
                disabled={mode === AppMode.EDIT && !selectedImage}
                className="w-full py-4 text-sm uppercase tracking-widest font-bold bg-gradient-to-r from-brand-accent to-brand-blue hover:from-blue-500 hover:to-indigo-600 shadow-lg shadow-brand-blue/40 border border-white/10 rounded-xl"
                icon={<Sparkles size={16} />}
              >
                {mode === AppMode.EDIT ? 'Execute Enhancement' : 'Initialize Generation'}
              </Button>

              {error && (
                <div className="mt-4 p-4 bg-red-950/30 border border-red-500/20 rounded-lg text-red-400 text-xs font-mono flex items-start">
                  <span className="mr-2 text-lg">⚠️</span>
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Output */}
          <div className="lg:col-span-8">
            <div className="glass-panel rounded-2xl p-1 h-full min-h-[600px] flex flex-col shadow-2xl relative overflow-hidden group">
              
              <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-[#020914]/80 to-transparent">
                <h2 className="text-xs font-bold text-teklini-200 uppercase tracking-widest pl-2 flex items-center">
                   <div className="w-2 h-2 bg-brand-accent rounded-full mr-2 animate-pulse"></div>
                   Render Output
                </h2>
                
                <div className="flex space-x-2">
                  {mode === AppMode.EDIT && resultImage && selectedImage && (
                    <button
                      onMouseDown={() => setIsComparing(true)}
                      onMouseUp={() => setIsComparing(false)}
                      onMouseLeave={() => setIsComparing(false)}
                      onTouchStart={() => setIsComparing(true)}
                      onTouchEnd={() => setIsComparing(false)}
                      className="flex items-center px-4 py-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg text-xs font-medium backdrop-blur-md border border-teklini-700 transition-colors cursor-pointer select-none"
                    >
                      {isComparing ? <EyeOff size={14} className="mr-2" /> : <Eye size={14} className="mr-2" />}
                      {isComparing ? 'RELEASE' : 'COMPARE'}
                    </button>
                  )}

                  {resultImage && (
                    <Button 
                      variant="secondary" 
                      onClick={() => handleDownload(resultImage)}
                      icon={<Download size={14} />}
                      className="!py-1.5 !px-4 !text-xs !bg-brand-blue !backdrop-blur-md !border-teklini-600 !text-white"
                    >
                      EXPORT
                    </Button>
                  )}
                </div>
              </div>

              {/* Canvas Area */}
              <div className="flex-1 rounded-xl bg-[#060c16] overflow-hidden relative flex items-center justify-center m-1 border border-teklini-800/30 shadow-inner">
                {/* Tech Grid Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ 
                       backgroundImage: `linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)`, 
                       backgroundSize: '40px 40px' 
                     }}>
                </div>

                {isLoading ? (
                  <div className="text-center z-10">
                     <div className="relative w-24 h-24 mx-auto mb-6">
                       <div className="absolute inset-0 border-t-2 border-brand-accent rounded-full animate-spin"></div>
                       <div className="absolute inset-2 border-r-2 border-teklini-400 rounded-full animate-spin reverse" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                       <div className="absolute inset-0 flex items-center justify-center">
                         <Sparkles className="w-8 h-8 text-white animate-pulse" />
                       </div>
                     </div>
                     <p className="text-sm font-mono text-teklini-300 tracking-wide animate-pulse">
                       [ PROCESSING DATA STREAMS ]
                     </p>
                     <p className="text-teklini-600 text-xs mt-2 font-sans">Gemini 2.5 is synthesizing pixels...</p>
                  </div>
                ) : resultImage ? (
                  <img 
                    src={isComparing && selectedImage ? `data:${selectedImage.mimeType};base64,${selectedImage.data}` : resultImage} 
                    alt="Generated Result" 
                    className="max-w-full max-h-full object-contain shadow-2xl transition-all duration-200"
                  />
                ) : (
                  <div className="text-center p-8 max-w-md">
                    <div className="w-24 h-24 rounded-2xl bg-teklini-900/50 flex items-center justify-center mx-auto mb-6 border border-teklini-800 group-hover:border-brand-accent/50 transition-colors duration-500">
                      <ImageIcon className="w-10 h-10 text-teklini-600 group-hover:text-brand-accent transition-colors duration-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Teklini Workspace</h3>
                    <p className="text-teklini-400 text-sm leading-relaxed">
                      Ready to build the future. Configure your parameters on the left to generate assets that speak for themselves.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* History Filmstrip */}
      {history.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#020914]/95 border-t border-teklini-800 backdrop-blur-xl h-36 z-40 transition-transform duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="flex flex-col justify-center h-full mr-6 border-r border-teklini-800 pr-6 min-w-[120px]">
              <div className="flex items-center text-teklini-400 mb-2">
                <History className="w-4 h-4 mr-2" />
                <span className="text-xs font-bold uppercase tracking-widest">Archives</span>
              </div>
              <button 
                onClick={clearHistory}
                className="flex items-center text-[10px] text-teklini-600 hover:text-red-400 transition-colors mt-1"
              >
                <Trash2 size={10} className="mr-1" /> Clear All
              </button>
            </div>
            
            <div className="flex-1 overflow-x-auto h-full flex items-center space-x-4 py-4 hide-scrollbar">
              {history.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setResultImage(item.imageUrl)}
                  className="relative group min-w-[140px] h-24 rounded-lg overflow-hidden border border-teklini-800 cursor-pointer hover:border-brand-accent transition-all hover:scale-105 shadow-lg bg-black"
                >
                  <img src={item.imageUrl} alt="History" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                  
                  {item.mode === AppMode.EDIT && (
                    <div className="absolute top-1 right-1 bg-brand-blue text-white text-[8px] font-bold px-1.5 py-0.5 rounded border border-white/10">EDIT</div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <p className="text-[9px] text-white truncate font-mono">{item.prompt}</p>
                    <p className="text-[8px] text-teklini-400">{new Date(item.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;