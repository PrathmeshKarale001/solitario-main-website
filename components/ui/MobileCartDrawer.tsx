'use client';

import { Drawer } from 'vaul';
import { ShoppingBag, X, Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mobile Cart Drawer using Vaul
// Practical implementation of Vaul package

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface MobileCartDrawerProps {
  items?: CartItem[];
  total?: number;
}

export default function MobileCartDrawer({ 
  items = [], 
  total = 0 
}: MobileCartDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button 
          className="relative p-2 hover:bg-brand-100 rounded-lg transition-colors"
          aria-label="Open cart"
        >
          <ShoppingBag className="w-6 h-6 text-brand-700" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-classic-green text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
              {items.length}
            </span>
          )}
        </button>
      </Drawer.Trigger>
      
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
          <div className="p-4 bg-white rounded-t-[10px] flex-1 flex flex-col">
            {/* Handle */}
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-brand-200 mb-4" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <Drawer.Title className="text-xl font-montserrat font-bold font-semibold text-brand-900">
                Your Cart ({items.length})
              </Drawer.Title>
              <Drawer.Close asChild>
                <button 
                  className="p-2 hover:bg-brand-100 rounded-lg transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5 text-brand-600" />
                </button>
              </Drawer.Close>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto -mx-4 px-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <ShoppingBag className="w-16 h-16 text-brand-300 mb-4" />
                  <p className="text-brand-600 font-medium mb-2">Your cart is empty</p>
                  <p className="text-sm text-brand-500">Add items to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 bg-brand-50 p-3 rounded-lg">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-brand-900 truncate">{item.name}</h3>
                        <p className="text-sm text-brand-600 mt-1">₹{item.price.toLocaleString()}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button className="p-1 hover:bg-white rounded transition-colors">
                            <Minus className="w-4 h-4 text-brand-600" />
                          </button>
                          <span className="text-sm font-medium text-brand-900 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button className="p-1 hover:bg-white rounded transition-colors">
                            <Plus className="w-4 h-4 text-brand-600" />
                          </button>
                        </div>
                      </div>
                      
                      <button 
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors self-start"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-brand-200 pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-brand-700 font-medium">Subtotal</span>
                  <span className="text-xl font-semibold text-brand-900">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
                
                <Link
                  href="/checkout"
                  className="block w-full bg-classic-green text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-classic-green/90 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Proceed to Checkout
                </Link>
                
                <Drawer.Close asChild>
                  <button className="w-full mt-2 text-brand-600 text-sm py-2 hover:text-brand-900 transition-colors">
                    Continue Shopping
                  </button>
                </Drawer.Close>
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
