'use client';

import React from 'react';
import ScrollReveal from '../layout/ScrollReveal';

const DiscoverySection = () => {
    return (
        <section className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24 font-sans">
            
            {/* Overlapping Images Gallery */}
            <ScrollReveal direction="up" className="relative flex justify-center items-center h-[300px] sm:h-[400px] md:h-[550px] mb-12 md:mb-20">
                {/* Left Image */}
                <div className="absolute left-[5%] md:left-[10%] w-[35%] aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden shadow-xl z-10 translate-y-4 md:translate-y-8 border border-white/20">
                    <img src="/product-utensils-bamboo.png" alt="Eco kitchenware 1" className="w-full h-full object-cover" />
                </div>
                
                {/* Center Main Image (Elevated) */}
                <div className="relative w-[50%] md:w-[45%] aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl z-30 border-4 border-white">
                    <img src="/gallery-walnut-bowls.png" alt="Discovery Main" className="w-full h-full object-cover" />
                </div>

                {/* Right Image */}
                <div className="absolute right-[5%] md:right-[10%] w-[35%] aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden shadow-xl z-10 translate-y-4 md:translate-y-8 border border-white/20">
                    <img src="/product-drinkware.png" alt="Eco kitchenware 2" className="w-full h-full object-cover" />
                </div>
            </ScrollReveal>

            {/* Description Text with Chips */}
            <ScrollReveal delay={0.3} className="text-center max-w-4xl mx-auto px-4 md:px-0">
                <p className="text-2xl sm:text-3xl md:text-5xl font-normal text-gray-800 leading-[1.3] md:leading-[1.4]">
                    Discover our commitment to 
                    <span className="inline-flex items-center gap-2 mx-2">
                        <span className="inline-block w-10 md:w-16 h-6 md:h-8 rounded-full overflow-hidden translate-y-1 md:translate-y-2 border border-gray-200">
                             <img src="/product-utensils-bamboo.png" className="w-full h-full object-cover" alt="texture" />
                        </span>
                        <span className="font-bold underline decoration-2 underline-offset-4">sustainable</span>
                    </span>
                    material low impact production, and <span className="font-bold">ethical sourcing</span> partnership all crafted- to support a healthier planet and a 
                    <span className="inline-flex items-center gap-2 mx-2">
                         <span className="inline-block w-10 md:w-16 h-6 md:h-8 rounded-full overflow-hidden translate-y-1 md:translate-y-2 border border-gray-200">
                             <img src="/bg-kitchen.png" className="w-full h-full object-cover" alt="texture" />
                        </span>
                        <span className="font-medium italic font-serif text-[#11430F]">greener kitchen</span>
                    </span>
                </p>
            </ScrollReveal>

        </section>
    );
};

export default DiscoverySection;
