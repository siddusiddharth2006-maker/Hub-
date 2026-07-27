'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { sounds } from '@/lib/audio';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Droplets, FileText, Utensils, Receipt, CheckCircle2 } from 'lucide-react';

interface WaiterCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaiterCallModal: React.FC<WaiterCallModalProps> = ({ isOpen, onClose }) => {
  const { tableSession, callWaiter } = useStore();
  const [submittedType, setSubmittedType] = useState<string | null>(null);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSendRequest = (type: 'water' | 'tissue' | 'bill' | 'cutlery' | 'assistance') => {
    sounds.playKitchenAlert();
    callWaiter(type, note);
    setSubmittedType(type);
    setTimeout(() => {
      setSubmittedType(null);
      setNote('');
      onClose();
    }, 1400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-sm glass-card rounded-3xl overflow-hidden border border-white/15 p-6 text-white text-center shadow-2xl z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full glass-pill text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {submittedType ? (
            <div className="py-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Staff Alerted!</h3>
              <p className="text-xs text-white/60">
                A team member is coming to <span className="font-bold text-[#FFD54F]">Table #{tableSession.tableNumber}</span> immediately.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-orange p-3 mx-auto flex items-center justify-center shadow-lg shadow-[#FF6B00]/30">
                <Bell className="w-6 h-6 text-white animate-pulse" />
              </div>

              <div>
                <h3 className="text-lg font-black">Call Table Service</h3>
                <p className="text-xs text-white/50">
                  Select what you need for Table #{tableSession.tableNumber}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2">
                <button
                  onClick={() => handleSendRequest('water')}
                  className="p-3 rounded-2xl glass-pill hover:border-[#FF6B00] border border-white/10 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                >
                  <Droplets className="w-5 h-5 text-cyan-400" />
                  <span>Request Water</span>
                </button>

                <button
                  onClick={() => handleSendRequest('tissue')}
                  className="p-3 rounded-2xl glass-pill hover:border-[#FF6B00] border border-white/10 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                >
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span>Request Tissue</span>
                </button>

                <button
                  onClick={() => handleSendRequest('cutlery')}
                  className="p-3 rounded-2xl glass-pill hover:border-[#FF6B00] border border-white/10 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                >
                  <Utensils className="w-5 h-5 text-purple-400" />
                  <span>Request Cutlery</span>
                </button>

                <button
                  onClick={() => handleSendRequest('bill')}
                  className="p-3 rounded-2xl glass-pill hover:border-[#FF6B00] border border-white/10 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                >
                  <Receipt className="w-5 h-5 text-emerald-400" />
                  <span>Request Bill</span>
                </button>
              </div>

              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note for staff..."
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
