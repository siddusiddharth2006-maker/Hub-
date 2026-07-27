'use client';

import React from 'react';
import { MenuItem } from '@/types';
import { useStore } from '@/store/useStore';
import { sounds } from '@/lib/audio';
import { Star, Flame, Clock, Plus, Minus, Sparkles, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

interface FoodCardProps {
  item: MenuItem;
  onOpenDetails: (item: MenuItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onOpenDetails }) => {
  const { language, cart, addToCart, updateCartQuantity } = useStore();

  // Check if item is already in cart
  const cartItemsForThisFood = cart.filter((c) => c.menuItem.id === item.id);
  const totalQtyInCart = cartItemsForThisFood.reduce((sum, c) => sum + c.quantity, 0);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playAddToCart();
    addToCart(item, 1, item.spiceLevel, []);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playAddToCart();
    if (cartItemsForThisFood.length > 0) {
      updateCartQuantity(cartItemsForThisFood[0].cartId, 1);
    } else {
      addToCart(item, 1, item.spiceLevel, []);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playPop();
    if (cartItemsForThisFood.length > 0) {
      updateCartQuantity(cartItemsForThisFood[0].cartId, -1);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpenDetails(item)}
      className="group relative flex flex-col justify-between rounded-3xl glass-card glass-card-hover p-4 cursor-pointer overflow-hidden select-none border border-white/10"
    >
      {/* Background Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/0 via-[#FF6B00]/0 to-[#FF6B00]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Top Badges */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3.5 bg-black/40">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-pill backdrop-blur-md">
          {item.vegType === 'veg' ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Leaf className="w-3 h-3" /> VEG
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              NON-VEG
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full glass-pill backdrop-blur-md text-[11px] font-bold text-[#FFD54F]">
          <Star className="w-3 h-3 fill-[#FFD54F] text-[#FFD54F]" />
          <span>{item.rating}</span>
        </div>

        {/* Chef Special Tag */}
        {item.isChefSpecial && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-orange text-white text-[9px] font-black uppercase tracking-wider shadow-md">
            <Sparkles className="w-2.5 h-2.5" /> Chef Special
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="space-y-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-white group-hover:text-[#FFD54F] transition-colors line-clamp-1">
            {language === 'en' ? item.name : item.nameTamil || item.name}
          </h3>
        </div>

        <p className="text-xs text-white/50 line-clamp-2 leading-relaxed font-light">
          {language === 'en' ? item.description : item.descriptionTamil || item.description}
        </p>

        {/* Metadata Chips: Prep Time, Spice & Calories */}
        <div className="flex items-center gap-3 pt-1 text-[11px] text-white/60 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#FF6B00]" />
            {item.prepTime}
          </span>
          {item.spiceLevel > 0 && (
            <span className="flex items-center gap-0.5 text-rose-400">
              <Flame className="w-3 h-3 fill-rose-500" />
              {'🌶️'.repeat(item.spiceLevel)}
            </span>
          )}
          <span className="text-white/40 font-mono">{item.calories} kcal</span>
        </div>
      </div>

      {/* Footer: Price & Add Button */}
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10">
        <div>
          <span className="text-[10px] text-white/40 block font-light uppercase tracking-wider">Price</span>
          <span className="text-lg font-black text-white font-mono">
            ₹{item.price}
          </span>
        </div>

        {/* Add Button or Counter Pill */}
        {totalQtyInCart > 0 ? (
          <div className="flex items-center gap-2 px-2 py-1 rounded-2xl bg-gradient-orange text-white shadow-lg shadow-[#FF6B00]/40">
            <button
              onClick={handleDecrement}
              className="p-1 hover:bg-black/20 rounded-xl transition-colors active:scale-90"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold font-mono text-sm px-1 min-w-[20px] text-center">
              {totalQtyInCart}
            </span>
            <button
              onClick={handleIncrement}
              className="p-1 hover:bg-black/20 rounded-xl transition-colors active:scale-90"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/10 hover:bg-gradient-orange text-white text-xs font-bold border border-white/20 hover:border-transparent transition-all shadow-md active:scale-95 group-hover:bg-gradient-orange"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF6B00] group-hover:text-white" />
            <span>ADD</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
