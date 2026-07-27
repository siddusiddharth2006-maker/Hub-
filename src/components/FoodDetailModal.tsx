'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MenuItem } from '@/types';
import { useStore } from '@/store/useStore';
import { sounds } from '@/lib/audio';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, Flame, Plus, Minus, Sparkles, Check, Heart, Share2 } from 'lucide-react';

interface FoodDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ item, onClose }) => {
  const { language, addToCart } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSpice, setSelectedSpice] = useState(item?.spiceLevel || 1);
  const [selectedAddons, setSelectedAddons] = useState<{ id: string; name: string; price: number }[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialNote, setSpecialNote] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (item) {
      setSelectedSpice(item.spiceLevel || 1);
      setSelectedAddons([]);
      setQuantity(1);
      setSpecialNote('');
      setSelectedImageIndex(0);
    }
  }, [item]);

  // Floating ingredients & aroma particle canvas
  useEffect(() => {
    if (!item) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = canvas.parentElement?.clientHeight || 500;

    interface SparkleParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      alpha: number;
      color: string;
    }

    const particles: SparkleParticle[] = [];
    const colors = ['#FF6B00', '#FFD54F', '#FFF', '#FF8800'];

    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 1,
        speedY: (Math.random() - 0.5) * 0.8,
        speedX: (Math.random() - 0.5) * 0.8,
        alpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let frameId: number;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= 0.5;
        if (p.y < 0) p.y = canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      frameId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(frameId);
  }, [item]);

  if (!item) return null;

  const images = item.images && item.images.length > 0 ? item.images : [item.image];
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = item.price + addonsTotal;
  const grandTotal = unitPrice * quantity;

  const toggleAddon = (addon: { id: string; name: string; price: number }) => {
    sounds.playPop();
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleAddToCart = () => {
    sounds.playAddToCart();
    addToCart(item, quantity, selectedSpice, selectedAddons, specialNote);
    onClose();
  };

  const spiceLabels = ['Non-Spicy', 'Mild', 'Medium 🌶️', 'Hot 🌶️🌶️', 'Extra Fiery 🌶️🌶️🌶️'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-2xl">
        {/* Backdrop click dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Window: 700ms Framer Motion Spring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl glass-card rounded-3xl overflow-hidden border border-white/15 z-10 my-auto shadow-2xl shadow-[#FF6B00]/20 text-white"
        >
          {/* Particle Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-70" />

          {/* Close & Header Actions */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
            <button
              onClick={() => {
                sounds.playPop();
                setIsLiked(!isLiked);
              }}
              className="p-2.5 rounded-full glass-pill text-white/80 hover:text-rose-500 transition-all"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full glass-pill text-white/80 hover:text-white hover:border-[#FF6B00] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[85vh] overflow-y-auto no-scrollbar">
            {/* 3D Hero Image Carousel */}
            <div className="relative w-full h-72 sm:h-80 bg-black/60 overflow-hidden flex items-center justify-center">
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 1.1, rotateY: 15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                src={images[selectedImageIndex]}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-black/40" />

              {/* Thumbnails switcher */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 glass-pill px-3 py-1.5 rounded-full">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-[#FF6B00] scale-110'
                          : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-5 sm:p-8 space-y-6 relative z-10">
              {/* Title & Price Header */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.vegType === 'veg'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {item.vegType}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#FFD54F] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#FFD54F]" />
                    <span>{item.rating} ({item.reviewsCount} reviews)</span>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {language === 'en' ? item.name : item.nameTamil || item.name}
                  </h2>
                  <span className="text-2xl sm:text-3xl font-black text-gradient-orange font-mono">
                    ₹{item.price}
                  </span>
                </div>

                <p className="text-sm text-white/70 mt-2 leading-relaxed font-light">
                  {language === 'en' ? item.description : item.descriptionTamil || item.description}
                </p>
              </div>

              {/* Ingredients List */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                    Key Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl glass-pill text-xs text-white/80 border border-white/10"
                      >
                        🌱 {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Spice Level Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">
                    Spice Preference
                  </h4>
                  <span className="text-xs font-semibold text-[#FF6B00]">
                    {spiceLabels[selectedSpice]}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[0, 1, 2, 3, 4].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        sounds.playPop();
                        setSelectedSpice(lvl);
                      }}
                      className={`py-2 rounded-2xl text-xs font-bold border transition-all ${
                        selectedSpice === lvl
                          ? 'bg-gradient-orange text-white border-transparent shadow-md shadow-[#FF6B00]/30 scale-105'
                          : 'glass-pill text-white/60 hover:text-white border-white/10'
                      }`}
                    >
                      {lvl === 0 ? 'Mild' : '🌶️'.repeat(lvl)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons Checklist */}
              {item.addons && item.addons.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                    Customize & Add-ons
                  </h4>
                  <div className="space-y-2">
                    {item.addons.map((addon) => {
                      const isSelected = selectedAddons.some((a) => a.id === addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon)}
                          className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#FF6B00]/15 border-[#FF6B00] text-white'
                              : 'glass-pill border-white/10 text-white/70 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-[#FF6B00] border-[#FF6B00]' : 'border-white/30'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className="text-xs sm:text-sm font-semibold">{addon.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-[#FFD54F]">
                            +₹{addon.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Note Input */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                  Kitchen Notes
                </h4>
                <input
                  type="text"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="e.g. Less oil, extra cutlery, sauce on the side..."
                  className="w-full px-4 py-3 rounded-2xl glass-input text-xs sm:text-sm"
                />
              </div>

              {/* Footer Actions: Quantity Adjuster & Add Button */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 px-3 py-2 rounded-2xl glass-pill">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <Minus className="w-4 h-4 text-white/70" />
                  </button>
                  <span className="font-mono font-bold text-base w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setQuantity(quantity + 1);
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4 text-white/70" />
                  </button>
                </div>

                {/* Add to Order Button with Dynamic Live Price */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-between px-6 py-4 rounded-2xl bg-gradient-orange text-white font-extrabold text-sm sm:text-base shadow-xl shadow-[#FF6B00]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>{language === 'en' ? 'Add to Order' : 'ஆர்டரில் சேர்க்க'}</span>
                  <span className="font-mono text-lg font-black text-[#FFD54F]">
                    ₹{grandTotal}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
