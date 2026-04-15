import fs from 'fs';
import path from 'path';
import { User, Order, Coupon, FestivalLead } from './schema';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const COUPONS_FILE = path.join(DATA_DIR, 'coupons.json');
const FESTIVAL_LEADS_FILE = path.join(DATA_DIR, 'festival_leads.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(filePath: string, defaultValue: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
}

function writeJSON<T>(filePath: string, data: T): void {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export class UserRepository {
  static findByClerkUserId(clerkUserId: string): User | null {
    const users = readJSON<User[]>(USERS_FILE, []);
    return users.find(u => u.clerk_user_id === clerkUserId) || null;
  }

  static create(user: Omit<User, 'id' | 'created_at'>): User {
    const users = readJSON<User[]>(USERS_FILE, []);
    const newUser: User = {
      ...user,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    writeJSON(USERS_FILE, users);
    return newUser;
  }

  static upsert(clerkUserId: string, shopifyCustomerId: string | null): User {
    const existing = this.findByClerkUserId(clerkUserId);
    if (existing) {
      if (shopifyCustomerId && existing.shopify_customer_id !== shopifyCustomerId) {
        const users = readJSON<User[]>(USERS_FILE, []);
        const updated = users.map(u =>
          u.clerk_user_id === clerkUserId
            ? { ...u, shopify_customer_id: shopifyCustomerId }
            : u
        );
        writeJSON(USERS_FILE, updated);
        return { ...existing, shopify_customer_id: shopifyCustomerId };
      }
      return existing;
    }
    return this.create({ clerk_user_id: clerkUserId, shopify_customer_id: shopifyCustomerId });
  }
}

export class OrderRepository {
  static findById(id: string): Order | null {
    const orders = readJSON<Order[]>(ORDERS_FILE, []);
    return orders.find(o => o.id === id) || null;
  }

  static findByRazorpayOrderId(razorpayOrderId: string): Order | null {
    const orders = readJSON<Order[]>(ORDERS_FILE, []);
    return orders.find(o => o.razorpay_order_id === razorpayOrderId) || null;
  }

  static findPaidOrdersByClerkUserId(clerkUserId: string): Order[] {
    const orders = readJSON<Order[]>(ORDERS_FILE, []);
    return orders.filter(o => o.clerk_user_id === clerkUserId && o.status === 'PAID');
  }

  static countPaidOrdersByClerkUserId(clerkUserId: string): number {
    return this.findPaidOrdersByClerkUserId(clerkUserId).length;
  }

  static create(order: Omit<Order, 'id' | 'created_at'>): Order {
    const orders = readJSON<Order[]>(ORDERS_FILE, []);
    const newOrder: Order = {
      ...order,
      id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };
    orders.push(newOrder);
    writeJSON(ORDERS_FILE, orders);
    return newOrder;
  }

  static updateStatus(
    razorpayOrderId: string,
    status: Order['status'],
    razorpayPaymentId?: string
  ): Order | null {
    const orders = readJSON<Order[]>(ORDERS_FILE, []);
    const index = orders.findIndex(o => o.razorpay_order_id === razorpayOrderId);
    if (index === -1) return null;

    const updated = {
      ...orders[index],
      status,
      razorpay_payment_id: razorpayPaymentId || orders[index].razorpay_payment_id,
      paid_at: status === 'PAID' ? new Date().toISOString() : orders[index].paid_at,
    };
    orders[index] = updated;
    writeJSON(ORDERS_FILE, orders);
    return updated;
  }

  static findAll(): Order[] {
    return readJSON<Order[]>(ORDERS_FILE, []);
  }
}

export class CouponRepository {
  static findByCode(code: string): Coupon | null {
    const coupons = readJSON<Coupon[]>(COUPONS_FILE, []);
    return coupons.find(c => c.code === code) || null;
  }

  static findActiveByClerkUserId(clerkUserId: string): Coupon[] {
    const coupons = readJSON<Coupon[]>(COUPONS_FILE, []);
    const now = new Date();
    return coupons.filter(
      c =>
        c.clerk_user_id === clerkUserId &&
        c.status === 'ACTIVE' &&
        new Date(c.expires_at) > now
    );
  }

  static hasIssuedCouponForMonth(clerkUserId: string, month: string): boolean {
    const coupons = readJSON<Coupon[]>(COUPONS_FILE, []);
    return coupons.some(c => c.clerk_user_id === clerkUserId && c.issued_month === month);
  }

  static create(coupon: Omit<Coupon, 'id'>): Coupon {
    const coupons = readJSON<Coupon[]>(COUPONS_FILE, []);
    const newCoupon: Coupon = {
      ...coupon,
      id: `cpn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    coupons.push(newCoupon);
    writeJSON(COUPONS_FILE, coupons);
    return newCoupon;
  }

  static markRedeemed(code: string): Coupon | null {
    const coupons = readJSON<Coupon[]>(COUPONS_FILE, []);
    const index = coupons.findIndex(c => c.code === code);
    if (index === -1) return null;

    const updated = {
      ...coupons[index],
      status: 'REDEEMED' as const,
      redeemed_at: new Date().toISOString(),
    };
    coupons[index] = updated;
    writeJSON(COUPONS_FILE, coupons);
    return updated;
  }

  static generateCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `SOLI-LOYAL-${timestamp}${random}`;
  }

  static findAll(): Coupon[] {
    return readJSON<Coupon[]>(COUPONS_FILE, []);
  }

  static delete(id: string): boolean {
    const coupons = readJSON<Coupon[]>(COUPONS_FILE, []);
    const filtered = coupons.filter(c => c.id !== id);
    if (filtered.length === coupons.length) return false;
    writeJSON(COUPONS_FILE, filtered);
    return true;
  }
}

export class FestivalLeadRepository {
  static create(lead: Omit<FestivalLead, 'id' | 'created_at'>): FestivalLead {
    const leads = readJSON<FestivalLead[]>(FESTIVAL_LEADS_FILE, []);
    const newLead: FestivalLead = {
      ...lead,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };
    leads.push(newLead);
    writeJSON(FESTIVAL_LEADS_FILE, leads);
    return newLead;
  }

  static findAll(): FestivalLead[] {
    return readJSON<FestivalLead[]>(FESTIVAL_LEADS_FILE, []);
  }

  static findByEmail(email: string): FestivalLead | null {
    const leads = this.findAll();
    return leads.find(l => l.email === email) || null;
  }
}
