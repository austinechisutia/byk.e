'use client';

import React from 'react';
import Link from 'next/link';

const FooterSection = () => {
    return (
        <footer className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pb-12">
            <div className="bg-[#1a3020] rounded-[3rem] p-12 md:p-24 relative overflow-hidden flex flex-col items-center justify-center text-center">
                
                <img src="/Fixed-Gear City Bicycle.jpg" alt="Yellow fixed-gear city bicycle" className="absolute inset-0 w-full h-full object-cover opacity-25" />

                {/* Main Content */}
                <div className="relative z-10 flex flex-col items-center">
                    <p className="text-white text-2xl md:text-3xl font-medium mb-4">Find your next ride</p>
                    <h2 className="text-[#e4f386] text-5xl md:text-7xl font-serif italic leading-tight mb-10">Power your everyday.</h2>
                    <Link href="/shop" className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition text-lg">
                        Explore bikes <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>

                {/* Bottom Text */}
                <div className="relative z-10 max-w-2xl mt-4">
                    <p className="text-white/80 text-xl md:text-2xl font-light leading-relaxed">
                        Browse electric bikes, everyday bicycles, replacement parts, and riding accessories.
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default FooterSection;
