'use client';

import { lazy, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Lazy load the heavy modal content — only loaded when user clicks
const StoreLocatorContent = lazy(() => import('./StoreLocatorContent'));

type Region = 'india' | 'malaysia' | 'dubai' | 'spain';

export default function StoreLocatorModal({
    isOpen,
    onClose,
    initialRegion,
}: {
    isOpen: boolean;
    onClose: () => void;
    initialRegion?: Region | null;
}) {
    // Prevent scroll from leaking to background page
    const stopScroll = useCallback((e: React.WheelEvent | React.TouchEvent) => {
        e.stopPropagation();
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9999] flex items-start justify-center overflow-hidden"
                    onClick={onClose}
                    onWheel={stopScroll}
                    onTouchMove={stopScroll}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.97 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative z-10 w-full max-w-5xl mx-4 mt-8 md:mt-12 mb-8 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-brand-100 hover:bg-brand-200 flex items-center justify-center transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-brand-700" />
                        </button>

                        {/* Scrollable content — overscroll-contain prevents scroll chaining */}
                        <div className="overflow-y-auto flex-1 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                            <Suspense
                                fallback={
                                    <div className="flex items-center justify-center h-80">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-3 border-classic-green/30 border-t-classic-green rounded-full animate-spin" />
                                            <p className="text-sm font-montserrat text-brand-500">Loading stores...</p>
                                        </div>
                                    </div>
                                }
                            >
                                <StoreLocatorContent initialRegion={initialRegion} />
                            </Suspense>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
