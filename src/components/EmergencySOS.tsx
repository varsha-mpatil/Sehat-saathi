import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhoneCall, AlertCircle, X, MapPin, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const EmergencySOS: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const helplines = [
    { name: "National Emergency", number: "112", desc: "All-in-one emergency rescue" },
    { name: "Ambulance", number: "102", desc: "Medical emergencies & transport" },
    { name: "Women Helpline", number: "1091", desc: "Support for women in distress" },
    { name: "Health Info Line", number: "104", desc: "Advice from medical experts" },
  ];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 z-[80] w-16 h-16 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center group"
      >
        <PhoneCall className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-red-600 rounded-full flex items-center justify-center">
          <AlertCircle className="w-3 h-3 animate-pulse" />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="bg-red-600 p-8 text-white">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/20 rounded-2xl w-fit">
                    <Activity className="w-8 h-8" />
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <h3 className="text-3xl font-bold mb-2">{t.emergencySOS}</h3>
                <p className="text-red-100 font-medium">Quick access to essential services in your region.</p>
              </div>

              <div className="p-8 grid gap-4">
                {helplines.map((line, idx) => (
                  <motion.a
                    key={idx}
                    href={`tel:${line.number}`}
                    whileHover={{ x: 10 }}
                    className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 group hover:border-red-200 hover:bg-red-50 transition-all"
                  >
                    <div>
                      <h4 className="text-lg font-bold text-[#00274c] group-hover:text-red-600 transition-colors uppercase tracking-tight">{line.name}</h4>
                      <p className="text-sm text-gray-500 font-medium">{line.desc}</p>
                    </div>
                    <div className="text-2xl font-black text-red-600 flex items-center gap-2">
                       <span className="text-sm">📞</span> {line.number}
                    </div>
                  </motion.a>
                ))}
              </div>

              <div className="p-8 pt-0">
                <div className="p-6 bg-blue-50 rounded-3xl flex items-center gap-4 text-blue-800 text-sm font-bold border border-blue-100">
                  <MapPin className="w-6 h-6 shrink-0" />
                  Your live location is being monitored for emergency dispatch if triggered.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmergencySOS;
