'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Coffee, Search, Mic, Globe, BellRing, QrCode, Clock, Sparkles } from 'lucide-react';
import { sounds } from '@/lib/audio';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenVoiceSearch: () => void;
  onOpenTableSelector: () => void;
  onOpenWaiterModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenVoiceSearch,
  onOpenTableSelector,
  onOpenWaiterModal
}) => {
  const { tableSession, language, setLanguage } = useStore();
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleLanguage = () => {
    sounds.playPop();
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl px-4 py-3">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          {/* Logo & Cafe Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#181824] to-[#252538] border border-[#FF6B00]/40 flex items-center justify-center shadow-lg shadow-[#FF6B00]/20">
              <Coffee className="w-5 h-5 text-[#FF6B00]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white leading-tight">
                  HUB HOUSE <span className="text-gradient-orange">CAFE</span>
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF6B00]/15 text-[#FFD54F] border border-[#FF6B00]/30">
                  <Sparkles className="w-2.5 h-2.5" /> LIVE MENU
                </span>
              </div>
              <p className="text-[11px] text-white/50 font-medium">
                {language === 'en' ? 'Welcome 👋 Ready to order?' : 'வரவேற்கிறோம் 👋 உணவு தேர்வு செய்யவும்'}
              </p>
            </div>
          </div>

          {/* Table Badge, Time & Actions */}
          <div className="flex items-center gap-2">
            {/* Live Clock Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-xs text-white/70">
              <Clock className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span className="font-mono">{timeString}</span>
            </div>

            {/* Table Number Selector Button */}
            <button
              onClick={() => {
                sounds.playPop();
                onOpenTableSelector();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-xs font-semibold text-[#FFD54F] border border-[#FF6B00]/40 hover:bg-[#FF6B00]/20 transition-all shadow-sm"
              title="Change Table Number"
            >
              <QrCode className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Table #{tableSession.tableNumber}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full glass-pill text-xs font-medium text-white/80 hover:text-white transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span className="font-bold">{language === 'en' ? 'EN' : 'தமிழ்'}</span>
            </button>

            {/* Call Waiter Quick Action Pill */}
            <button
              onClick={() => {
                sounds.playPop();
                onOpenWaiterModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-orange text-white text-xs font-bold shadow-md shadow-[#FF6B00]/30 hover:scale-105 active:scale-95 transition-all"
            >
              <BellRing className="w-3.5 h-3.5 animate-bounce" />
              <span className="hidden xs:inline">{language === 'en' ? 'Call Staff' : 'ஊழியர்'}</span>
            </button>
          </div>
        </div>

        {/* Search Bar Row */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Search artisan pizza, burgers, coffee, desserts...'
                  : 'பீட்சா, பர்கர், காபி தேடவும்...'
              }
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl glass-input text-xs sm:text-sm placeholder:text-white/30"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Voice Search Button */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenVoiceSearch();
            }}
            className="p-2.5 rounded-2xl glass-pill hover:bg-[#FF6B00]/20 text-white/80 hover:text-[#FFD54F] border border-white/10 hover:border-[#FF6B00]/40 transition-all flex items-center justify-center shrink-0"
            title="Voice Search"
          >
            <Mic className="w-4 h-4 text-[#FF6B00]" />
          </button>
        </div>
      </div>
    </header>
  );
};
