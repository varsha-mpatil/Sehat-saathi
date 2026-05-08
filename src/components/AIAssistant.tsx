import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sendMessageToGemini } from '@/src/services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Namaste! I am Saathi AI. How can I help you with your health or using Sehat Saathi today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const aiResponse = await sendMessageToGemini(input, history);
      
      const modelMessage: Message = {
        role: 'model',
        text: aiResponse || "I'm sorry, I couldn't process that. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'model',
        text: "I'm having trouble connecting right now. Please check your internet connection or try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '64px' : '500px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-4 flex flex-col transition-all duration-300 ${
              isMinimized ? 'w-72' : 'w-80 md:w-96'
            }`}
          >
            {/* Header */}
            <div className="bg-[#00274C] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#167E00] rounded-2xl flex items-center justify-center shadow-inner">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Saathi AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-blue-100 font-medium uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200">
                  {messages.map((m, i) => (
                    <div 
                      key={i} 
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${
                        m.role === 'user' 
                          ? 'bg-[#167E00] text-white rounded-tr-none font-medium' 
                          : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none leading-relaxed'
                      }`}>
                        {m.text}
                        <div className={`text-[9px] mt-1.5 opacity-50 ${m.role === 'user' ? 'text-white' : 'text-gray-400'}`}>
                          {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-[#167E00] animate-spin" />
                        <span className="text-xs text-gray-400 font-medium">Saathi is thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask anything about health..."
                      className="w-full pl-4 pr-12 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#167E00]/20 transition-all placeholder:text-gray-400 font-medium"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="absolute right-1.5 p-2 bg-[#167E00] text-white rounded-xl hover:bg-[#00274C] disabled:opacity-50 disabled:hover:bg-[#167E00] transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[9px] text-center text-gray-400 mt-2 font-medium">
                    AI can make mistakes. Consult a doctor for medical advice.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
        }}
        className={`w-16 h-16 rounded-[28px] shadow-2xl flex items-center justify-center transition-all duration-500 relative group ${
          isOpen ? 'bg-[#00274C] rotate-90' : 'bg-[#167E00]'
        }`}
      >
        {isOpen ? <X className="w-7 h-7 text-white" /> : <MessageCircle className="w-8 h-8 text-white" />}
        {!isOpen && (
          <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full animate-bounce" />
        )}
        <div className="absolute left-20 bg-[#00274C] text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 -translate-x-2 group-hover:translate-x-0 whitespace-nowrap shadow-xl">
          Talk to Saathi AI
        </div>
      </motion.button>
    </div>
  );
};
