/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Activity, 
  Smartphone, 
  WifiOff, 
  Stethoscope, 
  FileText, 
  Pill, 
  Globe2, 
  ArrowRight,
  Menu,
  X,
  MessageSquare,
  Video,
  Mic,
  Languages,
  Zap,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import SymptomChecker from './components/SymptomChecker';
import ReportAnalyzer from './components/ReportAnalyzer';
import NetworkStatus from './components/NetworkStatus';
import EmergencySOS from './components/EmergencySOS';
import MedicineReminder from './components/MedicineReminder';

// --- LOGO COMPONENT ---
const SehatSaathiLogo = ({ className = "h-12" }: { className?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <svg viewBox="0 0 200 200" className="h-full w-auto drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Circle Background */}
      <circle cx="100" cy="100" r="90" fill="#E8F5E9" />
      
      {/* Medical Symbol / Plus */}
      <rect x="92" y="60" width="16" height="80" rx="4" fill="#167E00" />
      <rect x="60" y="92" width="80" height="16" rx="4" fill="#167E00" />

      {/* Heart Shape Integration */}
      <path d="M100 145C100 145 150 115 150 85C150 65 130 55 115 55C105 55 100 65 100 65C100 65 95 55 85 55C70 55 50 65 50 85C50 115 100 145 100 145Z" stroke="#00274C" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div className="flex flex-col">
      <div className="flex items-baseline font-bold leading-none tracking-tight">
        <span className="text-3xl text-[#00274C]">Sehat</span>
        <span className="text-3xl text-[#167E00] ml-1">Saathi</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <div className="h-[1px] w-4 bg-[#167E00]" />
        <span className="text-[10px] font-bold text-[#00274C] whitespace-nowrap">आपका स्वास्थ्य, हमारा साथ</span>
        <div className="h-[1px] w-4 bg-[#167E00]" />
      </div>
    </div>
  </div>
);

// --- MAIN APPLICATION ---
import { AIAssistant } from './components/AIAssistant';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, login, logout, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) setBackendStatus('online');
        else setBackendStatus('offline');
      } catch (error) {
        setBackendStatus('offline');
      }
    };
    checkBackend();
  }, []);

  const cycleLanguage = () => {
    if (language === 'EN') setLanguage('HI');
    else if (language === 'HI') setLanguage('KN');
    else setLanguage('EN');
  };

  return (
    <div className="min-h-screen bg-[#f5fbf5] text-[#00274c] font-sans selection:bg-green-700 selection:text-white">
      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#00274c]/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center space-y-6">
                <div className="inline-flex p-4 bg-green-50 rounded-3xl mb-4">
                  <ShieldCheck className="w-12 h-12 text-[#167e00]" />
                </div>
                <h3 className="text-3xl font-bold">Health Portal</h3>
                <p className="text-gray-500">Sign in to access your personalized health assistance.</p>
                
                <div className="grid gap-4 pt-6">
                  <button 
                    onClick={() => { login('patient'); setShowLoginModal(false); }}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-[#167e00] text-white font-bold rounded-2xl hover:bg-[#00274c] transition-all shadow-lg active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>
                </div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest pt-4">
                  🔒 Secure Multi-factor Authentication
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-green-100 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <SehatSaathiLogo className="h-14" />
            <div className="hidden lg:flex items-center gap-4">
              <NetworkStatus />
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm ${
                backendStatus === 'online' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                backendStatus === 'checking' ? 'bg-gray-50 text-gray-500 border-gray-100' : 
                'bg-red-50 text-red-700 border-red-100'
              }`}>
                <Activity className="w-3.5 h-3.5" />
                Backend: {backendStatus}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {[
              { label: t.navServices, id: 'symptom-checker' },
              { label: t.navReminders, id: 'reminders' }
            ].map((item) => (
              <a key={item.id} href={`#${item.id}`} className="text-sm font-semibold text-[#00274c]/70 hover:text-[#167e00] transition-colors uppercase tracking-widest">
                {item.label}
              </a>
            ))}

            <button 
              onClick={cycleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 hover:bg-green-50 transition-all text-[10px] font-black text-[#167e00]"
            >
              <Languages className="w-3.5 h-3.5" />
              {language}
            </button>
            
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 bg-green-50 rounded-full border border-green-100 hover:bg-green-100 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-[#167e00] flex items-center justify-center text-white font-bold text-xs">
                    {profile?.displayName?.[0] || 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-[10px] font-black uppercase text-[#167e00] leading-none mb-1">{profile?.role}</p>
                    <p className="text-xs font-bold text-[#00274c] leading-none">{profile?.displayName?.split(' ')[0]}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#00274c] transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-green-50 p-2 z-[60]"
                    >
                      <div className="p-4 border-b border-gray-50 mb-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Signed in as</p>
                        <p className="text-sm font-bold text-[#00274c] truncate">{user.email}</p>
                      </div>
                      <button className="w-full text-left px-4 py-3 text-sm font-semibold text-[#00274c] hover:bg-green-50 rounded-2xl flex items-center gap-3 transition-colors">
                        <User className="w-4 h-4" /> My Profile
                      </button>
                      <button className="w-full text-left px-4 py-3 text-sm font-semibold text-[#00274c] hover:bg-green-50 rounded-2xl flex items-center gap-3 transition-colors">
                        <Activity className="w-4 h-4" /> Health Dashboard
                      </button>
                      <div className="h-px bg-gray-50 my-2" />
                      <button 
                        onClick={() => { logout(); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-2xl flex items-center gap-3 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="px-8 py-3 bg-[#00274c] text-white text-sm font-bold rounded-full hover:bg-[#167e00] transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
              >
                <User className="w-4 h-4" /> Login / Sign Up
              </button>
            )}
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-[#00274c]/70">
            {isMenuOpen ? <X /> : <Menu /> }
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden min-h-[90vh] flex flex-col items-center justify-center bg-[#a5d29b] text-center">
        {/* Background Grid & Effects */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(22,126,0,0.2),transparent_70%)]" />
          <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(0,39,76,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,39,76,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="max-w-4xl mx-auto px-6 z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10 bg-white/40 p-12 md:p-16 rounded-[60px] backdrop-blur-md shadow-2xl border border-white/50"
          >
            <h1 
              style={{ fontSize: '88px', textAlign: 'justify', fontFamily: 'Verdana, sans-serif', lineHeight: '82px' }}
              className="font-extrabold tracking-tighter text-[#156726]"
            >
              {t.heroTitle}<br />
              <span className="text-[#002310] italic uppercase">{t.heroTitleHighlight}</span>
            </h1>

            <p className="text-xl text-[#194f00] max-w-2xl mx-auto leading-relaxed font-semibold">
              {t.heroSubtitle}
            </p>

            {!user && (
              <div className="flex justify-center pt-4">
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="px-12 py-5 bg-[#167E00] text-white text-lg font-bold rounded-[25px] hover:bg-[#00274C] transition-all shadow-2xl flex items-center gap-3 group active:scale-95"
                >
                  <ShieldCheck className="w-6 h-6" />
                  Get Started - Login / Sign Up
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}


          </motion.div>
        </div>
      </section>

      <SymptomChecker />
      <MedicineReminder />
      <EmergencySOS />

      {/* Feature Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-20 space-y-4 text-center">
            <h2 className="text-xs font-bold text-[#167e00] uppercase tracking-[0.4em] font-mono" style={{ fontFamily: 'Times New Roman, serif' }}>Core Platform Architecture</h2>
            <p className="text-5xl font-bold tracking-tight text-[#002100]">{t.heroSubtitle}</p>
            <p className="text-[#0b4f00] max-w-2xl mx-auto text-lg font-medium">{t.heroSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[
              { icon: <Languages className="text-white" />, title: "Multilingual", desc: "Localized AI symptom checker with voice support." },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => {
                  if (feature.title === "Telemedicine") {
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="group p-10 rounded-[32px] bg-[#418E49] border border-green-100 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-[100px] transition-all group-hover:w-32 group-hover:h-32" />
                <div className="mb-8 p-4 bg-white/20 rounded-2xl w-fit group-hover:bg-white transition-colors">
                  {React.cloneElement(feature.icon as React.ReactElement, { className: "w-7 h-7 group-hover:text-[#167e00]" })}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {t[`service${feature.title.replace(/[\s-]/g, '')}` as keyof typeof t] || feature.title}
                </h3>
                <p className="text-sm text-white/80 leading-relaxed font-medium">
                  {t[`service${feature.title.replace(/[\s-]/g, '')}Desc` as keyof typeof t] || feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-[#aad0ab] border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <SehatSaathiLogo className="h-16" />
            
            <div className="flex flex-col md:flex-row items-center gap-12 text-[11px] font-black uppercase tracking-[0.3em]">
              <span className="text-[#001800]">© 2026 Innovation Lab</span>
              <span className="text-[#000000]">Public Infrastructure</span>
              <span className="text-[#000000]">Verified Protocol</span>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-black/5 text-center">
             <p className="text-[10px] font-bold text-[#00274c]/40 leading-relaxed max-w-2xl mx-auto">
               Sehat Saathi is a decentralized healthcare delivery system. We prioritize privacy, security, and accessibility 
               as human rights. All clinical data is encrypted at rest and in transit.
             </p>
          </div>
        </div>
      </footer>
      <AIAssistant />
    </div>
  );
}
