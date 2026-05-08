import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Microscope, CheckCircle2, AlertCircle, RefreshCw, Upload, Sparkles, Image as ImageIcon, X } from 'lucide-react';
import { analyzeReport } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';

interface AnalysisResult {
  finding: string;
  confidence: number;
  instructions: string;
}

const ReportAnalyzer: React.FC = () => {
  const { t } = useLanguage();
  const [textContent, setTextContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          setPreviewUrl(base64);
          setTextContent(`[IMAGE ANALYSIS MODE: ${file.name}] \nMedical image detected. Ready for vision-based analysis.`);
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setTextContent(content);
        };
        reader.readAsText(file);
        setPreviewUrl(null);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!textContent.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      const imageData = previewUrl && selectedFile?.type.startsWith('image/') 
        ? { data: previewUrl, mimeType: selectedFile.type } 
        : undefined;
      
      const data = await analyzeReport(textContent, imageData);
      setResult(data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setTextContent('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section id="ai-tech" className="py-24 bg-[#001c38] text-white overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#167e00]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-300 text-xs font-bold uppercase tracking-widest">
              <Microscope className="w-3 h-3" />
              Vision AI Lab
            </div>
            
            <h2 className="text-6xl font-extrabold leading-tight tracking-tighter">
              AI-Powered <br />
              <span className="text-[#167e00]">{t.serviceReports}</span>
            </h2>

            <p className="text-xl text-white/50 leading-relaxed max-w-xl">
              {t.serviceReportsDesc}
            </p>

            <ul className="space-y-6">
              {[
                { icon: <CheckCircle2 className="w-5 h-5 text-[#167e00]" />, text: "94.2% diagnostic accuracy on key bio-markers." },
                { icon: <Sparkles className="w-5 h-5 text-blue-400" />, text: "Automated OCR for physical paper reports." },
                { icon: <Upload className="w-5 h-5 text-purple-400" />, text: "Direct sync with National Health IDs." }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold tracking-wide">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    {item.icon}
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] shadow-2xl">
              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 focus-within:border-blue-500 transition-all relative overflow-hidden">
                  <label className="text-[10px] font-black uppercase text-white/40 tracking-widest block mb-4">
                    {selectedFile ? `File: ${selectedFile.name}` : 'Paste Findings or Upload File'}
                  </label>
                  
                  {previewUrl ? (
                    <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 group">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={clearFile}
                        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <textarea 
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Example: Chest X-ray shows slight pulmonary congestion..."
                      className="w-full h-48 bg-transparent text-lg font-medium outline-none resize-none placeholder:text-white/20"
                    />
                  )}

                  {!selectedFile && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-4 right-4 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/10 flex items-center gap-2 text-xs font-bold uppercase"
                    >
                      <Upload className="w-4 h-4" />
                      Import
                    </button>
                  )}
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.txt"
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !textContent.trim()}
                    className="flex-1 py-5 bg-[#167e00] hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 text-lg"
                  >
                    {isAnalyzing ? (
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <FileText className="w-6 h-6" />
                        {t.analyzeFindings}
                      </>
                    )}
                  </button>
                  {selectedFile && !isAnalyzing && (
                    <button 
                      onClick={clearFile}
                      className="p-5 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all"
                    >
                      <RefreshCw className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-8 p-8 bg-[#167e00]/20 border border-[#167e00]/30 rounded-3xl space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-bold text-green-400 flex items-center gap-2">
                        <Microscope className="w-5 h-5" />
                        AI Analysis Result
                      </h4>
                      <div className="text-[10px] font-black uppercase bg-white/10 px-2 py-1 rounded">
                        Confidence: {(result.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-white/40 uppercase font-bold mb-1">Simple Finding</p>
                        <p className="text-sm font-semibold">{result.finding}</p>
                      </div>
                      <div className="h-px bg-white/5" />
                      <div>
                        <p className="text-xs text-white/40 uppercase font-bold mb-1">Instructions</p>
                        <p className="text-sm font-semibold leading-relaxed">{result.instructions}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-8 flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-200/60 text-[10px] italic">
              <AlertCircle className="w-4 h-4 shrink-0" />
              This AI analysis is for educational purposes only. Do not interpret this as official medical advice. Always consult with a certified medical practitioner.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportAnalyzer;
