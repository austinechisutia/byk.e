'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { products } from '@/lib/products';

const categories = ['All', 'Electric Bikes', 'Bikes', 'Parts', 'Accessories'];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase().trim() ?? '';

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery) || p.category.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="bg-white min-h-screen pt-24 md:pt-32 pb-24">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 font-sans tracking-wide">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
              <h1 className="text-4xl md:text-6xl text-gray-900 font-serif italic mb-4">Shop Collection</h1>
              {searchQuery ? (
                <p className="text-xl text-gray-600 max-w-lg">
                  Showing results for <span className="font-semibold text-gray-900">&ldquo;{searchParams.get('q')}&rdquo;</span>
                  <a href="/shop" className="ml-3 text-sm underline text-[#11430F] hover:text-black">Clear</a>
                </p>
              ) : (
                <p className="text-xl text-gray-600 max-w-lg">
                  Browse electric bikes, everyday bicycles, replacement parts, and ride-ready accessories.
                </p>
              )}
              <p className="mt-3 text-sm text-gray-500">Illustrative product artwork and sample KES prices. Confirm specifications, compatibility, and availability before purchase.</p>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-full border transition-all duration-300 ${
                        activeCategory === cat 
                        ? 'bg-[#11430F] text-white border-[#11430F]' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {cat}
                  </button>
              ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
                <div key={product.id} className="group flex flex-col rounded-2xl overflow-hidden bg-[#f8f9f5] border border-gray-100/50 hover:shadow-xl transition-shadow duration-500">
                    <div className="relative aspect-[4/5] w-full bg-[#A8AD8B] overflow-hidden">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700" 
                        />
                        {product.tag && (
                            <span className="absolute top-4 left-4 border border-white/50 text-white bg-black/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-serif italic tracking-wider">
                                {product.tag}
                            </span>
                        )}
                    </div>
                    <div className="p-6 flex flex-col flex-1 gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs uppercase tracking-widest text-[#11430F] font-bold mb-1 block">{product.category}</span>
                                <h4 className="text-gray-900 font-medium text-xl leading-snug">{product.name}</h4>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200/50">
                            <span className="text-gray-900 font-bold text-lg">{product.price}</span>
                            <button 
                                onClick={() => addToCart(product)}
                                className="bg-[#11430F] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black transition-colors duration-300 text-xl"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {filteredProducts.length === 0 && (
            <div className="text-center py-20">
                <p className="text-2xl text-gray-500 italic">
                  {searchQuery ? `No products found for "${searchParams.get('q')}"` : 'No products found in this category yet.'}
                </p>
            </div>
        )}

      </div>
    </main>
  );
}
