import React from 'react';

const AboutSection = () => {
  return (
    <section className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24 font-sans tracking-wide">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        {/* Text Content */}
        <div className="order-2 md:order-1">
          <h2 className="text-3xl md:text-5xl font-medium leading-[1.2] mb-8 text-gray-900">
            Dedicated to <br />
            <span className="font-serif italic text-[#11430F] font-normal">conscious living</span> <br />
            and timeless design.
          </h2>
          
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
            <p>
              At <span className="font-serif italic text-gray-900">Homevigne</span>, we believe that the objects we surround ourselves with should tell a story of care, quality, and respect for our planet. Our journey began with a simple desire: to bridge the gap between aesthetic excellence and environmental responsibility.
            </p>
            <p>
              Every piece in our collection is thoughtfully curated and crafted using sustainable materials that age beautifully. We partner with artisans who share our commitment to ethical production, ensuring that your kitchen is not just a place for meals, but a sanctuary of <span className="text-[#11430F] font-medium">positive impact</span>.
            </p>
            <p className="font-medium text-gray-900">
              Join us in cultivating a home that honors nature without compromising on style.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
              <span className="w-2 h-2 bg-[#e4f386] rounded-full"></span>
              Ethically Sourced
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
              <span className="w-2 h-2 bg-[#e4f386] rounded-full"></span>
              Ultra-durable
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
              <span className="w-2 h-2 bg-[#e4f386] rounded-full"></span>
              Zero-waste goal
            </div>
          </div>
        </div>

        {/* Image Content */}
        <div className="order-1 md:order-2 relative group">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10">
            <img 
              src="/gallery-walnut-bowls.png" 
              alt="Artisanal kitchenware" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#11430F]/10 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#e4f386]/30 rounded-full blur-3xl z-0 animate-pulse"></div>
          <div className="absolute -top-6 -left-6 w-24 h-24 border border-[#11430F]/20 rounded-full z-0"></div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
