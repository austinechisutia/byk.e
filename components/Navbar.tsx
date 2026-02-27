'use client';

import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isDarkTheme = pathname === '/bestsellers' || pathname === '/gallery' || pathname === '/shop' || pathname === '/about';
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic classes based on route and scroll state
  const textColor = isDarkTheme || isScrolled ? 'text-gray-900' : 'text-white';
  const hoverColor = isDarkTheme || isScrolled ? 'hover:text-gray-600' : 'hover:text-gray-200';
  const iconBg = isDarkTheme || isScrolled ? 'bg-gray-200/50 hover:bg-gray-300/50' : 'bg-white/20 hover:bg-white/30';
  const searchBg = isDarkTheme || isScrolled ? 'bg-gray-100 placeholder-gray-500' : 'bg-white/80 placeholder-gray-800';
  
  const navBg = isScrolled 
    ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' 
    : 'bg-transparent';
  
  const navPadding = isScrolled ? 'py-4 md:py-5' : 'py-6 md:py-8';

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'Bestsellers', href: '/bestsellers' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 w-full transition-all duration-300 ${navBg} ${navPadding} ${textColor}`}>
        <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto relative">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10 font-semibold text-lg">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={hoverColor}>{link.name}</Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 transition-colors hover:bg-white/10 rounded-full"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="text-xl md:text-2xl font-serif tracking-wide">Homevigne</Link>
          </div>

          {/* Search and Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden sm:flex items-center">
                 <Search className={`absolute left-3 w-4 h-4 font-bold ${isDarkTheme || isScrolled ? 'text-gray-500' : 'text-gray-800'}`} />
                 <input type="text" placeholder="Search Product" className={`pl-9 pr-4 py-2 text-sm text-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#e4f386] w-36 lg:w-56 font-medium ${searchBg}`} />
            </div>
            <button className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition ${iconBg}`}>
                 <ShoppingBag className={`w-4 h-4 md:w-5 md:h-5 ${textColor}`} />
            </button>
            <button className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition ${iconBg}`}>
                 <User className={`w-4 h-4 md:w-5 md:h-5 ${textColor}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Mesh Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center lg:hidden">
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-8 text-white p-2"
          >
            <X size={32} />
          </button>
          <div className="flex flex-col items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className="text-white text-3xl font-medium hover:text-[#e4f386] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
