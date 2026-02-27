'use client';

import React from 'react';

const FooterSection = () => {
    return (
        <footer className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pb-12">
            <div className="bg-[#1a3020] rounded-[3rem] p-12 md:p-24 relative overflow-hidden flex flex-col items-center justify-center text-center">
                
                {/* Decorative Images - Absolutely positioned around the content */}
                <div className="hidden lg:block absolute left-12 top-20 w-48 h-36 rounded-2xl overflow-hidden shadow-2xl -rotate-6">
                    <img src="/bg-kitchen.png" alt="Lifestyle 1" className="w-full h-full object-cover" />
                </div>
                <div className="hidden lg:block absolute left-20 bottom-24 w-56 h-40 rounded-2xl overflow-hidden shadow-2xl rotate-3">
                    <img src="/gallery-walnut-bowls.png" alt="Lifestyle 2" className="w-full h-full object-cover" />
                </div>
                <div className="hidden lg:block absolute right-12 top-24 w-52 h-36 rounded-2xl overflow-hidden shadow-2xl rotate-6">
                    <img src="/product-utensils-bamboo.png" alt="Lifestyle 3" className="w-full h-full object-cover" />
                </div>
                <div className="hidden lg:block absolute right-20 bottom-20 w-56 h-40 rounded-2xl overflow-hidden shadow-2xl -rotate-3">
                    <img src="/product-drinkware.png" alt="Lifestyle 4" className="w-full h-full object-cover" />
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex flex-col items-center">
                    <p className="text-white text-2xl md:text-3xl font-medium mb-4">Get Recipes</p>
                    <h2 className="text-[#e4f386] text-7xl md:text-[8rem] font-serif italic leading-none mb-10">10% off</h2>
                    
                    {/* Subscription Form */}
                    <div className="flex flex-col sm:flex-row w-full max-w-md border border-white/30 rounded-full overflow-hidden mb-12 sm:bg-white/5 backdrop-blur-sm">
                        <input 
                            type="email" 
                            placeholder="Your Email" 
                            className="bg-transparent text-white px-8 py-4 sm:py-5 flex-grow focus:outline-none placeholder-white/60 text-lg"
                        />
                        <button className="bg-white text-black px-10 py-4 sm:py-5 font-medium hover:bg-gray-200 transition text-lg sm:rounded-none">
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Bottom Text */}
                <div className="relative z-10 max-w-2xl mt-4">
                    <p className="text-white/80 text-xl md:text-2xl font-light leading-relaxed">
                        Eco-friendly recipes, cooking tips and 10% discount on 
                        sustainablekitchenware for a greenerlifestyle.
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default FooterSection;
