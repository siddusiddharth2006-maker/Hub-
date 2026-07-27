'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { OrderStatus } from '@/types';
import { sounds } from '@/lib/audio';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Bell, CheckCircle2, Clock, UtensilsCrossed, AlertTriangle, ArrowLeft, Volume2, Sparkles, Filter } from 'lucide-react';
import Link from 'next/link';

export default function KitchenPage() {
  const { orders, updateOrderStatus, waiterRequests, attendWaiterRequest } = useStore();
  const [statusFilter, setStatusFilter] = useState<'active' | 'completed' | 'all'>('active');
  const [tableFilter, setTableFilter] = useState<string>('all');

  // Trigger sound when pending orders arrive
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  useEffect(() => {
    if (pendingOrders.length > 0) {
      sounds.playKitchenAlert();
    }
  }, [pendingOrders.length]);

  const filteredOrders = orders.filter((o) => {
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = o.status !== 'completed' && o.status !== 'cancelled';
    } else if (statusFilter === 'completed') {
      matchesStatus = o.status === 'completed';
    }

    let matchesTable = true;
    if (tableFilter !== 'all') {
      matchesTable = o.tableNumber === tableFilter;
    }

    return matchesStatus && matchesTable;
  });

  const nextStatusMap: Record<OrderStatus, OrderStatus> = {
    pending: 'accepted',
    accepted: 'preparing',
    preparing: 'ready',
    ready: 'serving',
    serving: 'completed',
    completed: 'completed',
    cancelled: 'cancelled'
  };

  const handleAdvanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    sounds.playPop();
    const next = nextStatusMap[currentStatus];
    updateOrderStatus(orderId, next);
  };

  const statusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse';
      case 'accepted':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'preparing':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'ready':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'serving':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'completed':
        return 'bg-white/10 text-white/50 border-white/10';
      default:
        return 'bg-white/10 text-white/50';
    }
  };

  const pendingWaiterCalls = waiterRequests.filter((w) => w.status === 'pending');

  return (
    <div className="min-h-screen bg-[#07070A] text-white p-4 sm:p-6 font-sans">
      {/* Top HUD Bar */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-2xl glass-pill hover:bg-white/10 text-white/70 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-2xl bg-gradient-orange p-2.5 flex items-center justify-center shadow-lg shadow-[#FF6B00]/30">
            <ChefHat className="w-6 h-6 text-white animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                KITCHEN DISPLAY <span className="text-gradient-orange">HUD</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40">
                LIVE SYNC
              </span>
            </div>
            <p className="text-xs text-white/50">Realtime order pipeline & table service alerts</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-2xl glass-pill">
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'active'
                  ? 'bg-gradient-orange text-white shadow-md shadow-[#FF6B00]/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Active ({orders.filter((o) => o.status !== 'completed').length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'completed'
                  ? 'bg-gradient-orange text-white shadow-md shadow-[#FF6B00]/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Completed ({orders.filter((o) => o.status === 'completed').length})
            </button>
          </div>

          <button
            onClick={() => sounds.playKitchenAlert()}
            className="p-2.5 rounded-2xl glass-pill text-[#FFD54F] hover:bg-[#FF6B00]/20 transition-all border border-white/10"
            title="Test Sound Chime"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto pt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Active Waiter Table Calls Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 rounded-3xl glass-card border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#FF6B00] animate-bounce" />
                <h3 className="text-sm font-bold">Waiter Service Calls</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#FF6B00]/20 text-[#FFD54F] text-[10px] font-bold font-mono">
                {pendingWaiterCalls.length}
              </span>
            </div>

            {pendingWaiterCalls.length === 0 ? (
              <p className="text-xs text-white/40 text-center py-4">No active table calls</p>
            ) : (
              <div className="space-y-2">
                {pendingWaiterCalls.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-[#FFD54F]">
                      <span>Table #{req.tableNumber}</span>
                      <span className="uppercase text-[10px]">{req.type}</span>
                    </div>
                    {req.note && <p className="text-white/70 italic text-[11px]">"{req.note}"</p>}
                    <button
                      onClick={() => {
                        sounds.playPop();
                        attendWaiterRequest(req.id);
                      }}
                      className="w-full mt-1 py-1 rounded-xl bg-amber-500 text-black font-extrabold text-[10px] uppercase hover:bg-amber-400"
                    >
                      Mark Attended
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders Pipeline Grid */}
        <div className="lg:col-span-3">
          {filteredOrders.length === 0 ? (
            <div className="p-12 rounded-3xl glass-card border border-white/10 text-center space-y-3">
              <UtensilsCrossed className="w-12 h-12 text-white/30 mx-auto" />
              <h3 className="text-base font-bold text-white">No Kitchen Orders in Queue</h3>
              <p className="text-xs text-white/50">
                New customer orders placed from tables will automatically appear here with audio alerts!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-5 rounded-3xl glass-card border transition-all ${
                    order.status === 'pending'
                      ? 'border-amber-500/60 shadow-lg shadow-amber-500/20'
                      : 'border-white/10'
                  }`}
                >
                  {/* Order Card Header */}
                  <div className="flex items-start justify-between pb-3 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black font-mono text-[#FFD54F]">
                          Table #{order.tableNumber}
                        </span>
                        <span className="text-xs text-white/50 font-mono">
                          {order.orderNumber}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 font-medium">{order.customerName}</p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusBadgeColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Order Items List */}
                  <div className="py-3 space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.cartId}
                        className="flex items-start justify-between text-xs p-2 rounded-xl bg-white/[0.02]"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-white">
                            <span className="px-1.5 py-0.5 rounded-md bg-[#FF6B00]/20 text-[#FFD54F] font-mono">
                              {item.quantity}x
                            </span>
                            <span>{item.menuItem.name}</span>
                          </div>
                          {item.selectedAddons.length > 0 && (
                            <p className="text-[10px] text-white/50 pl-7">
                              + {item.selectedAddons.map((a) => a.name).join(', ')}
                            </p>
                          )}
                          {item.specialNote && (
                            <p className="text-[10px] text-rose-400 font-bold pl-7 italic">
                              ⚠️ Note: "{item.specialNote}"
                            </p>
                          )}
                        </div>
                        <span className="font-mono text-white/60">₹{item.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Notes */}
                  {order.orderNotes && (
                    <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 mb-3">
                      <strong>Chef Instructions:</strong> {order.orderNotes}
                    </div>
                  )}

                  {/* Footer & Status Controls */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-white/50">
                      <span>Total: </span>
                      <span className="font-mono font-bold text-white text-xs">
                        ₹{order.grandTotal}
                      </span>
                    </div>

                    {order.status !== 'completed' && (
                      <button
                        onClick={() => handleAdvanceStatus(order.id, order.status)}
                        className="px-4 py-2 rounded-2xl bg-gradient-orange text-white font-extrabold text-xs shadow-md shadow-[#FF6B00]/30 hover:scale-105 transition-all flex items-center gap-1.5"
                      >
                        <span>Advance to {nextStatusMap[order.status].toUpperCase()}</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
