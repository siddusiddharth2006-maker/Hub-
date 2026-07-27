'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { sounds } from '@/lib/audio';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Check } from 'lucide-react';

interface TableSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableSelectorModal: React.FC<TableSelectorModalProps> = ({ isOpen, onClose }) => {
  const { tableSession, setTableNumber } = useStore();
  const [customTable, setCustomTable] = useState('');

  if (!isOpen) return null;

  const tables = Array.from({ length: 16 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const handleSelectTable = (num: string) => {
    sounds.playPop();
    setTableNumber(num);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTable) {
      sounds.playPop();
      setTableNumber(customTable);
      onClose();
    }
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

          <div className="w-12 h-12 rounded-2xl bg-gradient-orange p-3 mx-auto mb-2 flex items-center justify-center shadow-lg shadow-[#FF6B00]/30">
            <QrCode className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-lg font-black">Switch Cafe Table</h3>
          <p className="text-xs text-white/50 mb-4">Select table number for ordering</p>

          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto no-scrollbar p-1">
            {tables.map((t) => {
              const isSelected = tableSession.tableNumber === t;
              return (
                <button
                  key={t}
                  onClick={() => handleSelectTable(t)}
                  className={`py-2.5 rounded-2xl text-xs font-bold font-mono border transition-all ${
                    isSelected
                      ? 'bg-gradient-orange text-white border-transparent shadow-md shadow-[#FF6B00]/40 scale-105'
                      : 'glass-pill border-white/10 text-white/70 hover:text-white hover:border-white/30'
                  }`}
                >
                  #{t}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleCustomSubmit} className="mt-4 pt-3 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={customTable}
              onChange={(e) => setCustomTable(e.target.value)}
              placeholder="Custom Table #"
              className="flex-1 px-3 py-2 rounded-xl glass-input text-xs font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#FF6B00] text-xs font-bold transition-colors"
            >
              Set
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
