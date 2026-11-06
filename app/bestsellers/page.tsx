'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function BestsellersPage() {
  const { addToCart } = useCart();
  return (
    <main className="bg-white min-h-screen pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 font-sans tracking-wide">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-6 md:gap-0">
          <h1 className="text-2xl md:text-3xl text-gray-700 font-normal leading-snug">
            Explore bikes for <br className="hidden sm:block" />
            city, trail, and <span className="font-serif italic font-medium">everyday</span>
          </h1>
          <Link href="/shop" className="flex items-center gap-2 text-xl md:text-2xl text-[#11430F] hover:opacity-80 transition font-medium">
             Shop all <span className="text-2xl md:text-3xl mt-[-4px]">&rarr;</span>
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 md:mb-24">
            
            {/* Card 1 */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white group flex flex-col items-center justify-end pb-8">
                <Link href="/bikes/1" aria-label="View City Electric Bike details" className="absolute inset-0">
                  <img src="/electric-bikes/city-electric-bike.jpg" alt="City electric bike" className="h-full w-full object-contain p-3" />
                </Link>
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 flex flex-col items-center text-white">
                    <span className="text-base md:text-lg font-medium mb-1 drop-shadow-sm">Explore</span>
                    <span className="font-[family-name:var(--font-great-vibes)] text-3xl md:text-4xl mb-3 drop-shadow-md">City Electric</span>
                    <button 
                      onClick={() => addToCart({
                        id: 1,
                        name: 'City Electric Bike',
                        price: 'Kes 145,000',
                        image: '/electric-bikes/city-electric-bike.jpg',
                        category: 'Electric Bikes'
                      })}
                      className="px-5 py-1 text-sm border border-white rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/30 transition"
                    >
                      Shop
                    </button>
                </div>
            </div>

            {/* Card 2 */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white group flex flex-col items-center justify-end pb-8">
                <Link href="/bikes/2" aria-label="View Trail Electric Bike details" className="absolute inset-0">
                  <img src="/electric-bikes/trail-electric-bike.jpg" alt="Trail electric bike" className="h-full w-full object-contain p-3" />
                </Link>
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 flex flex-col items-center text-white">
                    <span className="text-base md:text-lg font-medium mb-1 drop-shadow-sm">Explore</span>
                    <span className="font-[family-name:var(--font-great-vibes)] text-3xl md:text-4xl mb-3 drop-shadow-md">Trail Electric</span>
                    <button 
                      onClick={() => addToCart({
                        id: 2,
                        name: 'Trail Electric Bike',
                        price: 'Kes 198,000',
                        image: '/electric-bikes/trail-electric-bike.jpg',
                        category: 'Electric Bikes'
                      })}
                      className="px-5 py-1 text-sm border border-white rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/30 transition"
                    >
                      Shop
                    </button>
                </div>
            </div>

            {/* Card 3 */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white group flex flex-col items-center justify-end pb-8">
                <Link href="/bikes/3" aria-label="View Compact Folding E-Bike details" className="absolute inset-0">
                  <img src="/electric-bikes/compact-folding-e-bike.jpg" alt="Compact folding electric bike" className="h-full w-full object-contain p-3" />
                </Link>
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 flex flex-col items-center text-white">
                    <span className="text-base md:text-lg font-medium mb-1 drop-shadow-sm">Explore</span>
                    <span className="font-[family-name:var(--font-great-vibes)] text-3xl md:text-4xl mb-3 drop-shadow-md">Folding E-Bike</span>
                    <button 
                      onClick={() => addToCart({
                        id: 3,
                        name: 'Compact Folding E-Bike',
                        price: 'Kes 132,000',
                        image: '/electric-bikes/compact-folding-e-bike.jpg',
                        category: 'Electric Bikes'
                      })}
                      className="px-5 py-1 text-sm border border-white rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/30 transition"
                    >
                      Shop
                    </button>
                </div>
            </div>

            {/* Card 4 */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#a5ab8b] group flex flex-col items-center justify-end pb-8">
                <Link href="/bikes/4" aria-label="View Fixed-Gear City Bicycle details" className="absolute inset-0">
                  <img src="/Fixed-Gear City Bicycle.jpg" alt="Yellow fixed-gear city bicycle" className="h-full w-full bg-white object-contain p-3" />
                </Link>
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 flex flex-col items-center text-white">
                    <span className="text-base md:text-lg font-medium mb-1 drop-shadow-sm">Explore</span>
                    <span className="font-[family-name:var(--font-great-vibes)] text-3xl md:text-4xl mb-3 drop-shadow-md">Fixed-Gear City</span>
                    <button 
                      onClick={() => addToCart({
                        id: 4,
                        name: 'Fixed-Gear City Bicycle',
                        price: 'Kes 48,000',
                        image: '/Fixed-Gear City Bicycle.jpg',
                        category: 'Bikes'
                      })}
                      className="px-5 py-1 text-sm border border-white rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/30 transition"
                    >
                      Shop
                    </button>
                </div>
            </div>

        </div>

        <p className="mb-12 text-sm text-gray-500">Illustrative product artwork and sample KES prices. Confirm specifications and availability before purchase.</p>

        {/* Bottom Banner Area */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between w-full min-h-[200px] md:h-[300px] gap-8 md:gap-0">
            <div className="mb-0 md:mb-4 text-center md:text-left">
               <span className="font-[family-name:var(--font-great-vibes)] text-[4rem] sm:text-[5rem] md:text-[6rem] leading-none text-black whitespace-nowrap">Best Sellers</span>
            </div>
            <div className="w-full md:w-1/2 h-48 md:h-full rounded-2xl md:rounded-none md:rounded-tl-3xl md:rounded-bl-3xl overflow-hidden">
                <img src="/Fixed-Gear City Bicycle.jpg" alt="Yellow fixed-gear city bicycle" className="w-full h-full object-cover object-center" />
            </div>
        </div>

      </div>
    </main>
  );
}
