import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, WifiOff, CloudOff, Cloud } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const NetworkStatus: React.FC = () => {
  const isOnline = useNetworkStatus();

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        {isOnline ? (
          <motion.div
            key="online"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 shadow-sm"
          >
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Cloud Sync Active</span>
          </motion.div>
        ) : (
          <motion.div
            key="offline"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full border border-orange-100 shadow-sm"
          >
            <WifiOff className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Offline Mode</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NetworkStatus;
