'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { MenuItem } from '@/types';
import { sounds } from '@/lib/audio';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ArrowLeft,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  QrCode,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Printer,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import QRCode from 'qrcode';

export default function AdminPage() {
  const {
    menuItems,
    orders,
    adminSaveMenuItem,
    adminDeleteMenuItem,
    adminToggleAvailability,
    coupons
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'menu' | 'analytics' | 'qr'>('menu');

  // Menu item modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);

  // Table QR generator state
  const [qrTableNum, setQrTableNum] = useState('04');
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState('');

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1234' || passcode === 'admin') {
      sounds.playSuccessChime();
      setIsAuthenticated(true);
    } else {
      alert('Invalid passcode. Use "1234" for demo access.');
    }
  };

  const handleGenerateQr = () => {
    sounds.playPop();
    const url = `${window.location.origin}/?table=${qrTableNum}`;
    QRCode.toDataURL(url, { width: 350, margin: 2, color: { dark: '#FF6B00', light: '#FFFFFF' } })
      .then((data) => setGeneratedQrDataUrl(data))
      .catch(() => {});
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem?.price) return;
    sounds.playPop();

    const itemToSave: MenuItem = {
      id: editingItem.id || `item-${Date.now()}`,
      name: editingItem.name,
      description: editingItem.description || '',
      price: Number(editingItem.price),
      category: editingItem.category || 'pizza',
      image: editingItem.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      vegType: editingItem.vegType || 'veg',
      spiceLevel: Number(editingItem.spiceLevel || 1),
      calories: Number(editingItem.calories || 450),
      prepTime: editingItem.prepTime || '15 min',
      rating: editingItem.rating || 4.8,
      reviewsCount: editingItem.reviewsCount || 10,
      isAvailable: editingItem.isAvailable !== undefined ? editingItem.isAvailable : true,
      ingredients: editingItem.ingredients || ['Fresh Ingredients']
    };

    adminSaveMenuItem(itemToSave);
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm p-6 rounded-3xl glass-card border border-white/15 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-gradient-orange p-3.5 mx-auto flex items-center justify-center shadow-lg shadow-[#FF6B00]/30">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black">Admin Suite Login</h2>
            <p className="text-xs text-white/50">Enter security passcode to manage cafe</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode (1234)"
              className="w-full px-4 py-3 rounded-2xl glass-input text-center font-mono text-sm tracking-widest"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-orange text-white font-extrabold text-xs shadow-lg shadow-[#FF6B00]/30"
            >
              Access Dashboard
            </button>
          </form>
          <div className="pt-2">
            <Link href="/" className="text-xs text-white/40 hover:text-white">
              ← Return to Customer Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070A] text-white p-4 sm:p-6 font-sans">
      {/* Admin Header */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-2xl glass-pill hover:bg-white/10 text-white/70 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-2xl bg-gradient-orange p-2.5 flex items-center justify-center shadow-lg shadow-[#FF6B00]/30">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              ADMIN DASHBOARD <span className="text-gradient-orange">HUB</span>
            </h1>
            <p className="text-xs text-white/50">Manage items, prices, sales analytics & printable table QRs</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-pill">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'menu'
                ? 'bg-gradient-orange text-white shadow-md shadow-[#FF6B00]/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Menu Manager
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-orange text-white shadow-md shadow-[#FF6B00]/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => {
              setActiveTab('qr');
              handleGenerateQr();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'qr'
                ? 'bg-gradient-orange text-white shadow-md shadow-[#FF6B00]/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Table QR Generator
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-6 space-y-6">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl glass-card border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white/50 block">Today's Revenue</span>
              <span className="text-2xl font-black text-gradient-orange font-mono">
                ₹{totalRevenue}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/20 text-[#FF6B00] flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-card border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white/50 block">Total Orders</span>
              <span className="text-2xl font-black text-white font-mono">{totalOrdersCount}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-card border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white/50 block">Avg Order Value</span>
              <span className="text-2xl font-black text-[#FFD54F] font-mono">
                ₹{avgOrderValue}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab 1: Menu Item Manager */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Manage Menu Items ({menuItems.length})</h2>
              <button
                onClick={() => {
                  sounds.playPop();
                  setEditingItem({});
                  setIsEditModalOpen(true);
                }}
                className="px-4 py-2 rounded-2xl bg-gradient-orange text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#FF6B00]/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Food Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-3xl glass-card border border-white/10 flex items-start justify-between gap-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate">{item.name}</h4>
                    <p className="text-xs text-[#FFD54F] font-mono font-bold">₹{item.price}</p>
                    <span className="text-[10px] text-white/50 uppercase font-mono">{item.category}</span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => adminToggleAvailability(item.id)}
                      className={`p-1.5 rounded-xl border text-xs font-bold transition-all ${
                        item.isAvailable
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      }`}
                      title="Toggle Availability"
                    >
                      {item.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-xl glass-pill hover:bg-white/10 text-white/70 hover:text-white"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => adminDeleteMenuItem(item.id)}
                        className="p-1.5 rounded-xl glass-pill hover:bg-rose-500/20 text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Analytics & Sales Charts */}
        {activeTab === 'analytics' && (
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <h3 className="text-lg font-bold">Sales & Revenue Breakdown</h3>
            <div className="h-64 flex items-end gap-3 pt-8 pb-2 border-b border-white/10">
              {[420, 890, 1200, 650, 1450, 2100, 1800].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-orange rounded-t-xl transition-all shadow-md shadow-[#FF6B00]/30"
                    style={{ height: `${(val / 2100) * 100}%` }}
                  />
                  <span className="text-[10px] text-white/50 font-mono">Day {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Printable Table QR Code Generator */}
        {activeTab === 'qr' && (
          <div className="p-6 rounded-3xl glass-card border border-white/10 text-center max-w-md mx-auto space-y-4">
            <h3 className="text-lg font-bold">Printable Table QR Generator</h3>
            <p className="text-xs text-white/50">
              Select table number to generate downloadable high-res QR code sticker
            </p>

            <div className="flex items-center justify-center gap-2">
              <input
                type="text"
                value={qrTableNum}
                onChange={(e) => setQrTableNum(e.target.value)}
                placeholder="Table #"
                className="w-24 px-3 py-2 rounded-xl glass-input text-center font-mono font-bold text-sm"
              />
              <button
                onClick={handleGenerateQr}
                className="px-4 py-2 rounded-xl bg-gradient-orange text-white text-xs font-bold"
              >
                Generate QR
              </button>
            </div>

            {generatedQrDataUrl && (
              <div className="p-6 bg-white rounded-3xl text-black space-y-3 shadow-2xl inline-block">
                <h4 className="text-base font-black tracking-tight text-center">HUB HOUSE CAFE</h4>
                <div className="p-2 border-2 border-black rounded-2xl">
                  <img src={generatedQrDataUrl} alt="Table QR" className="w-56 h-56 mx-auto" />
                </div>
                <div className="px-3 py-1 rounded-full bg-black text-white font-mono font-bold text-sm inline-block">
                  TABLE #{qrTableNum}
                </div>
                <p className="text-[10px] text-black/60 font-medium">Scan to order live from menu</p>
              </div>
            )}

            <div>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 rounded-2xl bg-gradient-orange text-white text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-[#FF6B00]/30"
              >
                <Printer className="w-4 h-4" />
                <span>Print QR Sticker</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Edit / Add Menu Item Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="w-full max-w-md glass-card rounded-3xl p-6 text-white space-y-4 border border-white/15">
            <h3 className="text-lg font-bold">
              {editingItem?.id ? 'Edit Menu Item' : 'Add New Item'}
            </h3>
            <form onSubmit={handleSaveItem} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Item Name"
                value={editingItem?.name || ''}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input"
              />
              <input
                type="number"
                required
                placeholder="Price in INR (₹)"
                value={editingItem?.price || ''}
                onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl glass-input font-mono"
              />
              <textarea
                placeholder="Description"
                value={editingItem?.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input h-20"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={editingItem?.vegType || 'veg'}
                  onChange={(e) => setEditingItem({ ...editingItem, vegType: e.target.value as any })}
                  className="px-3 py-2 rounded-xl glass-input bg-[#0A0A0F]"
                >
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>
                <input
                  type="text"
                  placeholder="Image URL"
                  value={editingItem?.image || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  className="px-3 py-2 rounded-xl glass-input"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass-pill text-white/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-orange text-white font-bold"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
