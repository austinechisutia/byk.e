import React from 'react';

export default function Home() {
  return (
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
  );
}
