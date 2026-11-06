'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="w-full bg-white px-6 md:px-12 py-16 md:py-24 font-sans">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                    
                    {/* Brand Message and Join Us Button */}
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight mb-10">
                            Byk.e brings electric bikes, bicycles, parts, and ride essentials together for your next journey.
                        </h2>
                        <Link 
                            href="/shop"
                            className="inline-flex items-center gap-3 px-8 py-4 border border-gray-400 rounded-full text-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors group"
                        >
                            Shop bikes
                            <svg 
                                className="w-6 h-6 transition-transform group-hover:translate-x-1" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {/* Navigation Columns */}
                    <div className="flex flex-col gap-16 md:gap-24">
                        <div className="flex flex-col gap-4">
                            <Link href="/shop" className="text-2xl font-medium text-gray-600 hover:text-black">Electric Bikes</Link>
                            <Link href="/shop" className="text-2xl font-medium text-gray-600 hover:text-black">Bicycles</Link>
                            <Link href="/shop" className="text-2xl font-medium text-gray-600 hover:text-black">Parts &amp; Gear</Link>
                            <Link href="/about" className="text-2xl font-medium text-gray-600 hover:text-black">About</Link>
                        </div>
                    </div>
                </div>

                {/* Large Logo and Socials */}
                <div className="border-t border-gray-100 pt-12 flex flex-col md:flex-row justify-between items-end gap-8">
                    <h1 className="text-[12vw] font-bold text-black leading-none tracking-tighter select-none">
                        Byk.e
                    </h1>
                    
                    <div className="flex flex-col gap-4 text-right pb-4 mr-0 md:mr-4">
                        <Link href="#" className="text-2xl font-medium text-gray-600 hover:text-black">Twitter</Link>
                        <Link href="#" className="text-2xl font-medium text-gray-600 hover:text-black">Instagram</Link>
                        <Link href="#" className="text-2xl font-medium text-gray-600 hover:text-black">Facebook</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
