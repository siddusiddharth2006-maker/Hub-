'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { sounds } from '@/lib/audio';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, Sparkles, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout
}) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    tipAmount,
    setTipAmount,
    language
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  let discount = 0;
  if (appliedCoupon) {
    discount = Math.min((subtotal * appliedCoupon.discountPercent) / 100, appliedCoupon.maxDiscount);
  }

  const gst = Math.round((subtotal - discount) * 0.05);
  const grandTotal = Math.round(subtotal - discount + gst + tipAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    sounds.playPop();
    const res = applyCoupon(couponCode);
    setCouponMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setCouponCode('');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md overflow-hidden">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Slide-over Glass Container */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-md h-full bg-[#0B0B10]/95 border-l border-white/10 backdrop-blur-2xl p-5 flex flex-col justify-between text-white z-10 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/40">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {language === 'en' ? 'Your Dining Basket' : 'உங்கள் ஆர்டர் கார்ட்'}
                </h2>
                <p className="text-xs text-white/50">{cart.length} item types selected</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={() => {
                    sounds.playPop();
                    clearCart();
                  }}
                  className="text-xs text-rose-400 hover:underline px-2 py-1"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full glass-pill hover:bg-white/10 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="my-auto flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Your cart is empty</h3>
                <p className="text-xs text-white/50 mt-1 max-w-xs">
                  Scan through our live menu and add your favorite dishes!
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-2xl bg-gradient-orange text-white text-xs font-bold shadow-lg shadow-[#FF6B00]/30"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.cartId}
                  className="flex items-center gap-3 p-3 rounded-2xl glass-card border-white/10"
                >
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-bold truncate">
                        {language === 'en' ? item.menuItem.name : item.menuItem.nameTamil || item.menuItem.name}
                      </h4>
                      <button
                        onClick={() => {
                          sounds.playPop();
                          removeFromCart(item.cartId);
                        }}
                        className="text-white/40 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Addons & Note tags */}
                    <div className="text-[10px] text-white/50 space-y-0.5 mt-0.5">
                      {item.selectedAddons.length > 0 && (
                        <p className="text-[#FFD54F]">
                          Add-ons: {item.selectedAddons.map((a) => a.name).join(', ')}
                        </p>
                      )}
                      {item.specialNote && <p className="italic">Note: "{item.specialNote}"</p>}
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold font-mono text-[#FFD54F]">
                        ₹{item.totalPrice}
                      </span>
                      <div className="flex items-center gap-2 px-2 py-0.5 rounded-xl bg-white/10">
                        <button
                          onClick={() => {
                            sounds.playPop();
                            updateCartQuantity(item.cartId, -1);
                          }}
                          className="text-white/70 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            sounds.playAddToCart();
                            updateCartQuantity(item.cartId, 1);
                          }}
                          className="text-white/70 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo Coupon Box */}
              <div className="pt-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FF6B00]/15 border border-[#FF6B00]">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#FFD54F]" />
                      <div>
                        <p className="text-xs font-bold text-white">Coupon {appliedCoupon.code} Applied</p>
                        <p className="text-[10px] text-white/60">{appliedCoupon.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        sounds.playPop();
                        removeCoupon();
                      }}
                      className="text-xs text-rose-400 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter Promo Code (HUB20)"
                      className="flex-1 px-3 py-2 rounded-xl glass-input text-xs uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#FF6B00] text-xs font-bold transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMessage && (
                  <p
                    className={`text-[11px] mt-1 font-medium ${
                      couponMessage.isError ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Tip Selection */}
              <div className="pt-2">
                <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1.5">
                  Tip Cafe Staff
                </p>
                <div className="flex items-center gap-2">
                  {[0, 20, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        sounds.playPop();
                        setTipAmount(amt);
                      }}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        tipAmount === amt
                          ? 'bg-gradient-orange text-white border-transparent shadow-md shadow-[#FF6B00]/30'
                          : 'glass-pill text-white/60 hover:text-white border-white/10'
                      }`}
                    >
                      {amt === 0 ? 'No Tip' : `₹${amt}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Bill & Checkout */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="space-y-1 text-xs text-white/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-mono">-₹{discount}</span>
                  </div>
                )}
                {tipAmount > 0 && (
                  <div className="flex justify-between text-[#FFD54F]">
                    <span>Staff Tip</span>
                    <span className="font-mono">+₹{tipAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/40">
                  <span>Taxes & GST (5%)</span>
                  <span className="font-mono">+₹{gst}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                  <span>Grand Total</span>
                  <span className="font-mono text-gradient-orange text-lg">₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playPop();
                  onProceedToCheckout();
                }}
                className="w-full py-4 rounded-2xl bg-gradient-orange text-white font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-[#FF6B00]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
