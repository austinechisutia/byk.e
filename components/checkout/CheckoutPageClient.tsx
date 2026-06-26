'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { CheckCircle2, ChevronLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type PaymentMethodType = 'card' | 'mpesa' | 'paypal';

interface CheckoutInnerProps {
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (m: PaymentMethodType) => void;
  email: string; setEmail: (v: string) => void;
  firstName: string; setFirstName: (v: string) => void;
  lastName: string; setLastName: (v: string) => void;
  address: string; setAddress: (v: string) => void;
  city: string; setCity: (v: string) => void;
  postalCode: string; setPostalCode: (v: string) => void;
  phoneNumber: string; setPhoneNumber: (v: string) => void;
  paypalEmail: string; setPaypalEmail: (v: string) => void;
  cartItems: ReturnType<typeof useCart>['cartItems'];
  cartTotal: number;
  shippingCost: number;
  total: number;
  onSuccess: () => void;
  clearCart: () => void;
}

function CheckoutInner({
  paymentMethod, setPaymentMethod,
  email, setEmail,
  firstName, setFirstName,
  lastName, setLastName,
  address, setAddress,
  city, setCity,
  postalCode, setPostalCode,
  phoneNumber, setPhoneNumber,
  paypalEmail, setPaypalEmail,
  cartItems, cartTotal, shippingCost, total,
  onSuccess, clearCart,
}: CheckoutInnerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [mpesaPending, setMpesaPending] = useState(false);
  const [mpesaCheckoutId, setMpesaCheckoutId] = useState<string | null>(null);

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Charge auth flow (OTP / PIN)
  const [chargeStep, setChargeStep] = useState<'idle' | 'otp' | 'pin'>('idle');
  const [chargeReference, setChargeReference] = useState<string | null>(null);
  const [authInput, setAuthInput] = useState('');
  const [authPromptText, setAuthPromptText] = useState('');

  // Poll for M-Pesa payment confirmation
  useEffect(() => {
    if (!mpesaPending || !mpesaCheckoutId) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch(`/api/mpesa/status/${mpesaCheckoutId}`);
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { status: string };
        if (data.status === 'paid') {
          clearCart();
          onSuccess();
        } else if (data.status === 'failed') {
          setMpesaPending(false);
          setMpesaCheckoutId(null);
          setPaymentError('M-Pesa payment was cancelled or failed. Please try again.');
        }
      } catch { /* network glitch — keep polling */ }
    };

    const interval = setInterval(poll, 3000);
    const timeout = setTimeout(() => {
      if (cancelled) return;
      clearInterval(interval);
      setMpesaPending(false);
      setMpesaCheckoutId(null);
      setPaymentError('Payment timed out. If you completed the payment, please contact support.');
    }, 120_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [mpesaPending, mpesaCheckoutId, clearCart, onSuccess]);

  const createOrderRecord = async (extra: Record<string, unknown> = {}) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email, firstName, lastName, address, city, postalCode,
        paymentMethod,
        subtotal: cartTotal,
        shipping: shippingCost,
        total,
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          quantity: item.quantity,
        })),
        ...extra,
      }),
    });
    return res.ok;
  };

  const finalizeCardPayment = async (reference: string) => {
    const verifyRes = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`);
    const verifyData = await verifyRes.json() as { status: string };
    if (verifyData.status !== 'success') {
      setPaymentError('Payment verification failed. Please contact support.');
      return false;
    }
    const saved = await createOrderRecord({ paystackReference: reference });
    if (!saved) {
      setPaymentError('Payment succeeded but order could not be saved. Please contact support.');
      return false;
    }
    clearCart();
    onSuccess();
    return true;
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chargeReference) return;
    setPaymentError(null);
    setIsProcessing(true);
    try {
      const endpoint = chargeStep === 'otp' ? '/api/paystack/submit-otp' : '/api/paystack/submit-pin';
      const bodyKey = chargeStep === 'otp' ? 'otp' : 'pin';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [bodyKey]: authInput, reference: chargeReference }),
      });
      const data = await res.json() as { status: string; reference: string; displayText?: string; error?: string };
      if (!res.ok) {
        setPaymentError(data.error ?? 'Verification failed. Please try again.');
        return;
      }
      if (data.status === 'success') {
        await finalizeCardPayment(data.reference);
      } else if (data.status === 'send_otp') {
        setChargeStep('otp');
        setAuthInput('');
        setAuthPromptText(data.displayText ?? 'Enter the OTP sent to you.');
      } else {
        setPaymentError('Unexpected response. Please try again or contact support.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    setIsProcessing(true);

    try {
      if (paymentMethod === 'card') {
        const [expMonth, expYear] = cardExpiry.split('/');
        const res = await fetch('/api/paystack/charge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            amount: total,
            card: {
              number: cardNumber,
              cvv: cardCvv,
              expiry_month: expMonth?.trim(),
              expiry_year: expYear?.trim(),
            },
          }),
        });
        const data = await res.json() as { status: string; reference: string; displayText?: string; error?: string };
        if (!res.ok) {
          setPaymentError(data.error ?? 'Payment failed. Please try again.');
          return;
        }
        if (data.status === 'success') {
          await finalizeCardPayment(data.reference);
        } else if (data.status === 'send_otp') {
          setChargeReference(data.reference);
          setChargeStep('otp');
          setAuthPromptText(data.displayText ?? 'Enter the OTP sent to you.');
        } else if (data.status === 'send_pin') {
          setChargeReference(data.reference);
          setChargeStep('pin');
          setAuthPromptText(data.displayText ?? 'Enter your card PIN.');
        } else {
          setPaymentError('Payment could not be completed. Please try a different card.');
        }
        return;
      } else if (paymentMethod === 'mpesa') {
        const res = await fetch('/api/mpesa/stk-push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phoneNumber,
            email, firstName, lastName, address, city, postalCode,
            subtotal: cartTotal,
            shipping: shippingCost,
            total,
            items: cartItems.map((item) => ({
              productId: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              category: item.category,
              quantity: item.quantity,
            })),
          }),
        });
        const data = (await res.json()) as Record<string, unknown>;
        if (!res.ok) {
          setPaymentError(typeof data.error === 'string' ? data.error : 'Could not initiate M-Pesa payment. Please try again.');
          return;
        }
        setMpesaCheckoutId(data.checkoutRequestId as string);
        setMpesaPending(true);
        return; // polling effect handles completion
      } else {
        // PayPal — create order record directly
        const saved = await createOrderRecord();
        if (!saved) {
          setPaymentError('Order could not be placed. Please try again.');
          return;
        }
      }

      clearCart();
      onSuccess();
    } finally {
      setIsProcessing(false);
    }
  };

  if (mpesaPending) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-[#49B54A]/20 animate-ping" />
          <div className="relative w-20 h-20 rounded-full bg-[#49B54A]/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#49B54A]" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
            </svg>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif italic text-gray-900">Check Your Phone</h2>
          <p className="text-gray-600 max-w-sm">
            An M-Pesa payment request of <span className="font-bold text-gray-900">KES {total.toLocaleString()}</span> has been sent to your phone.
          </p>
          <p className="text-gray-500 text-sm">Enter your M-Pesa PIN to complete the payment.</p>
        </div>
        <div className="flex items-center gap-2 text-[#49B54A] font-medium">
          <div className="w-5 h-5 border-2 border-[#49B54A]/40 border-t-[#49B54A] rounded-full animate-spin" />
          Waiting for confirmation…
        </div>
        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium">
            {paymentError}
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-3 text-gray-900">
          <ShieldCheck className="text-[#11430F]" />
          Contact Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Email Address</label>
            <input required type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] focus:border-transparent outline-none transition-all placeholder:text-gray-500 text-gray-900" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="newsletter" className="w-4 h-4 text-[#11430F]" />
            <label htmlFor="newsletter" className="text-sm text-gray-800 font-medium">Email me with news and eco-tips</label>
          </div>
        </div>
      </section>

      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-3 text-gray-900">
          <Truck className="text-[#11430F]" />
          Shipping Address
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">First Name</label>
            <input required type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Last Name</label>
            <input required type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500 text-gray-900" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-900 mb-1">Address</label>
            <input required type="text" placeholder="Apartment, suite, etc." value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">City</label>
            <input required type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Postal Code</label>
            <input required type="text" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500 text-gray-900" />
          </div>
        </div>
      </section>

      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-3 text-gray-900">
          <CreditCard className="text-[#11430F]" />
          Payment Method
        </h2>
        <div className="space-y-4">
          <div
            onClick={() => setPaymentMethod('card')}
            className={`p-4 border-2 rounded-xl flex justify-between items-center cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#11430F] bg-[#f8f9f5]' : 'border-gray-100 hover:border-gray-200'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${paymentMethod === 'card' ? 'bg-[#11430F] border-[#11430F]' : 'border-gray-300'}`}>
                {paymentMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="font-medium">Credit Card</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex items-center justify-center bg-[#1A1F71] px-2 py-0.5 rounded text-white text-[11px] font-black italic tracking-tight">VISA</div>
              <div className="relative flex items-center w-9 h-5">
                <div className="absolute left-0 w-5 h-5 bg-[#EB001B] rounded-full opacity-90" />
                <div className="absolute left-3 w-5 h-5 bg-[#F79E1B] rounded-full opacity-90" />
              </div>
            </div>
          </div>

          <div
            onClick={() => setPaymentMethod('mpesa')}
            className={`p-4 border-2 rounded-xl flex justify-between items-center cursor-pointer transition-all ${paymentMethod === 'mpesa' ? 'border-[#11430F] bg-[#f8f9f5]' : 'border-gray-100 hover:border-gray-200'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${paymentMethod === 'mpesa' ? 'bg-[#11430F] border-[#11430F]' : 'border-gray-300'}`}>
                {paymentMethod === 'mpesa' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="font-medium">M-Pesa</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#49B54A] px-2.5 py-1 rounded-lg">
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
              <span className="text-white text-[10px] font-black tracking-tight">M-PESA</span>
            </div>
          </div>

          <div
            onClick={() => setPaymentMethod('paypal')}
            className={`p-4 border-2 rounded-xl flex justify-between items-center cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-[#11430F] bg-[#f8f9f5]' : 'border-gray-100 hover:border-gray-200'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${paymentMethod === 'paypal' ? 'bg-[#11430F] border-[#11430F]' : 'border-gray-300'}`}>
                {paymentMethod === 'paypal' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="font-medium">PayPal</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#003087] px-2.5 py-1 rounded-lg">
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#009CDE] shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/></svg>
              <span className="text-[#009CDE] text-[10px] font-black tracking-tight">PayPal</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {paymentMethod === 'card' ? (
              <motion.div
                key="card-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 overflow-hidden"
              >
                {chargeStep !== 'idle' ? (
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <p className="text-sm text-gray-700 font-medium">{authPromptText}</p>
                    <input
                      required
                      type={chargeStep === 'pin' ? 'password' : 'text'}
                      inputMode="numeric"
                      placeholder={chargeStep === 'otp' ? 'Enter OTP' : 'Enter card PIN'}
                      value={authInput}
                      onChange={(e) => setAuthInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500 text-gray-900 tracking-widest text-lg"
                      autoComplete="one-time-code"
                    />
                    <button
                      type="submit"
                      disabled={isProcessing || !authInput}
                      className="w-full py-3 rounded-full font-bold text-base transition-all flex items-center justify-center gap-2 bg-[#11430F] text-white hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying…</> : 'Submit'}
                    </button>
                    <button type="button" onClick={() => { setChargeStep('idle'); setChargeReference(null); setAuthInput(''); }} className="w-full text-sm text-gray-500 hover:text-gray-700 underline">
                      Cancel and re-enter card details
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">Cardholder Name</label>
                      <input
                        required={paymentMethod === 'card'}
                        type="text"
                        placeholder="Name on card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        autoComplete="cc-name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1">Card Number</label>
                      <input
                        required={paymentMethod === 'card'}
                        type="text"
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                          setCardNumber(digits.replace(/(\d{4})(?=\d)/g, '$1 '));
                        }}
                        autoComplete="cc-number"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500 text-gray-900 tracking-widest"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Expiry Date</label>
                        <input
                          required={paymentMethod === 'card'}
                          type="text"
                          inputMode="numeric"
                          placeholder="MM / YY"
                          maxLength={7}
                          value={cardExpiry}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setCardExpiry(raw.length > 2 ? `${raw.slice(0, 2)} / ${raw.slice(2)}` : raw);
                          }}
                          autoComplete="cc-exp"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500 text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">CVV</label>
                        <input
                          required={paymentMethod === 'card'}
                          type="password"
                          inputMode="numeric"
                          placeholder="•••"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          autoComplete="cc-csc"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500 text-gray-900"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ShieldCheck size={14} className="text-[#11430F] shrink-0" />
                      Secured by Paystack
                    </div>
                  </div>
                )}
              </motion.div>
            ) : paymentMethod === 'mpesa' ? (
              <motion.div
                key="mpesa-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2 overflow-hidden"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">M-Pesa Phone Number</label>
                  <input
                    required={paymentMethod === 'mpesa'}
                    type="tel"
                    placeholder="07XX XXX XXX or 01XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500 text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-2">You will receive an STK push on your phone to complete the transaction.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="paypal-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2 overflow-hidden"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">PayPal Email</label>
                  <input
                    required={paymentMethod === 'paypal'}
                    type="email"
                    placeholder="your-paypal@email.com"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500 text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-2">You will be redirected to PayPal to complete your payment securely.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium">
          {paymentError}
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || cartItems.length === 0}
        className={`w-full py-5 rounded-full font-bold text-xl transition-all flex items-center justify-center gap-3 shadow-lg ${isProcessing || cartItems.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#11430F] text-white hover:bg-black'}`}
      >
        {isProcessing ? (
          <>
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            {paymentMethod === 'mpesa' ? 'Sending to your phone…' : paymentMethod === 'paypal' ? 'Redirecting to PayPal...' : 'Processing Payment...'}
          </>
        ) : (
          `Pay Kes ${total.toLocaleString()}`
        )}
      </button>
    </form>
  );
}

const CheckoutPageClient = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { data: session } = useSession();
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const shippingCost = 250;
  const total = cartTotal + shippingCost;

  useEffect(() => {
    if (session?.user) {
      if (session.user.email) setEmail(session.user.email);
      if (session.user.name) {
        const parts = session.user.name.trim().split(' ');
        setFirstName(parts[0] ?? '');
        setLastName(parts.slice(1).join(' ') ?? '');
      }
    }
  }, [session]);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <CheckCircle2 size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-serif italic text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. We&apos;ve sent a confirmation email to your inbox and we&apos;ll notify you when your eco-friendly goods are on their way.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/orders" className="inline-block bg-[#11430F] text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-colors">
              View My Orders
            </Link>
            <Link href="/shop" className="inline-block bg-gray-100 text-gray-800 px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="bg-[#fcfdfa] min-h-screen pt-24 md:pt-32 pb-24">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
        <Link href="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            <CheckoutInner
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              email={email} setEmail={setEmail}
              firstName={firstName} setFirstName={setFirstName}
              lastName={lastName} setLastName={setLastName}
              address={address} setAddress={setAddress}
              city={city} setCity={setCity}
              postalCode={postalCode} setPostalCode={setPostalCode}
              phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
              paypalEmail={paypalEmail} setPaypalEmail={setPaypalEmail}
              cartItems={cartItems}
              cartTotal={cartTotal}
              shippingCost={shippingCost}
              total={total}
              onSuccess={() => setIsSuccess(true)}
              clearCart={clearCart}
            />
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 sticky top-32">
              <h2 className="text-2xl font-serif italic mb-8 text-gray-900">Order Summary</h2>
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-[#f8f9f5] rounded-xl overflow-hidden shrink-0 border border-gray-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 leading-tight mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-800 font-medium mb-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#11430F]">{item.price}</p>
                    </div>
                  </div>
                ))}
                {cartItems.length === 0 && (
                  <p className="text-gray-500 italic text-center py-4">Your bag is empty.</p>
                )}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-200 font-sans">
                <div className="flex justify-between text-gray-800 font-medium">
                  <span>Subtotal</span>
                  <span>Kes {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-800 font-medium">
                  <span>Shipping</span>
                  <span>Kes {shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-gray-900 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>Kes {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-black">
                <ShieldCheck size={14} className="text-[#11430F]" />
                Secure Checkout Powered by Vigne
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPageClient;