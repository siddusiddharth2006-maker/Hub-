'use client';

import React from 'react';
import { CATEGORIES } from '@/data/mockMenu';
import { useStore } from '@/store/useStore';
import { sounds } from '@/lib/audio';
import { motion } from 'framer-motion';
import { MenuItem } from '@/types';

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  vegFilter: 'all' | 'veg' | 'non-veg';
  onSelectVegFilter: (filter: 'all' | 'veg' | 'non-veg') => void;
  menuItems: MenuItem[];
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  vegFilter,
  onSelectVegFilter,
  menuItems
}) => {
  const { language } = useStore();

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return menuItems.length;
    if (catId === 'specials') return menuItems.filter((i) => i.isChefSpecial || i.isPopular).length;
    return menuItems.filter((i) => i.category === catId).length;
  };

  return (
    <div className="w-full space-y-3 py-2">
      {/* Veg / Non-Veg Quick Filter Bar */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-pill">
          <button
            onClick={() => {
              sounds.playPop();
              onSelectVegFilter('all');
            }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              vegFilter === 'all'
                ? 'bg-gradient-orange text-white shadow-md shadow-[#FF6B00]/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {language === 'en' ? 'All Food' : 'அனைத்தும்'}
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              onSelectVegFilter('veg');
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              vegFilter === 'veg'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-md shadow-emerald-500/20'
                : 'text-white/60 hover:text-emerald-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {language === 'en' ? 'Pure Veg' : 'சைவம்'}
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              onSelectVegFilter('non-veg');
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              vegFilter === 'non-veg'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-md shadow-rose-500/20'
                : 'text-white/60 hover:text-rose-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            {language === 'en' ? 'Non-Veg' : 'அசைவம்'}
          </button>
        </div>

        <span className="text-xs text-white/40 font-mono hidden sm:inline">
          {menuItems.length} items live
        </span>
      </div>

      {/* Horizontal Scroll Categories */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 pb-2">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = getCategoryCount(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playPop();
                onSelectCategory(cat.id);
              }}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl shrink-0 text-xs font-bold transition-all ${
                isSelected
                  ? 'glass-card border-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/25 scale-105'
                  : 'glass-pill text-white/70 hover:text-white hover:border-white/20'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{language === 'en' ? cat.name : cat.nameTamil}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  isSelected ? 'bg-[#FF6B00] text-white' : 'bg-white/10 text-white/50'
                }`}
              >
                {count}
              </span>

              {isSelected && (
                <motion.div
                  layoutId="activeCategoryUnderline"
                  className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#FF6B00] rounded-full shadow-[0_0_8px_#FF6B00]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
