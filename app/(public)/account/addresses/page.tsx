'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MapPin, ChevronLeft, Plus, Edit2, Trash2, Home, Building, Check, X } from 'lucide-react';
import { Section, Container } from '@/components/ui';

interface Address {
  id: string;
  type: 'home' | 'office' | 'other';
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({
    type: 'home',
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/account/addresses');
    }
  }, [status, router]);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/account/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAddresses();
    }
  }, [status, fetchAddresses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingAddress) {
        await fetch('/api/account/addresses', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingAddress.id,
            ...formData,
          }),
        });
      } else {
        await fetch('/api/account/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      await fetchAddresses();
      closeModal();
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/account/addresses?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      await fetchAddresses();
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const handleSetDefault = async (id: string) => {
    const target = addresses.find(a => a.id === id);
    if (!target) return;
    try {
      await fetch('/api/account/addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...target, isDefault: true }),
      });
      await fetchAddresses();
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };

  const openModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData({
        type: 'home',
        name: session?.user?.name || '',
        phone: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: addresses.length === 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    setFormData({
      type: 'home',
      name: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bronze-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-20">
      <Section variant="light" padding="lg">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link href="/account" className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-700 mb-6 font-montserrat transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Account
            </Link>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between mb-8"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-didot text-brand-800 mb-2">My Addresses</h1>
                <p className="text-brand-500 font-montserrat">Manage your delivery addresses</p>
              </div>
              <button
                onClick={() => openModal()}
                className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-classic-green text-white rounded-xl hover:bg-classic-green/90 transition-colors font-montserrat"
              >
                <Plus className="w-4 h-4" />
                Add Address
              </button>
            </motion.div>

            {/* Addresses Grid */}
            {addresses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-brand border border-brand-100 p-12 text-center"
              >
                <MapPin className="w-16 h-16 text-brand-300 mx-auto mb-4" />
                <h2 className="text-xl font-didot text-brand-800 mb-2">No addresses saved</h2>
                <p className="text-brand-500 font-montserrat mb-6">
                  Add a delivery address to make checkout faster
                </p>
                <button
                  onClick={() => openModal()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-classic-green text-white rounded-xl hover:bg-classic-green/90 transition-colors font-montserrat"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Address
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address, index) => (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-2xl shadow-brand border-2 p-5 relative ${
                      address.isDefault ? 'border-classic-green' : 'border-brand-100'
                    }`}
                  >
                    {/* Type Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-gotham uppercase tracking-wider ${
                        address.type === 'home' ? 'bg-classic-green/10 text-classic-green' :
                        address.type === 'office' ? 'bg-teal/10 text-teal' :
                        'bg-bronze-gold/10 text-bronze-gold'
                      }`}>
                        {address.type === 'home' ? <Home className="w-3 h-3" /> : <Building className="w-3 h-3" />}
                        {address.type}
                      </span>
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-classic-green text-white rounded text-xs font-montserrat">
                          <Check className="w-3 h-3" />
                          Default
                        </span>
                      )}
                    </div>

                    {/* Address Details */}
                    <h3 className="font-didot text-lg text-brand-800 mb-1">{address.name}</h3>
                    <p className="text-sm text-brand-600 font-montserrat mb-1">{address.phone}</p>
                    <p className="text-sm text-brand-500 font-montserrat">
                      {address.line1}
                      {address.line2 && <>, {address.line2}</>}
                      <br />
                      {address.city}, {address.state} - {address.pincode}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-brand-100">
                      <button
                        onClick={() => openModal(address)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-sm text-brand-600 hover:text-classic-green hover:bg-classic-green/5 rounded-lg transition-colors font-montserrat"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-sm text-brand-600 hover:text-classic-green hover:bg-classic-green/5 rounded-lg transition-colors font-montserrat"
                        >
                          <Check className="w-4 h-4" />
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="p-2 text-brand-400 hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-white rounded-2xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-didot text-brand-800">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h2>
                  <button onClick={closeModal} className="p-2 hover:bg-brand-100 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-brand-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Address Type */}
                  <div className="flex gap-2">
                    {(['home', 'office', 'other'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type })}
                        className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-montserrat capitalize transition-colors ${
                          formData.type === type
                            ? 'border-classic-green bg-classic-green/5 text-classic-green'
                            : 'border-brand-200 text-brand-600 hover:border-brand-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-montserrat text-brand-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-montserrat text-brand-600 mb-1">Phone</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat"
                      />
                    </div>
                  </div>

                  {/* Address Lines */}
                  <div>
                    <label className="block text-sm font-montserrat text-brand-600 mb-1">Address Line 1</label>
                    <input
                      type="text"
                      required
                      value={formData.line1}
                      onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                      placeholder="House/Flat No., Building Name"
                      className="w-full px-4 py-2.5 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-montserrat text-brand-600 mb-1">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={formData.line2}
                      onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                      placeholder="Street, Area, Landmark"
                      className="w-full px-4 py-2.5 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat"
                    />
                  </div>

                  {/* City, State, Pincode */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-montserrat text-brand-600 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2.5 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-montserrat text-brand-600 mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2.5 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-montserrat text-brand-600 mb-1">Pincode</label>
                      <input
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-4 py-2.5 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat"
                      />
                    </div>
                  </div>

                  {/* Default Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="w-4 h-4 rounded border-brand-300 text-classic-green focus:ring-classic-green/20"
                    />
                    <span className="text-sm font-montserrat text-brand-600">Set as default address</span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-classic-green text-white rounded-xl hover:bg-classic-green/90 transition-colors font-montserrat font-medium"
                  >
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
