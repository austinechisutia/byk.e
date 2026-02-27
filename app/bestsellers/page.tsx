import React from 'react';

export default function BestsellersPage() {
  return (
    <main className="bg-white min-h-screen pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 font-sans tracking-wide">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-6 md:gap-0">
          <h1 className="text-2xl md:text-3xl text-gray-700 font-normal leading-snug">
            Explore our Thoughtful and <br className="hidden sm:block" />
            Planet-first <span className="font-serif italic font-medium">Products</span>
          </h1>
          <button className="flex items-center gap-2 text-xl md:text-2xl text-[#11430F] hover:opacity-80 transition font-medium">
             More products <span className="text-2xl md:text-3xl mt-[-4px]">&rarr;</span>
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 md:mb-24">
            
            {/* Card 1 */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#a5ab8b] group flex flex-col items-center justify-end pb-8">
                <img src="/product-utensils-green.png" alt="Cup&co Utensils" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-500 group-hover:scale-105" />
                <div className="relative z-10 flex flex-col items-center text-white">
                    <span className="text-base md:text-lg font-medium mb-1 drop-shadow-sm">Explore</span>
                    <span className="font-[family-name:var(--font-great-vibes)] text-3xl md:text-4xl mb-3 drop-shadow-md">Cup&co</span>
                    <button className="px-5 py-1 text-sm border border-white rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/30 transition">Shop</button>
                </div>
            </div>

            {/* Card 2 */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#a5ab8b] group flex flex-col items-center justify-end pb-8">
                <img src="/product-utensils-bamboo.png" alt="Ecospoonery Bamboo" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-500 group-hover:scale-105" />
                <div className="relative z-10 flex flex-col items-center text-white">
                    <span className="text-base md:text-lg font-medium mb-1 drop-shadow-sm">Explore</span>
                    <span className="font-[family-name:var(--font-great-vibes)] text-3xl md:text-4xl mb-3 drop-shadow-md">Ecospoonery</span>
                    <button className="px-5 py-1 text-sm border border-white rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/30 transition">Shop</button>
                </div>
            </div>

            {/* Card 3 */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#a5ab8b] group flex flex-col items-center justify-end pb-8">
                <img src="/product-fridge.png" alt="Naturesip Fridge" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-500 group-hover:scale-105" />
                <div className="relative z-10 flex flex-col items-center text-white">
                    <span className="text-base md:text-lg font-medium mb-1 drop-shadow-sm">Explore</span>
                    <span className="font-[family-name:var(--font-great-vibes)] text-3xl md:text-4xl mb-3 drop-shadow-md">Naturesip</span>
                    <button className="px-5 py-1 text-sm border border-white rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/30 transition">Shop</button>
                </div>
            </div>

            {/* Card 4 */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#a5ab8b] group flex flex-col items-center justify-end pb-8">
                <img src="/product-drinkware.png" alt="Naturesip Flask" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-500 group-hover:scale-105" />
                <div className="relative z-10 flex flex-col items-center text-white">
                    <span className="text-base md:text-lg font-medium mb-1 drop-shadow-sm">Explore</span>
                    <span className="font-[family-name:var(--font-great-vibes)] text-3xl md:text-4xl mb-3 drop-shadow-md">Naturesip</span>
                    <button className="px-5 py-1 text-sm border border-white rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/30 transition">Shop</button>
                </div>
            </div>

        </div>

        {/* Bottom Banner Area */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between w-full min-h-[200px] md:h-[300px] gap-8 md:gap-0">
            <div className="mb-0 md:mb-4 text-center md:text-left">
               <span className="font-[family-name:var(--font-great-vibes)] text-[4rem] sm:text-[5rem] md:text-[6rem] leading-none text-black whitespace-nowrap">Best Sellers</span>
            </div>
            <div className="w-full md:w-1/2 h-48 md:h-full rounded-2xl md:rounded-none md:rounded-tl-3xl md:rounded-bl-3xl overflow-hidden">
                <img src="/bestsellers-banner.png" alt="Best Sellers Jar" className="w-full h-full object-cover object-center" />
            </div>
        </div>

      </div>
    </main>
  );
}
