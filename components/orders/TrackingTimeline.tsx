'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, MapPin, Clock } from 'lucide-react';

interface TrackingScan {
  dateTime: string;
  status: string;
  location: string;
  instructions: string;
}

interface TrackingData {
  waybill: string;
  status: string;
  statusLocation: string;
  statusDateTime: string;
  instructions: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveredTo: string;
  scans: TrackingScan[];
}

interface TrackingTimelineProps {
  waybill: string;
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export default function TrackingTimeline({ waybill, orderStatus }: TrackingTimelineProps) {
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracking = async () => {
      if (!waybill) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/shipping/track?waybill=${waybill}`);
        const data = await response.json();

        if (data.success && data.tracking) {
          setTracking(data.tracking);
        } else {
          setError(data.error || 'Unable to fetch tracking information');
        }
      } catch (err) {
        setError('Failed to load tracking information');
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [waybill]);

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!waybill) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-montserrat text-sm text-amber-800 font-medium">
              Awaiting Shipment
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Your order is being prepared for shipment. Tracking information will be available once the order is dispatched.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-brand-100 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-brand-100 rounded"></div>
            <div className="h-3 bg-brand-100 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tracking) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-sm text-gray-600 font-montserrat">
          {error || 'Tracking information not available yet'}
        </p>
        {waybill && (
          <p className="text-xs text-gray-500 mt-2">
            Tracking Number: <span className="font-mono">{waybill}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-playfair text-lg text-brand-800 mb-1">Shipment Tracking</h2>
          <p className="text-sm text-brand-500 font-montserrat">
            Tracking Number: <span className="font-mono font-medium">{tracking.waybill}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-brand-500 font-montserrat">Current Status</p>
          <p className="font-montserrat text-sm font-semibold text-classic-green">
            {tracking.status}
          </p>
        </div>
      </div>

      {/* Current Status Card */}
      <div className="bg-classic-green/5 border border-classic-green/20 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-classic-green/10 rounded-lg">
            <Truck className="w-5 h-5 text-classic-green" />
          </div>
          <div className="flex-1">
            <p className="font-montserrat font-medium text-brand-800">
              {tracking.status}
            </p>
            <p className="text-sm text-brand-600 mt-1">
              {tracking.statusLocation}
            </p>
            {tracking.instructions && (
              <p className="text-xs text-brand-500 mt-1">
                {tracking.instructions}
              </p>
            )}
            <p className="text-xs text-brand-400 mt-2">
              {formatDateTime(tracking.statusDateTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Route Information */}
      {(tracking.origin || tracking.destination) && (
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-brand-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-400" />
            <div>
              <p className="text-xs text-brand-500 font-montserrat">From</p>
              <p className="text-sm font-medium text-brand-800">{tracking.origin || 'N/A'}</p>
            </div>
          </div>
          <div className="flex-1 mx-4">
            <div className="h-px bg-brand-200 relative">
              <div className="absolute inset-0 bg-classic-green" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-classic-green" />
            <div className="text-right">
              <p className="text-xs text-brand-500 font-montserrat">To</p>
              <p className="text-sm font-medium text-brand-800">{tracking.destination || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Timeline */}
      {tracking.scans && tracking.scans.length > 0 && (
        <div>
          <h3 className="font-montserrat text-sm font-semibold text-brand-700 mb-4">
            Shipment History
          </h3>
          <div className="space-y-4">
            {tracking.scans.map((scan, index) => {
              const isLatest = index === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 ${
                      isLatest
                        ? 'bg-classic-green border-classic-green'
                        : 'bg-white border-brand-300'
                    }`}
                  ></div>
                  {/* Timeline line */}
                  {index < tracking.scans.length - 1 && (
                    <div className="absolute left-[5px] top-4 bottom-0 w-0.5 bg-brand-200"></div>
                  )}
                  {/* Content */}
                  <div className={`pb-4 ${isLatest ? 'opacity-100' : 'opacity-60'}`}>
                    <p className="font-montserrat text-sm font-medium text-brand-800">
                      {scan.status}
                    </p>
                    <p className="text-xs text-brand-600 mt-0.5">{scan.location}</p>
                    {scan.instructions && (
                      <p className="text-xs text-brand-500 mt-1">{scan.instructions}</p>
                    )}
                    <p className="text-xs text-brand-400 mt-1">
                      {formatDateTime(scan.dateTime)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delivered To */}
      {tracking.deliveredTo && (
        <div className="mt-6 pt-6 border-t border-brand-100">
          <div className="flex items-center gap-2 text-classic-green">
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="text-sm font-montserrat font-medium">Delivered</p>
              <p className="text-xs text-brand-600">Received by: {tracking.deliveredTo}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
