'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const CONSENT_COOKIE = 'vigne_cookie_consent';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

function getConsent(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setConsent(value: 'accepted' | 'declined') {
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setConsent('accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    setConsent('declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 180 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-2rem)] max-w-2xl"
        >
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 bg-[#f5f0e8] rounded-full flex items-center justify-center shrink-0">
                <Cookie size={20} className="text-[#11430F]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-0.5">We use cookies</p>
                <p className="text-sm text-gray-600 leading-snug">
                  We use essential cookies to keep you logged in. No tracking or third-party cookies.{' '}
                  <a href="/about" className="underline text-[#11430F] hover:text-black transition-colors">
                    Learn more
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={handleDecline}
                className="flex-1 sm:flex-none px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-300 hover:border-gray-500 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-none px-5 py-2 rounded-full text-sm font-bold bg-[#11430F] text-white hover:bg-black transition-colors"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
