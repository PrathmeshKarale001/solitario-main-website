'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, ChevronLeft, Mail, Phone, Calendar, Shield, Bell, Eye, EyeOff, Check, Camera } from 'lucide-react';
import { Section, Container } from '@/components/ui';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  notifications: {
    email: boolean;
    sms: boolean;
    promotions: boolean;
  };
}

const STORAGE_KEY = 'solitario_user_profile';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    notifications: {
      email: true,
      sms: false,
      promotions: true,
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/account/settings');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      // Load profile from localStorage or use session data
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setProfile(JSON.parse(stored));
        } else {
          setProfile(prev => ({
            ...prev,
            name: session.user?.name || '',
            email: session.user?.email || '',
          }));
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
      setLoading(false);
    }
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
          <div className="max-w-2xl mx-auto">
            {/* Back Button */}
            <Link href="/account" className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-700 mb-6 font-montserrat transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Account
            </Link>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-playfair text-brand-800 mb-2">Profile Settings</h1>
              <p className="text-brand-500 font-montserrat">Manage your account information</p>
            </motion.div>

            {/* Profile Picture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6 mb-6"
            >
              <h2 className="font-playfair text-lg text-brand-800 mb-4">Profile Picture</h2>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-bronze-gold/10 rounded-full flex items-center justify-center overflow-hidden">
                    {session?.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-bronze-gold" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-classic-green text-white rounded-full flex items-center justify-center shadow-lg hover:bg-classic-green/90 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="font-montserrat text-brand-600 text-sm">
                    Upload a new profile picture
                  </p>
                  <p className="text-xs text-brand-400 font-montserrat mt-1">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6 mb-6"
            >
              <h2 className="font-playfair text-lg text-brand-800 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-montserrat text-brand-600 mb-1">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat"
                  />
                </div>
                <div>
                  <label className="block text-sm font-montserrat text-brand-600 mb-1">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat bg-brand-50"
                    disabled
                  />
                  <p className="text-xs text-brand-400 font-montserrat mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-montserrat text-brand-600 mb-1">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat"
                  />
                </div>
                <div>
                  <label className="block text-sm font-montserrat text-brand-600 mb-1">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Birthday
                  </label>
                  <input
                    type="date"
                    value={profile.birthday}
                    onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                    className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat"
                  />
                  <p className="text-xs text-brand-400 font-montserrat mt-1">Get special birthday offers!</p>
                </div>
              </div>
            </motion.div>

            {/* Notification Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6 mb-6"
            >
              <h2 className="font-playfair text-lg text-brand-800 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-bronze-gold" />
                Notification Preferences
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-brand-50 transition-colors">
                  <div>
                    <p className="font-montserrat text-brand-700">Email Notifications</p>
                    <p className="text-sm text-brand-500 font-montserrat">Order updates and shipping info</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors ${profile.notifications.email ? 'bg-classic-green' : 'bg-brand-200'}`}>
                    <input
                      type="checkbox"
                      checked={profile.notifications.email}
                      onChange={(e) => setProfile({
                        ...profile,
                        notifications: { ...profile.notifications, email: e.target.checked }
                      })}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${profile.notifications.email ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} />
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-brand-50 transition-colors">
                  <div>
                    <p className="font-montserrat text-brand-700">SMS Notifications</p>
                    <p className="text-sm text-brand-500 font-montserrat">Delivery updates via text</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors ${profile.notifications.sms ? 'bg-classic-green' : 'bg-brand-200'}`}>
                    <input
                      type="checkbox"
                      checked={profile.notifications.sms}
                      onChange={(e) => setProfile({
                        ...profile,
                        notifications: { ...profile.notifications, sms: e.target.checked }
                      })}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${profile.notifications.sms ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} />
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-brand-50 transition-colors">
                  <div>
                    <p className="font-montserrat text-brand-700">Promotional Emails</p>
                    <p className="text-sm text-brand-500 font-montserrat">New arrivals and exclusive offers</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors ${profile.notifications.promotions ? 'bg-classic-green' : 'bg-brand-200'}`}>
                    <input
                      type="checkbox"
                      checked={profile.notifications.promotions}
                      onChange={(e) => setProfile({
                        ...profile,
                        notifications: { ...profile.notifications, promotions: e.target.checked }
                      })}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${profile.notifications.promotions ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} />
                  </div>
                </label>
              </div>
            </motion.div>

            {/* Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6 mb-6"
            >
              <h2 className="font-playfair text-lg text-brand-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-bronze-gold" />
                Security
              </h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 border border-brand-200 rounded-xl hover:border-classic-green hover:bg-classic-green/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-brand-500" />
                    <span className="font-montserrat text-brand-700">Change Password</span>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-brand-400 rotate-180" />
                </button>
                <button className="w-full flex items-center justify-between p-4 border border-brand-200 rounded-xl hover:border-classic-green hover:bg-classic-green/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-brand-500" />
                    <span className="font-montserrat text-brand-700">Two-Factor Authentication</span>
                  </div>
                  <span className="text-xs font-montserrat text-brand-400">Not enabled</span>
                </button>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 bg-classic-green text-white rounded-xl hover:bg-classic-green/90 transition-colors font-montserrat font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check className="w-5 h-5" />
                    Saved Successfully!
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
