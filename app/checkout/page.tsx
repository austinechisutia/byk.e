'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { CheckCircle2, ChevronLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const CheckoutPage = () => {
    const { cartItems, cartTotal } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const shippingCost = 250;
    const total = cartTotal + shippingCost;

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2500);
    };

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
                        Thank you for your purchase. We've sent a confirmation email to your inbox and we'll notify you when your eco-friendly goods are on their way.
                    </p>
                    <div className="pt-4">
                        <Link href="/shop" className="inline-block bg-[#11430F] text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-colors">
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
                    {/* Left Side: Forms */}
                    <div className="lg:col-span-7 space-y-8">
                        <form onSubmit={handleCheckout} className="space-y-8">
                            {/* Contact Information */}
                            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-3 text-gray-900">
                                    <ShieldCheck className="text-[#11430F]" />
                                    Contact Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-1">Email Address</label>
                                        <input required type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] focus:border-transparent outline-none transition-all placeholder:text-gray-500" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="newsletter" className="w-4 h-4 text-[#11430F]" />
                                        <label htmlFor="newsletter" className="text-sm text-gray-800 font-medium">Email me with news and eco-tips</label>
                                    </div>
                                </div>
                            </section>

                            {/* Shipping Address */}
                            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-3 text-gray-900">
                                    <Truck className="text-[#11430F]" />
                                    Shipping Address
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-1">First Name</label>
                                        <input required type="text" placeholder="First Name" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-1">Last Name</label>
                                        <input required type="text" placeholder="Last Name" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-900 mb-1">Address</label>
                                        <input required type="text" placeholder="Apartment, suite, etc." className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-1">City</label>
                                        <input required type="text" placeholder="City" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-1">Postal Code</label>
                                        <input required type="text" placeholder="Postal Code" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500" />
                                    </div>
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-serif italic mb-6 flex items-center gap-3 text-gray-900">
                                    <CreditCard className="text-[#11430F]" />
                                    Payment Method
                                </h2>
                                <div className="space-y-4">
                                    <div className="p-4 border-2 border-[#11430F] bg-[#f8f9f5] rounded-xl flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 bg-[#11430F] rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                            <span className="font-medium">Credit Card</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        <div className="md:col-span-2">
                                            <input required type="text" placeholder="Card Number" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500" />
                                        </div>
                                        <div>
                                            <input required type="text" placeholder="Expiry (MM/YY)" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500" />
                                        </div>
                                        <div>
                                            <input required type="text" placeholder="CVC" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#11430F] outline-none placeholder:text-gray-500" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <button
                                disabled={isProcessing || cartItems.length === 0}
                                className={`w-full py-5 rounded-full font-bold text-xl transition-all flex items-center justify-center gap-3 shadow-lg ${
                                    isProcessing || cartItems.length === 0
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#11430F] text-white hover:bg-black'
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing Payment...
                                    </>
                                ) : (
                                    `Pay Kes ${total.toLocaleString()}`
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Side: Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 sticky top-32">
                            <h2 className="text-2xl font-serif italic mb-8 text-gray-900">Order Summary</h2>
                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-20 h-20 bg-[#f8f9f5] rounded-xl overflow-hidden shrink-0 border border-gray-200">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
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

export default CheckoutPage;
