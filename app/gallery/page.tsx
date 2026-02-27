"use client";

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function GalleryPage() {
  const images = [
    {
      src: '/gallery-walnut-bowls.png',
      alt: 'Artisanal Walnut Bowls',
      title: 'Walnut Wood',
      subtitle: 'Creative',
      large: false
    },
    {
      src: '/product-utensils-green.png',
      alt: 'Copper Fruit Stand',
      title: 'Copper Mesh',
      subtitle: 'Creative',
      large: true
    },
    {
      src: '/product-utensils-bamboo.png',
      alt: 'Marble Rolling Pin',
      title: 'Marble & Wood',
      subtitle: 'Creative',
      large: false
    },
    {
      src: '/product-fridge.png',
      alt: 'Wooden Utensil Holder',
      title: 'Solid Oak',
      subtitle: 'Inspire',
      large: true
    },
    {
      src: '/product-drinkware.png',
      alt: 'Chicken Egg Basket',
      title: 'Vintage Wire',
      subtitle: 'Creative',
      large: false
    }
  ];

  return (
    <main className="bg-[#f9f9f7] min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 font-sans tracking-wide">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 md:mb-16 gap-6 md:gap-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-800 font-normal leading-tight">
            Thoughtful Planet -Priotizing <span className="font-serif italic">Ideas</span> <br/>
            and inspiration <span className="font-serif italic font-medium">Gallery</span>
          </h1>
          <div className="flex gap-4">
            <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition">
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#11430F] flex items-center justify-center text-white hover:opacity-90 transition">
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Gallery Slider/Grid */}
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
          {images.map((img, index) => (
            <div 
              key={index} 
              className={`relative flex-shrink-0 rounded-2xl md:rounded-3xl overflow-hidden group transition-all duration-500 ${img.large ? 'w-[75vw] sm:w-[450px] aspect-[4/5]' : 'w-[65vw] sm:w-[320px] aspect-[3/4]'}`}
            >
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
              
              {/* Overlay Text */}
              <div className="absolute bottom-6 md:bottom-10 left-6 md:left-8 text-white z-10 pointer-events-none">
                <p className="text-xl md:text-2xl font-medium drop-shadow-md mb-0">{img.title}</p>
                <p className="font-[family-name:var(--font-great-vibes)] text-3xl md:text-4xl drop-shadow-lg leading-none mt-[-4px]">{img.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
