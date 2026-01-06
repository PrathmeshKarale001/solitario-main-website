'use client';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, ChevronLeft, Mail, Phone, Calendar, Shield, Bell, Eye, EyeOff, Check, Camera, AlertCircle } from 'lucide-react';
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

export default function SettingsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
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
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in?redirect_url=/account/settings');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setProfile({
        name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        phone: user.primaryPhoneNumber?.phoneNumber || '',
        birthday: '',
        notifications: {
          email: true,
          sms: false,
          promotions: true,
        },
      });
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, user]);

  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/account/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setProfile({
            name: data.profile.name || '',
            email: data.profile.email || '',
            phone: data.profile.phone || '',
            birthday: data.profile.birthday || '',
            notifications: {
              email: data.profile.notifications?.email ?? true,
              sms: data.profile.notifications?.sms ?? false,
              promotions: data.profile.notifications?.promotions ?? true,
            },
          });
        }
      } else {
        // Fallback to user data
        setProfile(prev => ({
          ...prev,
          name: user?.fullName || '',
          email: user?.primaryEmailAddress?.emailAddress || '',
        }));
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      // Fallback to user data
      setProfile(prev => ({
        ...prev,
        name: user?.fullName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
      }));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetchProfile();
    }
  }, [isLoaded, isSignedIn, user, fetchProfile]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save profile');
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);

      // Upload the image to Clerk
      const response = await fetch('/api/account/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      // Refresh the user data to get the new image
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    }
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

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 font-montserrat text-sm">{error}</p>
              </motion.div>
            )}

            {/* Profile Picture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6 mb-6"
            >
              <h2 className="font-playfair text-lg text-brand-800 mb-4">Profile Picture</h2>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 flex-shrink-0">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={profile.name}
                      className="w-full h-full rounded-2xl object-cover object-center border-2 border-bronze-gold/20"
                    />
                  ) : (
                    <div className="w-full h-full bg-bronze-gold/10 rounded-2xl flex items-center justify-center">
                      <User className="w-12 h-12 text-bronze-gold" />
                    </div>
                  )}
                  <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 w-8 h-8 bg-classic-green text-white rounded-full flex items-center justify-center shadow-lg hover:bg-classic-green/90 transition-colors cursor-pointer">
                    <Camera className="w-4 h-4" />
                  </label>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
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
