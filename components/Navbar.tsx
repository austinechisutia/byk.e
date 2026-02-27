import React from 'react';
import { Search, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-8 text-white w-full max-w-[1400px] mx-auto">
      <div className="flex items-center gap-10 font-semibold text-lg">
        <Link href="#" className="hover:text-gray-200">Shop</Link>
        <Link href="#" className="hover:text-gray-200">Bestsellers</Link>
        <Link href="#" className="hover:text-gray-200">Gallery</Link>
        <Link href="#" className="hover:text-gray-200">About</Link>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <Link href="/" className="text-2xl font-serif tracking-wide">Homevigne</Link>
      </div>

      <div className="flex items-center gap-4 pr-4">
        <div className="relative flex items-center">
             <Search className="absolute left-3 w-4 h-4 text-gray-800 font-bold" />
             <input type="text" placeholder="Search Product" className="pl-9 pr-4 py-2 bg-white/80 text-sm text-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#e4f386] w-56 placeholder-gray-800 font-medium" />
        </div>
        <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition">
             <ShoppingBag className="w-5 h-5 text-white" />
        </button>
        <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition">
             <User className="w-5 h-5 text-white" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
