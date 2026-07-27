'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { PaymentMethod } from '@/types';
import { sounds } from '@/lib/audio';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, CreditCard, Banknote, ShieldCheck, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlacedSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderPlacedSuccess
}) => {
  const { tableSession, cart, appliedCoupon, tipAmount, placeOrder, language } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate bill total
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  let discount = 0;
  if (appliedCoupon) {
    discount = Math.min((subtotal * appliedCoupon.discountPercent) / 100, appliedCoupon.maxDiscount);
  }
  const gst = Math.round((subtotal - discount) * 0.05);
  const grandTotal = Math.round(subtotal - discount + gst + tipAmount);

  // Generate UPI QR Code payload
  useEffect(() => {
    if (paymentMethod === 'upi') {
      const upiUri = `upi://pay?pa=hubhousecafe@upi&pn=HubHouseCafe&am=${grandTotal}&cu=INR&tn=Table${tableSession.tableNumber}Order`;
      QRCode.toDataURL(upiUri, { margin: 1, color: { dark: '#FF6B00', light: '#FFFFFF' } })
        .then((url) => setQrDataUrl(url))
        .catch(() => {});
    }
  }, [paymentMethod, grandTotal, tableSession.tableNumber]);

  if (!isOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsProcessing(true);
    sounds.playPop();

    setTimeout(() => {
      // Create Order
      const newOrder = placeOrder(
        customerName.trim(),
        customerPhone.trim(),
        paymentMethod,
        orderNotes.trim()
      );

      // Play success chime & launch confetti burst
      sounds.playSuccessChime();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setIsProcessing(false);
      onOrderPlacedSuccess();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg glass-card rounded-3xl overflow-hidden border border-white/15 p-6 text-white my-auto shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B00]/20 text-[#FFD54F] text-xs font-bold border border-[#FF6B00]/30">
                  Table #{tableSession.tableNumber}
                </span>
                <span className="text-xs text-white/50">Smart Checkout</span>
              </div>
              <h2 className="text-xl font-black mt-1">Complete Your Order</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full glass-pill hover:bg-white/10 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-4 pt-4">
            {/* Customer Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-1">
                Order Notes for Chef
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Serve coffee first, extra hot sauces..."
                className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs sm:text-sm"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-2">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setPaymentMethod('upi');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-gradient-orange text-white border-transparent shadow-lg shadow-[#FF6B00]/30 scale-105'
                      : 'glass-pill border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <QrCode className="w-5 h-5 mb-1" />
                  <span>Instant UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setPaymentMethod('card');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-gradient-orange text-white border-transparent shadow-lg shadow-[#FF6B00]/30 scale-105'
                      : 'glass-pill border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setPaymentMethod('cash');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                    paymentMethod === 'cash'
                      ? 'bg-gradient-orange text-white border-transparent shadow-lg shadow-[#FF6B00]/30 scale-105'
                      : 'glass-pill border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <Banknote className="w-5 h-5 mb-1" />
                  <span>Cash</span>
                </button>
              </div>
            </div>

            {/* Dynamic Payment Details Preview */}
            <div className="p-4 rounded-2xl glass-card border-white/10 flex flex-col items-center text-center">
              {paymentMethod === 'upi' && (
                <div className="space-y-2 flex flex-col items-center">
                  <div className="p-2 bg-white rounded-2xl shadow-lg">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="UPI QR Code" className="w-36 h-36" />
                    ) : (
                      <div className="w-36 h-36 flex items-center justify-center text-black">
                        <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-white/70">
                    Scan with GPay, PhonePe, Paytm, or BHIM to pay <span className="font-bold text-[#FFD54F]">₹{grandTotal}</span>
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="w-full space-y-2 text-left">
                  <input
                    type="text"
                    placeholder="Card Number (4532 •••• •••• 8910)"
                    defaultValue="4532 8901 2345 8910"
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="08/28"
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      defaultValue="789"
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'cash' && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#FFD54F]">Pay Cash to Server</p>
                  <p className="text-[11px] text-white/60">
                    Order will be sent to kitchen immediately. Please keep exact cash ₹{grandTotal} ready.
                  </p>
                </div>
              )}
            </div>

            {/* Total Summary & Confirm Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-orange text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-[#FF6B00]/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Confirm & Send to Kitchen (₹{grandTotal})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
