'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function MaintenancePage() {
  const [mounted, setMounted] = useState(false);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const dotTimer = setInterval(() => {
      setDotCount(prev => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(dotTimer);
  }, []);

  const dots = '.'.repeat(dotCount);

  if (!mounted) return null;

  return (
    <>
      {/* Full-screen fixed overlay — sits above everything including header/footer/nav */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: '#0B0F0B',
          overflow: 'auto',
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '900px',
            height: '900px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26,83,25,0.08) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content wrapper */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '48px 24px',
            textAlign: 'center',
            fontFamily: 'var(--font-montserrat), Montserrat, system-ui, sans-serif',
          }}
        >
          {/* Logo */}
          <div style={{ marginBottom: '48px' }}>
            <Image
              src="/logo.svg"
              alt="Solitario"
              width={160}
              height={52}
              style={{ filter: 'brightness(0) invert(1)', objectFit: 'contain' }}
              priority
            />
          </div>

          {/* Thin gold line */}
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #C4A35A, transparent)',
              marginBottom: '40px',
            }}
          />

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.8rem)',
              fontWeight: 300,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              margin: '0 0 16px',
              lineHeight: 1.3,
            }}
          >
            Under Maintenance
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.45)',
              maxWidth: '480px',
              lineHeight: 1.8,
              margin: '0 0 56px',
              letterSpacing: '0.02em',
            }}
          >
            We&apos;re refining your experience. Our website will be
            back shortly{dots}
          </p>

          {/* Info row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '32px',
              marginBottom: '64px',
            }}
          >
            {/* Email */}
            <a
              href="mailto:info@thesolitario.com"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 400,
                letterSpacing: '0.03em',
                transition: 'color 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C4A35A')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
              info@thesolitario.com
            </a>

            {/* Divider dot */}
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.6rem', lineHeight: '1.4rem' }}>●</span>

            {/* Phone */}
            <a
              href="tel:+919876543210"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 400,
                letterSpacing: '0.03em',
                transition: 'color 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C4A35A')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              +91 98765 43210
            </a>
          </div>

          {/* Social */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '48px' }}>
            <a
              href="https://www.instagram.com/solitariodiamonds/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={{
                color: 'rgba(255,255,255,0.3)',
                transition: 'color 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C4A35A')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/people/The-Solitario/61586760412779/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              style={{
                color: 'rgba(255,255,255,0.3)',
                transition: 'color 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C4A35A')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <p
            style={{
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.08em',
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            © {new Date().getFullYear()} The Solitario. All Rights Reserved.
          </p>
        </div>
      </div>
    </>
  );
}
