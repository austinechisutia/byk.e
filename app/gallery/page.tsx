"use client";

import React from 'react';
import Link from 'next/link';

export default function GalleryPage() {
  return (
    <main className="bg-[#f9f9f7] min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 font-sans tracking-wide">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 md:mb-16 gap-6 md:gap-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-800 font-normal leading-tight">
            Bikes for <span className="font-serif italic">city streets</span>, <br/>
            open roads, and <span className="font-serif italic font-medium">new routes</span>
          </h1>
          <p className="text-gray-600 max-w-sm">A look at the bike currently featured in the Byk.e collection.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-10 items-center">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-200">
            <img src="/bike.jpg" alt="Black and yellow fixed-gear bicycle" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/15"></div>
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
              <p className="text-sm uppercase tracking-widest">Urban riding</p>
              <h2 className="text-3xl md:text-5xl font-medium mt-2">Fixed-gear bicycle</h2>
            </div>
          </div>
          <div className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-900">Find your kind of ride</h2>
            <p className="text-gray-600 leading-relaxed">Browse electric bikes, city and hybrid bicycles, replacement parts, and everyday riding accessories.</p>
            <div className="flex flex-wrap gap-3 pt-2">
              {['Electric Bikes', 'Bikes', 'Parts', 'Accessories'].map((category) => (
                <Link key={category} href="/shop" className="px-4 py-2 border border-gray-300 text-gray-800 hover:border-[#11430F] hover:text-[#11430F] transition-colors">
                  {category}
                </Link>
              ))}
            </div>
            <p className="text-xs text-gray-500 pt-2">Only the featured bicycle is photographed here. Product images and specifications should be added for each listing.</p>
          </div>
        </div>

      </div>
    </main>
  );
}
