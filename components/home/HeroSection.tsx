import React from 'react';
import Link from 'next/link';
import ScrollReveal from '../layout/ScrollReveal';

const HeroSection = () => {
    return (
        <div className="relative min-h-screen w-full flex items-center font-sans tracking-wide">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/electric-bikes/city-electric-bike.jpg"
                    alt="Yellow and black city electric bike"
                    className="w-full h-full object-cover"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-24 md:pt-32 pb-16 md:pb-20">
                {/* Left side text */}
                <ScrollReveal className="flex flex-col items-start text-white pt-10 md:pt-0">
                    <h1 className="text-4xl sm:text-5xl md:text-[5.5rem] font-medium leading-[1.1] mb-6 tracking-tight">
                        Find your <br />
                        <span className="font-serif italic text-[#c6d753] font-normal pr-2 md:pr-4 tracking-normal">next ride</span> here.
                    </h1>
                    <p className="max-w-md text-gray-200 text-base md:text-[1.1rem] mb-8 md:mb-10 font-light opacity-90 leading-relaxed inline-block">
                        Shop electric bikes, everyday bicycles, and the parts and gear that keep every ride moving.
                    </p>
                    <Link href="/shop" className="bg-[#e4f386] hover:bg-[#d8e874] text-black rounded-[2rem] px-6 md:px-8 py-2.5 md:py-3 text-xl md:text-2xl font-medium flex items-center gap-3 transition-transform hover:scale-105">
                        Shop bikes <span className="text-2xl md:text-3xl font-light mt-[-4px]">&rarr;</span>
                    </Link>
                </ScrollReveal>

                {/* Right side floating box */}
                <ScrollReveal direction="right" delay={0.2} className="flex justify-end relative h-full items-end mt-12 md:mt-0">
                    <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 md:p-10 max-w-sm border border-white/10 relative shadow-2xl w-full mr-0 md:mr-4">
                        <p className="text-white text-xl md:text-[1.7rem] font-light leading-snug mb-8 md:mb-10 relative z-10 tracking-wide">
                            City rides. <br />
                            Trail days. <br />
                            Electric power.
                        </p>
                        <p className="text-[#e4f386] text-6xl md:text-[7.5rem] font-serif italic m-0 text-right pr-2 pb-0 leading-none relative z-10 opacity-90">
                            E-
                        </p>
                        {/* Leaf icon */}
                        <div className="absolute top-6 right-6 md:top-10 md:right-10 text-white">
                            <svg className="w-8 h-8 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                            </svg>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
};

export default HeroSection;
