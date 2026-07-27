'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { sounds } from '@/lib/audio';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download, Coffee, CheckCircle, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose }) => {
  const { activeOrder } = useStore();
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (activeOrder) {
      QRCode.toDataURL(`HHC-RECEIPT:${activeOrder.orderNumber}`, { margin: 1 })
        .then((url) => setQrUrl(url))
        .catch(() => {});
    }
  }, [activeOrder]);

  if (!isOpen || !activeOrder) return null;

  const handlePrint = () => {
    sounds.playPop();
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto print:p-0 print:bg-white print:text-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-md bg-[#12121B] rounded-3xl overflow-hidden border border-white/15 p-6 text-white my-auto shadow-2xl z-10 print:max-w-none print:w-full print:bg-white print:text-black print:border-none print:shadow-none"
        >
          {/* Header Close */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 print:hidden">
            <span className="text-xs font-bold text-[#FFD54F]">Tax Invoice & Receipt</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full glass-pill hover:bg-white/10 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Printable Receipt Body */}
          <div id="printable-receipt" className="space-y-4 pt-4 text-left">
            {/* Cafe Brand Banner */}
            <div className="text-center pb-3 border-b border-dashed border-white/20 print:border-black/20">
              <div className="w-12 h-12 rounded-2xl bg-gradient-orange p-2.5 mx-auto mb-2 flex items-center justify-center shadow-lg print:bg-black">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-black tracking-tight text-white print:text-black">
                HUB HOUSE CAFE
              </h1>
              <p className="text-[11px] text-white/60 print:text-black/70">
                100 Ft Road, Indiranagar • GSTIN: 29AAAAA0000A1Z5
              </p>
              <p className="text-[10px] text-white/40 print:text-black/50">Ph: +91 98765 43210</p>
            </div>

            {/* Order Metadata */}
            <div className="grid grid-cols-2 text-xs space-y-1 text-white/70 print:text-black/80">
              <div>
                <span className="text-white/40 print:text-black/50 block">Order Number</span>
                <span className="font-mono font-bold text-white print:text-black">
                  {activeOrder.orderNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-white/40 print:text-black/50 block">Table Number</span>
                <span className="font-mono font-bold text-[#FFD54F] print:text-black">
                  Table #{activeOrder.tableNumber}
                </span>
              </div>
              <div>
                <span className="text-white/40 print:text-black/50 block">Customer</span>
                <span className="font-semibold text-white print:text-black">
                  {activeOrder.customerName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-white/40 print:text-black/50 block">Date & Time</span>
                <span className="font-mono text-[11px]">
                  {new Date(activeOrder.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="pt-2">
              <div className="flex justify-between text-[11px] font-bold uppercase text-white/40 border-b border-white/10 pb-1 mb-2 print:text-black/50 print:border-black/20">
                <span>Item</span>
                <span>Qty x Price</span>
                <span>Total</span>
              </div>
              <div className="space-y-2 text-xs">
                {activeOrder.items.map((item) => (
                  <div key={item.cartId} className="flex justify-between items-start">
                    <div className="flex-1 pr-2">
                      <p className="font-bold text-white print:text-black">
                        {item.menuItem.name}
                      </p>
                      {item.selectedAddons.length > 0 && (
                        <p className="text-[10px] text-white/50 print:text-black/60">
                          + {item.selectedAddons.map((a) => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-white/70 print:text-black/70 px-2">
                      {item.quantity} x ₹{item.unitPrice}
                    </span>
                    <span className="font-mono font-bold text-white print:text-black">
                      ₹{item.totalPrice}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax & Total Summary */}
            <div className="pt-3 border-t border-dashed border-white/20 print:border-black/20 space-y-1 text-xs text-white/70 print:text-black/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">₹{activeOrder.subtotal}</span>
              </div>
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400 print:text-emerald-700">
                  <span>Discount</span>
                  <span className="font-mono">-₹{activeOrder.discount}</span>
                </div>
              )}
              {activeOrder.tip > 0 && (
                <div className="flex justify-between text-[#FFD54F] print:text-amber-700">
                  <span>Staff Tip</span>
                  <span className="font-mono">+₹{activeOrder.tip}</span>
                </div>
              )}
              <div className="flex justify-between text-white/40 print:text-black/60">
                <span>CGST (2.5%) + SGST (2.5%)</span>
                <span className="font-mono">+₹{activeOrder.gst}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white print:text-black pt-2 border-t border-white/10 print:border-black/20">
                <span>Grand Total</span>
                <span className="font-mono text-gradient-orange print:text-black">
                  ₹{activeOrder.grandTotal}
                </span>
              </div>
            </div>

            {/* Payment & QR Footer */}
            <div className="pt-3 flex items-center justify-between border-t border-white/10 print:border-black/20">
              <div className="space-y-1">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase inline-flex items-center gap-1 border border-emerald-500/30 print:bg-emerald-100 print:text-emerald-800">
                  <CheckCircle className="w-3 h-3" /> Paid via {activeOrder.paymentMethod.toUpperCase()}
                </span>
                <p className="text-[10px] text-white/40 print:text-black/50">
                  Thank you for dining at Hub House Cafe!
                </p>
              </div>

              {qrUrl && <img src={qrUrl} alt="Receipt QR" className="w-14 h-14 bg-white p-1 rounded-xl" />}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-5 mt-4 border-t border-white/10 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 rounded-2xl bg-gradient-orange text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B00]/30 hover:scale-[1.02] transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
