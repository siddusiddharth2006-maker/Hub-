'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { OrderStatus } from '@/types';
import { sounds } from '@/lib/audio';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, UtensilsCrossed, ChefHat, Bell, Receipt, Sparkles, X } from 'lucide-react';

interface OrderTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReceipt: () => void;
  onOpenWaiterModal: () => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  isOpen,
  onClose,
  onOpenReceipt,
  onOpenWaiterModal
}) => {
  const { activeOrder, updateOrderStatus, language } = useStore();

  if (!isOpen || !activeOrder) return null;

  const steps: { id: OrderStatus; title: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'pending', title: 'Order Sent', desc: 'Order received by system', icon: <Clock className="w-4 h-4" /> },
    { id: 'accepted', title: 'Kitchen Receives', desc: 'Chef verified order', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'preparing', title: 'Cooking in Progress', desc: 'Fresh ingredients sizzled', icon: <ChefHat className="w-4 h-4" /> },
    { id: 'ready', title: 'Dish Ready', desc: 'Plated & garnishing complete', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'serving', title: 'Serving to Table', desc: 'Staff on their way', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'completed', title: 'Served & Enjoy', desc: 'Bon Appetit!', icon: <Bell className="w-4 h-4" /> }
  ];

  const getStepIndex = (status: OrderStatus) => {
    return steps.findIndex((s) => s.id === status);
  };

  const currentStepIndex = getStepIndex(activeOrder.status);

  const handleSimulateStatus = (status: OrderStatus) => {
    sounds.playPop();
    updateOrderStatus(activeOrder.id, status);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-lg glass-card rounded-3xl overflow-hidden border border-white/15 p-6 text-white my-auto shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B00]/20 text-[#FFD54F] text-xs font-bold font-mono">
                  {activeOrder.orderNumber}
                </span>
                <span className="text-xs text-white/50">Table #{activeOrder.tableNumber}</span>
              </div>
              <h2 className="text-xl font-black mt-1">Live Kitchen Order Tracker</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full glass-pill hover:bg-white/10 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Hero Card */}
          <div className="my-5 p-5 rounded-2xl bg-gradient-to-tr from-[#151522] to-[#252538] border border-[#FF6B00]/30 text-center relative overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-[#FF6B00]/20 border border-[#FF6B00]/50 mx-auto flex items-center justify-center mb-3 animate-pulse">
              <ChefHat className="w-10 h-10 text-[#FF6B00]" />
            </div>
            <h3 className="text-lg font-black text-white">
              {steps[currentStepIndex]?.title || 'Order Processing'}
            </h3>
            <p className="text-xs text-white/60 mt-1">
              Estimated Preparation Time: <span className="font-bold text-[#FFD54F] font-mono">~15-18 minutes</span>
            </p>
          </div>

          {/* Step Timeline */}
          <div className="space-y-4 relative py-2 before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
            {steps.map((step, idx) => {
              const isPassed = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.id} className="relative flex items-start gap-4 z-10">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                      isCurrent
                        ? 'bg-gradient-orange text-white border-transparent shadow-lg shadow-[#FF6B00]/40 scale-110'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'glass-pill text-white/30 border-white/10'
                    }`}
                  >
                    {step.icon}
                  </div>

                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs sm:text-sm font-bold ${
                          isPassed ? 'text-white' : 'text-white/40'
                        }`}
                      >
                        {step.title}
                      </h4>
                      {isPassed && (
                        <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/50">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Simulation Toggle Bar for Live Demo */}
          <div className="mt-4 p-3 rounded-2xl glass-pill space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-white/40 block tracking-wider">
              Realtime Simulation Control
            </span>
            <div className="flex flex-wrap gap-1">
              {steps.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSimulateStatus(s.id)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors ${
                    activeOrder.status === s.id
                      ? 'bg-[#FF6B00] text-white border-[#FF6B00]'
                      : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {s.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-4">
            <button
              onClick={() => {
                sounds.playPop();
                onOpenReceipt();
              }}
              className="flex-1 py-3 rounded-2xl glass-pill border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 hover:border-[#FF6B00] transition-all"
            >
              <Receipt className="w-4 h-4 text-[#FF6B00]" />
              <span>Digital Receipt</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                onOpenWaiterModal();
              }}
              className="py-3 px-4 rounded-2xl bg-gradient-orange text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B00]/30"
            >
              <Bell className="w-4 h-4" />
              <span>Call Waiter</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
