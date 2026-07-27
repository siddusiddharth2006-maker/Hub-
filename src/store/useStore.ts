import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MenuItem, CartItem, Order, OrderStatus, PaymentMethod, PaymentStatus, WaiterRequest, Coupon, TableSession } from '@/types';
import { MOCK_MENU, MOCK_COUPONS } from '@/data/mockMenu';

interface StoreState {
  // Table & Language
  tableSession: TableSession;
  setTableNumber: (tableNumber: string) => void;
  language: 'en' | 'ta';
  setLanguage: (lang: 'en' | 'ta') => void;

  // Menu items (editable by admin)
  menuItems: MenuItem[];
  adminSaveMenuItem: (item: MenuItem) => void;
  adminDeleteMenuItem: (id: string) => void;
  adminToggleAvailability: (id: string) => void;

  // Cart State
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  tipAmount: number;
  addToCart: (
    item: MenuItem,
    quantity: number,
    spiceLevel: number,
    addons: { id: string; name: string; price: number }[],
    note?: string
  ) => void;
  updateCartQuantity: (cartId: string, delta: number) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  setTipAmount: (tip: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  placeOrder: (
    customerName: string,
    customerPhone: string,
    paymentMethod: PaymentMethod,
    orderNotes?: string
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;

  // Waiter Calls
  waiterRequests: WaiterRequest[];
  callWaiter: (type: WaiterRequest['type'], note?: string) => void;
  attendWaiterRequest: (id: string) => void;

  // Coupons
  coupons: Coupon[];
  adminAddCoupon: (coupon: Coupon) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      tableSession: {
        tableNumber: '04',
        tableName: 'Table 04 (Main Hall)',
        scannedAt: new Date().toISOString()
      },
      setTableNumber: (tableNumber: string) => {
        const padded = tableNumber.padStart(2, '0');
        set({
          tableSession: {
            tableNumber: padded,
            tableName: `Table ${padded} (Main Hall)`,
            scannedAt: new Date().toISOString()
          }
        });
      },

      language: 'en',
      setLanguage: (lang: 'en' | 'ta') => set({ language: lang }),

      menuItems: MOCK_MENU,
      adminSaveMenuItem: (item: MenuItem) => {
        set((state) => {
          const exists = state.menuItems.some((m) => m.id === item.id);
          if (exists) {
            return {
              menuItems: state.menuItems.map((m) => (m.id === item.id ? item : m))
            };
          } else {
            return { menuItems: [item, ...state.menuItems] };
          }
        });
      },
      adminDeleteMenuItem: (id: string) => {
        set((state) => ({
          menuItems: state.menuItems.filter((m) => m.id !== id)
        }));
      },
      adminToggleAvailability: (id: string) => {
        set((state) => ({
          menuItems: state.menuItems.map((m) =>
            m.id === id ? { ...m, isAvailable: !m.isAvailable } : m
          )
        }));
      },

      cart: [],
      appliedCoupon: null,
      tipAmount: 0,
      setTipAmount: (tipAmount: number) => set({ tipAmount }),

      addToCart: (item, quantity, spiceLevel, addons, note) => {
        set((state) => {
          const addonsPrice = addons.reduce((sum, a) => sum + a.price, 0);
          const unitPrice = item.price + addonsPrice;
          const cartId = `${item.id}-${spiceLevel}-${addons.map((a) => a.id).sort().join(',')}-${note || ''}`;

          const existingIndex = state.cart.findIndex((c) => c.cartId === cartId);
          if (existingIndex > -1) {
            const updated = [...state.cart];
            const itemToUpdate = updated[existingIndex];
            const newQty = itemToUpdate.quantity + quantity;
            updated[existingIndex] = {
              ...itemToUpdate,
              quantity: newQty,
              totalPrice: newQty * unitPrice
            };
            return { cart: updated };
          } else {
            const newItem: CartItem = {
              cartId,
              menuItem: item,
              quantity,
              selectedSpiceLevel: spiceLevel,
              selectedAddons: addons,
              specialNote: note,
              unitPrice,
              totalPrice: unitPrice * quantity
            };
            return { cart: [...state.cart, newItem] };
          }
        });
      },

      updateCartQuantity: (cartId: string, delta: number) => {
        set((state) => {
          const updated = state.cart
            .map((item) => {
              if (item.cartId === cartId) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return null;
                return {
                  ...item,
                  quantity: newQty,
                  totalPrice: newQty * item.unitPrice
                };
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);

          return { cart: updated };
        });
      },

      removeFromCart: (cartId: string) => {
        set((state) => ({
          cart: state.cart.filter((c) => c.cartId !== cartId)
        }));
      },

      clearCart: () => set({ cart: [], appliedCoupon: null, tipAmount: 0 }),

      applyCoupon: (code: string) => {
        const coupon = get().coupons.find(
          (c) => c.code.toUpperCase() === code.trim().toUpperCase()
        );
        if (!coupon) {
          return { success: false, message: 'Invalid coupon code' };
        }

        const subtotal = get().cart.reduce((sum, item) => sum + item.totalPrice, 0);
        if (subtotal < coupon.minOrder) {
          return {
            success: false,
            message: `Minimum order amount of ₹${coupon.minOrder} required for ${coupon.code}`
          };
        }

        set({ appliedCoupon: coupon });
        return { success: true, message: `Coupon ${coupon.code} applied successfully!` };
      },

      removeCoupon: () => set({ appliedCoupon: null }),

      orders: [],
      activeOrder: null,
      setActiveOrder: (activeOrder) => set({ activeOrder }),

      placeOrder: (customerName, customerPhone, paymentMethod, orderNotes) => {
        const state = get();
        const subtotal = state.cart.reduce((sum, item) => sum + item.totalPrice, 0);

        let discount = 0;
        if (state.appliedCoupon) {
          discount = Math.min(
            (subtotal * state.appliedCoupon.discountPercent) / 100,
            state.appliedCoupon.maxDiscount
          );
        }

        const gst = Math.round((subtotal - discount) * 0.05); // 5% GST
        const grandTotal = Math.round(subtotal - discount + gst + state.tipAmount);
        const orderNum = `HHC-${Math.floor(100000 + Math.random() * 900000)}`;

        const newOrder: Order = {
          id: `ord-${Date.now()}`,
          orderNumber: orderNum,
          tableNumber: state.tableSession.tableNumber,
          customerName: customerName || 'Guest Customer',
          customerPhone,
          items: [...state.cart],
          subtotal,
          discount,
          tip: state.tipAmount,
          gst,
          grandTotal,
          status: 'pending',
          paymentMethod,
          paymentStatus: paymentMethod === 'cash' ? 'cash_on_delivery' : 'paid',
          orderNotes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          estimatedMinutes: 20
        };

        set((s) => ({
          orders: [newOrder, ...s.orders],
          activeOrder: newOrder,
          cart: [],
          appliedCoupon: null,
          tipAmount: 0
        }));

        return newOrder;
      },

      updateOrderStatus: (orderId: string, status: OrderStatus) => {
        set((state) => {
          const updatedOrders = state.orders.map((o) =>
            o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
          );
          const activeOrder = state.activeOrder?.id === orderId
            ? { ...state.activeOrder, status, updatedAt: new Date().toISOString() }
            : state.activeOrder;

          return { orders: updatedOrders, activeOrder };
        });
      },

      updatePaymentStatus: (orderId: string, paymentStatus: PaymentStatus) => {
        set((state) => {
          const updatedOrders = state.orders.map((o) =>
            o.id === orderId ? { ...o, paymentStatus, updatedAt: new Date().toISOString() } : o
          );
          const activeOrder = state.activeOrder?.id === orderId
            ? { ...state.activeOrder, paymentStatus, updatedAt: new Date().toISOString() }
            : state.activeOrder;

          return { orders: updatedOrders, activeOrder };
        });
      },

      waiterRequests: [],
      callWaiter: (type, note) => {
        const state = get();
        const request: WaiterRequest = {
          id: `wtr-${Date.now()}`,
          tableNumber: state.tableSession.tableNumber,
          type,
          note,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        set((s) => ({ waiterRequests: [request, ...s.waiterRequests] }));
      },

      attendWaiterRequest: (id: string) => {
        set((state) => ({
          waiterRequests: state.waiterRequests.map((w) =>
            w.id === id ? { ...w, status: 'attended' } : w
          )
        }));
      },

      coupons: MOCK_COUPONS,
      adminAddCoupon: (coupon) => {
        set((state) => ({ coupons: [coupon, ...state.coupons] }));
      }
    }),
    {
      name: 'hub-house-cafe-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tableSession: state.tableSession,
        language: state.language,
        cart: state.cart,
        orders: state.orders,
        activeOrder: state.activeOrder,
        menuItems: state.menuItems,
        coupons: state.coupons
      })
    }
  )
);
