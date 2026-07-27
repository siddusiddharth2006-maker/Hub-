export type VegType = 'veg' | 'non-veg';

export interface MenuItem {
  id: string;
  name: string;
  nameTamil?: string;
  description: string;
  descriptionTamil?: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  vegType: VegType;
  spiceLevel: number; // 0 to 4
  calories: number;
  prepTime: string; // e.g. "12-15 min"
  rating: number; // e.g. 4.8
  reviewsCount: number;
  isAvailable: boolean;
  isChefSpecial?: boolean;
  isPopular?: boolean;
  ingredients: string[];
  addons?: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface Category {
  id: string;
  name: string;
  nameTamil: string;
  icon: string;
}

export interface CartItem {
  cartId: string; // unique ID for item + options combination
  menuItem: MenuItem;
  quantity: number;
  selectedSpiceLevel: number;
  selectedAddons: { id: string; name: string; price: number }[];
  specialNote?: string;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'serving' | 'completed' | 'cancelled';
export type PaymentMethod = 'upi' | 'card' | 'cash';
export type PaymentStatus = 'pending' | 'paid' | 'cash_on_delivery';

export interface Order {
  id: string;
  orderNumber: string; // e.g. HHC-000245
  tableNumber: string;
  customerName: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tip: number;
  gst: number;
  grandTotal: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderNotes?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  estimatedMinutes: number;
}

export interface WaiterRequest {
  id: string;
  tableNumber: string;
  type: 'water' | 'tissue' | 'bill' | 'cutlery' | 'assistance';
  note?: string;
  status: 'pending' | 'attended';
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  description: string;
}

export interface TableSession {
  tableNumber: string;
  tableName: string; // e.g. "Table 04 (Main Hall)"
  scannedAt: string;
}
