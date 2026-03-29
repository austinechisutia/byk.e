import React from 'react';
import ScrollReveal from '../layout/ScrollReveal';

const ImpactSection = () => {
    return (
      <section className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-12 md:pt-16 pb-12 font-sans tracking-wide">
        {/* Large Image Block */}
        <ScrollReveal className="relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-lg mb-8">
            <img src="/bg-kitchen.png" alt="Kitchen interior" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 md:bg-black/20"></div> {/* Subtle dark overlay for text readability */}
            <div className="absolute bottom-8 md:bottom-12 left-6 md:left-12 max-w-2xl pr-6 md:pr-0">
                <p className="text-white text-xl sm:text-2xl md:text-3xl font-medium leading-snug drop-shadow-md">
                    We craft Kitchenware you can trust for<br className="hidden sm:block" />
                    years to come - through evolving meals<br className="hidden sm:block" />
                    and everyday life. Each piece is thoroughly<br className="hidden sm:block" />
                    made with sustainable material
                </p>
            </div>
        </ScrollReveal>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <ScrollReveal delay={0.1} className="bg-[#E3E3DE] rounded-2xl p-8 flex items-center justify-center gap-6 h-36 transition-transform hover:scale-[1.02]">
                <div className="bg-white rounded-full w-[4.5rem] h-[4.5rem] flex items-center justify-center shadow-sm shrink-0">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#11430F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 21-1-1C5 14 3 11 3 8a6 6 0 0 1 12 0c0 3-2 6-8 12z"/>
                        <path d="M12 21v-8"/>
                        <path d="M8 13s2-2 4-2"/>
                    </svg>
                </div>
                <div className="flex flex-col justify-center">
                    <span className="text-[#11430F] font-serif italic text-xl leading-none mb-1">Natural</span>
                    <span className="text-[#11430F] font-medium text-2xl leading-none">Finish</span>
                </div>
            </ScrollReveal>

            {/* Feature 2 */}
            <ScrollReveal delay={0.2} className="bg-[#E3E3DE] rounded-2xl p-8 flex items-center justify-center gap-6 h-36 transition-transform hover:scale-[1.02]">
                <div className="bg-white rounded-full w-[4.5rem] h-[4.5rem] flex items-center justify-center shadow-sm shrink-0">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#689E5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                        <path d="M12 7v5l4 2"/>
                    </svg>
                </div>
                <div className="flex flex-col justify-center">
                    <span className="text-[#11430F] font-serif italic text-xl leading-none mb-1">Eco</span>
                    <span className="text-[#11430F] font-medium text-2xl leading-none">Innovation</span>
                </div>
            </ScrollReveal>

            {/* Feature 3 */}
            <ScrollReveal delay={0.3} className="bg-[#E3E3DE] rounded-2xl p-8 flex items-center justify-center gap-6 h-36 transition-transform hover:scale-[1.02]">
                <div className="bg-white rounded-full w-[4.5rem] h-[4.5rem] flex items-center justify-center shadow-sm shrink-0">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#11430F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="10" rx="2" stroke="#11430F"/>
                        <circle cx="12" cy="5" r="2" stroke="#11430F"/>
                        <path d="M12 7v4" stroke="#11430F"/>
                        <line x1="8" y1="16" x2="8" y2="16" stroke="#11430F"/>
                        <line x1="16" y1="16" x2="16" y2="16" stroke="#11430F"/>
                    </svg>
                </div>
                <div className="flex flex-col justify-center">
                    <span className="text-[#11430F] font-serif italic text-xl leading-none mb-1">Sustainable</span>
                    <span className="text-[#11430F] font-medium text-2xl leading-none">Material</span>
                </div>
            </ScrollReveal>
        </div>
      </section>
    );
};

export default ImpactSection;
