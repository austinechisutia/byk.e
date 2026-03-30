'use client';

import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';
import AuthModal from '@/components/auth/AuthModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { data: session } = useSession();
  const pathname = usePathname();
  const isDarkTheme = pathname === '/bestsellers' || pathname === '/gallery' || pathname === '/shop' || pathname === '/about' || pathname === '/checkout';
  
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

  const handleUserClick = () => {
    if (session?.user) {
      void signOut({ callbackUrl: '/' });
      return;
    }

    setIsAuthModalOpen(true);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 w-full transition-all duration-300 ${navBg} ${navPadding} ${textColor}`}>
        <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto relative">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10 font-semibold text-lg">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`relative py-1 transition-all duration-300 ${hoverColor} ${isActive ? 'opacity-100' : 'opacity-80'}`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-current transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0'}`}></span>
                </Link>
              );
            })}
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
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition relative ${iconBg}`}
            >
                 <ShoppingBag className={`w-4 h-4 md:w-5 md:h-5 ${textColor}`} />
                 {cartCount > 0 && (
                   <span className="absolute -top-1 -right-1 bg-[#11430F] text-[#e4f386] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                     {cartCount}
                   </span>
                 )}
            </button>
            <button
              onClick={handleUserClick}
              className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition ${iconBg} relative`}
              title={session?.user ? `${session.user.email || session.user.name || 'User'} - Click to sign out` : 'Sign in or create account'}
            >
              {session?.user ? (
                <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-sm ${textColor} bg-[#11430F]/30`}>
                  {(session.user.name?.[0] || session.user.email?.[0] || 'U').toUpperCase()}
                </div>
              ) : (
                <User className={`w-4 h-4 md:w-5 md:h-5 ${textColor}`} />
              )}
            </button>
            {session?.user?.name && (
              <span className={`hidden xl:inline text-sm font-medium ${textColor}`}>
                {session.user.name}
              </span>
            )}
          </div>
        </div>
      </nav>

      <CartDrawer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

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
