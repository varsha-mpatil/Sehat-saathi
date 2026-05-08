import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Send, Activity, ShieldCheck, RefreshCw, AlertCircle, Volume2 } from 'lucide-react';
import { checkSymptoms } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';

interface SymptomResult {
  condition: string;
  severity: string;
  recommendation: string;
  localLanguageAdvice: string;
  isEmergency?: boolean;
}

const SymptomChecker: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SymptomResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      const langMap: Record<string, string> = {
        'EN': 'en-US',
        'HI': 'hi-IN',
        'KN': 'kn-IN'
      };
      recognitionRef.current.lang = langMap[language] || 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setError('Could not access microphone. Please check permissions.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setError(null);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleCheck = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await checkSymptoms(input, language);
      setResult(data);
    } catch (err) {
      console.error("AI Error:", err);
      setError('AI engine error. Please ensure GEMINI_API_KEY is set or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const speakResult = () => {
    if (!result) return;
    const textToSpeak = language === 'EN' ? result.recommendation : result.localLanguageAdvice;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const langMap: Record<string, string> = {
      'EN': 'en-US',
      'HI': 'hi-IN',
      'KN': 'kn-IN'
    };
    utterance.lang = langMap[language] || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section id="symptom-checker" className="py-24 bg-green-50/50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-green-100 flex flex-col md:flex-row">
          {/* Input Side */}
          <div className="flex-1 p-10 space-y-8 border-b md:border-b-0 md:border-r border-green-50">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-[#167e00] text-xs font-bold uppercase tracking-wider">
                <Activity className="w-3 h-3" />
                AI Diagnostic Engine
              </div>
              <h3 className="text-3xl font-bold text-[#00274c]">{t.symptomChecker}</h3>
              <p className="text-gray-500 text-sm">Tell us how you're feeling. I can understand Hindi, Kannada and English.</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setLanguage('EN')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${language === 'EN' ? 'bg-[#00274c] text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                English
              </button>
              <button 
                onClick={() => setLanguage('HI')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${language === 'HI' ? 'bg-[#167e00] text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                Hindi / हिंदी
              </button>
              <button 
                onClick={() => setLanguage('KN')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${language === 'KN' ? 'bg-orange-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                Kannada / ಕನ್ನಡ
              </button>
            </div>

            <div className="relative group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === 'EN' ? 'Describe your symptoms here...' : 'ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಇಲ್ಲಿ ವಿವರಿಸಿ...'}
                className="w-full h-40 p-6 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-[#167e00] focus:bg-white resize-none transition-all text-lg font-medium outline-none"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={toggleListening}
                  className={`p-4 rounded-2xl transition-all shadow-lg ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-[#167e00] hover:bg-[#167e00] hover:text-white'}`}
                  title="Voice Input"
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <button
                  onClick={handleCheck}
                  disabled={isLoading || !input.trim()}
                  className="p-4 bg-[#00274c] text-white rounded-2xl hover:bg-[#167e00] transition-all disabled:opacity-50 shadow-lg"
                >
                  {isLoading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Results Side */}
          <div className="w-full md:w-[350px] bg-[#00274c] p-10 text-white relative flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <p className="text-[10px] font-black uppercase text-green-400 tracking-[0.2em] mb-2">Diagnosis Result</p>
                    <h4 className="text-2xl font-bold">{result.condition}</h4>
                  </div>

                  <div className={`p-4 rounded-2xl backdrop-blur-sm border ${result.isEmergency ? 'bg-red-500/20 border-red-500/30' : 'bg-white/10 border-white/10'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-white/60">Severity</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${result.severity === 'High' || result.isEmergency ? 'bg-red-500' : 'bg-green-500'}`}>
                        {result.isEmergency ? 'EMERGENCY' : result.severity}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Medical Advice</p>
                      <p className="text-sm font-medium text-white/80 leading-relaxed italic">
                        {result.recommendation}
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl">
                      <p className="text-xs text-green-300 font-bold mb-1">Precaution / Advisor Tip:</p>
                      <p className="text-sm font-medium">{result.localLanguageAdvice}</p>
                    </div>
                  </div>

                  <button 
                    onClick={speakResult}
                    className="flex items-center gap-2 text-xs font-bold text-green-400 hover:text-green-300 transition-colors uppercase tracking-widest pt-4"
                  >
                    <Volume2 className="w-4 h-4" /> Listen to Advice
                  </button>

                  <button 
                    onClick={() => setResult(null)}
                    className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all border border-white/10"
                  >
                    Check Another Symptom
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-10 h-10 text-white/40" />
                  </div>
                  <h4 className="text-xl font-bold">Analysis Ready</h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Our AI models process data securely via encrypted cloud protocols to ensure high accuracy while maintaining your privacy. Just type or speak to begin.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-6 left-10 right-10">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: isLoading ? '100%' : '0%' }}
                  className="h-full bg-green-500"
                />
              </div>
              <p className="text-[10px] text-center mt-2 text-white/20 font-bold uppercase tracking-widest">SaathiShield Protocol Active</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SymptomChecker;
