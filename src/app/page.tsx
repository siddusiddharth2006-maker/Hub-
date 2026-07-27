'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { MenuItem } from '@/types';
import { SplashScreen } from '@/components/SplashScreen';
import { Navbar } from '@/components/Navbar';
import { CategoryNav } from '@/components/CategoryNav';
import { FoodCard } from '@/components/FoodCard';
import { FoodDetailModal } from '@/components/FoodDetailModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrderTracker } from '@/components/OrderTracker';
import { ReceiptModal } from '@/components/ReceiptModal';
import { WaiterCallModal } from '@/components/WaiterCallModal';
import { TableSelectorModal } from '@/components/TableSelectorModal';
import { VoiceSearchModal } from '@/components/VoiceSearchModal';
import { sounds } from '@/lib/audio';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, ChefHat, ShieldAlert, ChevronRight, Flame, ArrowRight, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

function MenuContent() {
  const searchParams = useSearchParams();
  const {
    tableSession,
    setTableNumber,
    menuItems,
    cart,
    activeOrder,
    language
  } = useStore();

  const [showSplash, setShowSplash] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  // Modals visibility
  const [selectedFoodItem, setSelectedFoodItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Automatic Table QR detection from URL query (?table=04)
  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam) {
      setTableNumber(tableParam);
    }
  }, [searchParams, setTableNumber]);

  // Filtered menu items
  const filteredMenuItems = menuItems.filter((item) => {
    // Search query filter
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nameTamil && item.nameTamil.includes(searchQuery)) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    let matchesCategory = true;
    if (selectedCategory === 'specials') {
      matchesCategory = !!item.isChefSpecial || !!item.isPopular;
    } else if (selectedCategory !== 'all') {
      matchesCategory = item.category === selectedCategory;
    }

    // Veg / Non-Veg filter
    let matchesVeg = true;
    if (vegFilter !== 'all') {
      matchesVeg = item.vegType === vegFilter;
    }

    return matchesSearch && matchesCategory && matchesVeg;
  });

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32 selection:bg-[#FF6B00] selection:text-white">
      {/* Splash Screen on initial load */}
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {/* Main Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenVoiceSearch={() => setIsVoiceModalOpen(true)}
        onOpenTableSelector={() => setIsTableModalOpen(true)}
        onOpenWaiterModal={() => setIsWaiterModalOpen(true)}
      />

      {/* Hero Banner Slider */}
      <section className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <div className="relative rounded-3xl overflow-hidden glass-card border border-white/10 p-6 sm:p-8 bg-gradient-to-r from-[#181824] via-[#241A14] to-[#0A0A0F]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B00]/15 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-lg space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B00]/20 text-[#FFD54F] text-xs font-bold border border-[#FF6B00]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CHEF'S SIGNATURE SELECTION</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Truffle Glaze & <span className="text-gradient-orange">Wood-Fired Pizzas</span>
            </h2>

            <p className="text-xs sm:text-sm text-white/60 font-light">
              Crafted fresh for Table #{tableSession.tableNumber}. Order directly from your screen with zero waiting time.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  sounds.playPop();
                  setSelectedCategory('specials');
                }}
                className="px-5 py-2.5 rounded-2xl bg-gradient-orange text-white text-xs font-extrabold shadow-lg shadow-[#FF6B00]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>View Specials</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsTrackerOpen(true)}
                className="px-4 py-2.5 rounded-2xl glass-pill text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 hover:border-[#FF6B00] transition-all"
              >
                <ChefHat className="w-4 h-4 text-[#FF6B00]" />
                <span>Track Live Order</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Categories & Filter Bar */}
      <section className="max-w-7xl mx-auto sticky top-[108px] z-30 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5">
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          vegFilter={vegFilter}
          onSelectVegFilter={setVegFilter}
          menuItems={menuItems}
        />
      </section>

      {/* Main Food Feed Grid */}
      <main className="max-w-7xl mx-auto px-4 pt-6">
        {filteredMenuItems.length === 0 ? (
          <div className="my-16 text-center space-y-3 p-8 rounded-3xl glass-card border-white/10 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center text-white/40">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No dishes found</h3>
            <p className="text-xs text-white/50">
              Try adjusting your search query or category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setVegFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-white hover:bg-[#FF6B00] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredMenuItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onOpenDetails={(selected) => {
                  sounds.playPop();
                  setSelectedFoodItem(selected);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation Pill (Cart Bar & Quick Portals) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4">
        <div className="glass-card rounded-3xl border border-white/15 p-2.5 shadow-2xl shadow-[#FF6B00]/25 backdrop-blur-2xl flex items-center justify-between gap-3 bg-[#0A0A10]/90">
          {/* Quick Staff Navigation Portals */}
          <div className="flex items-center gap-1.5 pl-2">
            <Link
              href="/kitchen"
              className="px-3 py-2 rounded-2xl glass-pill text-[11px] font-bold text-white/80 hover:text-[#FFD54F] hover:border-[#FF6B00]/40 flex items-center gap-1 transition-all"
              title="Open Kitchen Display HUD"
            >
              <ChefHat className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Kitchen</span>
            </Link>
            <Link
              href="/admin"
              className="px-3 py-2 rounded-2xl glass-pill text-[11px] font-bold text-white/80 hover:text-[#FFD54F] hover:border-[#FF6B00]/40 flex items-center gap-1 transition-all"
              title="Open Admin Dashboard"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Cart View Pill Button */}
          {cartTotalCount > 0 ? (
            <button
              onClick={() => {
                sounds.playPop();
                setIsCartOpen(true);
              }}
              className="flex-1 flex items-center justify-between px-5 py-3 rounded-2xl bg-gradient-orange text-white text-xs sm:text-sm font-black shadow-lg shadow-[#FF6B00]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white text-[#FF6B00] flex items-center justify-center font-mono text-xs font-bold">
                  {cartTotalCount}
                </div>
                <span>View Cart</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-sm font-black text-[#FFD54F]">
                <span>₹{cartTotalPrice}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ) : (
            activeOrder && (
              <button
                onClick={() => {
                  sounds.playPop();
                  setIsTrackerOpen(true);
                }}
                className="flex-1 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/30"
              >
                <span>Track Active Order ({activeOrder.orderNumber})</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-black/20">
                  {activeOrder.status}
                </span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Modals Suite */}
      <FoodDetailModal
        item={selectedFoodItem}
        onClose={() => setSelectedFoodItem(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlacedSuccess={() => {
          setIsCheckoutOpen(false);
          setIsTrackerOpen(true);
        }}
      />

      <OrderTracker
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        onOpenReceipt={() => setIsReceiptOpen(true)}
        onOpenWaiterModal={() => setIsWaiterModalOpen(true)}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />

      <WaiterCallModal
        isOpen={isWaiterModalOpen}
        onClose={() => setIsWaiterModalOpen(false)}
      />

      <TableSelectorModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />

      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSelectQuery={(q) => setSearchQuery(q)}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading Hub House Cafe...</div>}>
      <MenuContent />
    </Suspense>
  );
}
