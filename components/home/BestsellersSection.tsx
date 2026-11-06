'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ScrollReveal from '../layout/ScrollReveal';

const BestsellersSection = () => {
    const { addToCart } = useCart();
    return (
      <section className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-16 md:pt-24 font-sans tracking-wide">
        <ScrollReveal className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 md:gap-0">
            <div>
                <h2 className="text-lg md:text-xl text-gray-800 mb-2">Electric rides, everyday bikes, and gear</h2>
                <h3 className="text-3xl md:text-4xl text-gray-900 font-medium">
                    Bikes &amp; <span className="font-serif italic font-normal">essentials</span>
                </h3>
            </div>
            <Link href="/shop" className="flex items-center gap-2 text-xl md:text-2xl text-[#11430F] hover:opacity-80 transition font-medium">
                Shop all <span className="text-2xl md:text-3xl mt-[-4px]">&rarr;</span>
            </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <ScrollReveal delay={0.1} className="flex flex-col rounded-xl overflow-hidden bg-[#e9fba7]">
                <div className="relative aspect-[4/5] w-full bg-white">
                    <Link href="/bikes/1" aria-label="View City Electric Bike details" className="block h-full w-full">
                      <img src="/electric-bikes/city-electric-bike.jpg" alt="City electric bike" className="h-full w-full object-contain p-3" />
                    </Link>
                    <span className="absolute top-4 left-4 border border-white/50 text-white bg-black/30 backdrop-blur-sm px-4 py-1 rounded-full text-sm">Electric</span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-3">
                            <span className="text-xs uppercase tracking-widest text-[#11430F]">Electric Bikes</span>
                        </div>
                        <h4 className="text-gray-900 font-medium text-lg leading-tight"><Link href="/bikes/1" className="hover:text-[#11430F]">City Electric Bike</Link></h4>
                    </div>
                    <div className="flex justify-between items-end mt-auto">
                        <span className="text-gray-900 font-medium">Kes 145,000</span>
                        <button 
                            onClick={() => addToCart({
                                id: 1,
                                name: 'City Electric Bike',
                                price: 'Kes 145,000',
                                image: '/electric-bikes/city-electric-bike.jpg',
                                category: 'Electric Bikes'
                            })}
                            className="bg-[#11430F] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1a5c17] transition"
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
            </ScrollReveal>

            {/* Card 2 */}
            <ScrollReveal delay={0.2} className="flex flex-col rounded-xl overflow-hidden bg-[#e9fba7]">
                <div className="relative aspect-[4/5] w-full bg-white">
                    <Link href="/bikes/2" aria-label="View Trail Electric Bike details" className="block h-full w-full">
                      <img src="/electric-bikes/trail-electric-bike.jpg" alt="Trail electric bike" className="h-full w-full object-contain p-3" />
                    </Link>
                    <span className="absolute top-4 left-4 border border-white/50 text-white bg-black/30 backdrop-blur-sm px-4 py-1 rounded-full text-sm">Electric</span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-3">
                            <span className="text-xs uppercase tracking-widest text-[#11430F]">Electric Bikes</span>
                        </div>
                        <h4 className="text-gray-900 font-medium text-lg leading-tight"><Link href="/bikes/2" className="hover:text-[#11430F]">Trail Electric Bike</Link></h4>
                    </div>
                    <div className="flex justify-between items-end mt-auto">
                        <span className="text-gray-900 font-medium">Kes 198,000</span>
                        <button 
                            onClick={() => addToCart({
                                id: 2,
                                name: 'Trail Electric Bike',
                                price: 'Kes 198,000',
                                image: '/electric-bikes/trail-electric-bike.jpg',
                                category: 'Electric Bikes'
                            })}
                            className="bg-[#11430F] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1a5c17] transition"
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
            </ScrollReveal>

            {/* Card 3 */}
            <ScrollReveal delay={0.3} className="flex flex-col rounded-xl overflow-hidden bg-[#e9fba7]">
                <div className="relative aspect-[4/5] w-full bg-white">
                    <Link href="/bikes/3" aria-label="View Compact Folding E-Bike details" className="block h-full w-full">
                      <img src="/electric-bikes/compact-folding-e-bike.jpg" alt="Compact folding electric bike" className="h-full w-full object-contain p-3" />
                    </Link>
                    <span className="absolute top-4 left-4 border border-white/50 text-white bg-black/30 backdrop-blur-sm px-4 py-1 rounded-full text-sm">Folding</span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-3">
                            <span className="text-xs uppercase tracking-widest text-[#11430F]">Electric Bikes</span>
                        </div>
                        <h4 className="text-gray-900 font-medium text-lg leading-tight"><Link href="/bikes/3" className="hover:text-[#11430F]">Compact Folding E-Bike</Link></h4>
                    </div>
                    <div className="flex justify-between items-end mt-auto">
                        <span className="text-gray-900 font-medium">Kes 132,000</span>
                        <button 
                            onClick={() => addToCart({
                                id: 3,
                                name: 'Compact Folding E-Bike',
                                price: 'Kes 132,000',
                                image: '/electric-bikes/compact-folding-e-bike.jpg',
                                category: 'Electric Bikes'
                            })}
                            className="bg-[#11430F] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1a5c17] transition"
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
            </ScrollReveal>

            {/* Card 4 */}
            <ScrollReveal delay={0.4} className="flex flex-col rounded-xl overflow-hidden bg-[#e9fba7]">
                <div className="relative aspect-[4/5] w-full bg-[#A8AD8B]">
                    <Link href="/bikes/4" aria-label="View Fixed-Gear City Bicycle details" className="block h-full w-full">
                      <img src="/bike.jpg" alt="Black and yellow fixed-gear bicycle" className="h-full w-full bg-white object-contain p-3" />
                    </Link>
                    <span className="absolute top-4 left-4 border border-white/50 text-white bg-black/30 backdrop-blur-sm px-4 py-1 rounded-full text-sm">City</span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-3">
                            <span className="text-xs uppercase tracking-widest text-[#11430F]">Bikes</span>
                        </div>
                        <h4 className="text-gray-900 font-medium text-lg leading-tight"><Link href="/bikes/4" className="hover:text-[#11430F]">Fixed-Gear City Bicycle</Link></h4>
                    </div>
                    <div className="flex justify-between items-end mt-auto">
                        <span className="text-gray-900 font-medium">Kes 48,000</span>
                        <button 
                            onClick={() => addToCart({
                                id: 4,
                                name: 'Fixed-Gear City Bicycle',
                                price: 'Kes 48,000',
                                image: '/bike.jpg',
                                category: 'Bikes'
                            })}
                            className="bg-[#11430F] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1a5c17] transition"
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
            </ScrollReveal>
        </div>
                <p className="mt-5 text-xs text-gray-500">Illustrative product artwork and sample prices. Confirm specifications and availability before purchase.</p>
            </section>
    );
};

export default BestsellersSection;
