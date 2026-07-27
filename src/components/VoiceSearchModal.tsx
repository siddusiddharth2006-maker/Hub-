'use client';

import React, { useEffect, useState } from 'react';
import { sounds } from '@/lib/audio';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Sparkles } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectQuery
}) => {
  const [queryState, setQueryState] = useState('Listening for dish or drink name...');

  useEffect(() => {
    if (isOpen) {
      setQueryState('Listening for dish or drink name...');
      const samples = ['Truffle Mushroom Pizza', 'Belgian Chocolate Shake', 'Smoked Chicken Burger', 'Spanish Latte'];
      const timer = setTimeout(() => {
        const picked = samples[Math.floor(Math.random() * samples.length)];
        setQueryState(`Detected: "${picked}"`);
        sounds.playSuccessChime();
        setTimeout(() => {
          onSelectQuery(picked);
          onClose();
        }, 1000);
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, onSelectQuery]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          className="relative w-full max-w-sm glass-card rounded-3xl overflow-hidden border border-white/15 p-8 text-white text-center shadow-2xl z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full glass-pill text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Animated Mic Wave */}
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#FF6B00]/20 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-[#FF6B00]/40 animate-pulse" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-orange flex items-center justify-center shadow-xl shadow-[#FF6B00]/50 z-10">
              <Mic className="w-8 h-8 text-white" />
            </div>
          </div>

          <h3 className="text-xl font-extrabold mb-1">AI Voice Assistant</h3>
          <p className="text-xs text-white/60 font-mono mb-4">{queryState}</p>

          <div className="flex flex-wrap justify-center gap-1.5 pt-2 border-t border-white/10 text-[11px]">
            <span className="text-white/40 block w-full text-[10px] uppercase font-bold tracking-wider mb-1">
              Try saying:
            </span>
            <button
              onClick={() => {
                onSelectQuery('Pizza');
                onClose();
              }}
              className="px-3 py-1 rounded-full glass-pill hover:border-[#FF6B00]"
            >
              "Artisan Pizza"
            </button>
            <button
              onClick={() => {
                onSelectQuery('Coffee');
                onClose();
              }}
              className="px-3 py-1 rounded-full glass-pill hover:border-[#FF6B00]"
            >
              "Caramel Latte"
            </button>
            <button
              onClick={() => {
                onSelectQuery('Burger');
                onClose();
              }}
              className="px-3 py-1 rounded-full glass-pill hover:border-[#FF6B00]"
            >
              "Smash Burger"
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
