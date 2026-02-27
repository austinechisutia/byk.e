import React from 'react';

export default function Home() {
  return (
    <main className="bg-white min-h-screen pb-24">
      {/* Hero Section */}
      <div className="relative min-h-screen w-full flex items-center font-sans tracking-wide">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/bg-kitchen.png"
            alt="Eco-friendly kitchen background"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Main Content */}
         <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-32 pb-20">
              {/* Left side text */}
              <div className="flex flex-col items-start text-white">
                   <h1 className="text-6xl md:text-[5.5rem] font-medium leading-[1.1] mb-6 tracking-tight">
                       Eco-friendly <br/>
                       <span className="font-serif italic text-[#c6d753] font-normal pr-4 tracking-normal">Kitchenware</span> for <br/>
                       a greener home
                   </h1>
                   <p className="max-w-md text-gray-200 text-[1.1rem] mb-10 font-light opacity-90 leading-relaxed inline-block">
                       The eco-friendly kitchenware niche with a sense<br/>of agency, much like original banner.
                   </p>
                   <button className="bg-[#e4f386] hover:bg-[#d8e874] text-black rounded-[2rem] px-8 py-3 text-2xl font-medium flex items-center gap-3 transition-transform hover:scale-105">
                       Shop now <span className="text-3xl font-light mt-[-4px]">&rarr;</span>
                   </button>
              </div>

              {/* Right side floating box */}
              <div className="flex justify-end relative h-full items-end mt-32 md:mt-0">
                   <div className="bg-black/60 backdrop-blur-md rounded-2xl p-10 max-w-sm border border-white/10 relative shadow-2xl mt-48 w-full mr-4">
                       <p className="text-white text-[1.7rem] font-light leading-snug mb-10 relative z-10 tracking-wide">
                           Natural. <br/>
                           Sustainable. <br/>
                           Eco-conscious.
                       </p>
                       <p className="text-[#e4f386] text-[7.5rem] font-serif italic m-0 text-right pr-2 pb-0 leading-none relative z-10 opacity-90">
                           96%
                       </p>
                       {/* Leaf icon */}
                       <div className="absolute top-10 right-10 text-white">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                          </svg>
                       </div>
                   </div>
              </div>
         </div>
      </div>

      {/* Bestsellers Section */}
      <section className="w-full max-w-[1400px] mx-auto px-12 pt-24 font-sans tracking-wide">
        <div className="flex justify-between items-end mb-10">
            <div>
                <h2 className="text-xl text-gray-800 mb-2">Eco Essential Planet-Friendly</h2>
                <h3 className="text-4xl text-gray-900 font-medium">
                    Bestselling <span className="font-serif italic font-normal">Products</span>
                </h3>
            </div>
            <button className="flex items-center gap-2 text-2xl text-[#11430F] hover:opacity-80 transition font-medium">
                More products <span className="text-3xl mt-[-4px]">&rarr;</span>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="flex flex-col rounded-xl overflow-hidden bg-[#e9fba7]">
                <div className="relative aspect-[4/5] w-full bg-[#A8AD8B]">
                    <img src="/product-utensils-green.png" alt="Utencils holder" className="w-full h-full object-cover mix-blend-multiply" />
                    <span className="absolute top-4 left-4 border border-white/50 text-white bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-serif italic">Promotion</span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-3">
                            <span className="w-3.5 h-3.5 rounded-full bg-blue-700"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-gray-900"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-green-800"></span>
                        </div>
                        <h4 className="text-gray-900 font-medium text-lg leading-tight">Utencils <br/> holder</h4>
                    </div>
                    <div className="flex justify-between items-end mt-auto">
                        <span className="text-gray-900 font-medium">Kes 999</span>
                        <button className="bg-[#11430F] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1a5c17] transition">+ Cart</button>
                    </div>
                </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col rounded-xl overflow-hidden bg-[#e9fba7]">
                <div className="relative aspect-[4/5] w-full bg-[#A8AD8B]">
                    <img src="/product-utensils-bamboo.png" alt="Bamboo Made Utencils holder" className="w-full h-full object-cover mix-blend-multiply" />
                    <span className="absolute top-4 left-4 border border-white/50 text-white bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-serif italic">New</span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-3">
                            <span className="w-3.5 h-3.5 rounded-full bg-blue-700"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-gray-900"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-green-800"></span>
                        </div>
                        <h4 className="text-gray-900 font-medium text-lg leading-tight">Bamboo Made Utencils <br/> holder</h4>
                    </div>
                    <div className="flex justify-between items-end mt-auto">
                        <span className="text-gray-900 font-medium">Kes 999</span>
                        <button className="bg-[#11430F] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1a5c17] transition">+ Cart</button>
                    </div>
                </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col rounded-xl overflow-hidden bg-[#e9fba7]">
                <div className="relative aspect-[4/5] w-full bg-[#A8AD8B]">
                    <img src="/product-fridge.png" alt="Fridge" className="w-full h-full object-cover mix-blend-multiply" />
                    <span className="absolute top-4 left-4 border border-white/50 text-white bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-serif italic border-box">Customer Favourite</span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-3">
                            <span className="w-3.5 h-3.5 rounded-full bg-blue-700"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-gray-900"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-green-800"></span>
                        </div>
                        <h4 className="text-gray-900 font-medium text-lg leading-tight">Fridge</h4>
                    </div>
                    <div className="flex justify-between items-end mt-auto">
                        <span className="text-gray-900 font-medium">Kes 999</span>
                        <button className="bg-[#11430F] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1a5c17] transition">+ Cart</button>
                    </div>
                </div>
            </div>

            {/* Card 4 */}
            <div className="flex flex-col rounded-xl overflow-hidden bg-[#e9fba7]">
                <div className="relative aspect-[4/5] w-full bg-[#A8AD8B]">
                    <img src="/product-drinkware.png" alt="Reusable drinkware" className="w-full h-full object-cover mix-blend-multiply" />
                    <span className="absolute top-4 left-4 border border-white/50 text-white bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-serif italic">New</span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-3">
                            <span className="w-3.5 h-3.5 rounded-full bg-blue-700"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-gray-900"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-green-800"></span>
                        </div>
                        <h4 className="text-gray-900 font-medium text-lg leading-tight">Reusable drinkware for <br/> a greener lifestyle.</h4>
                    </div>
                    <div className="flex justify-between items-end mt-auto">
                        <span className="text-gray-900 font-medium">Kes 999</span>
                        <button className="bg-[#11430F] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1a5c17] transition">+ Cart</button>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </main>
  );
}
