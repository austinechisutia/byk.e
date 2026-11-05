'use client';

import React from 'react';
import Link from 'next/link';
import { Bike, BatteryCharging, Wrench } from 'lucide-react';
import ScrollReveal from '../layout/ScrollReveal';

const DiscoverySection = () => {
    return (
        <section className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24 font-sans">
            
            {/* Overlapping Images Gallery */}
                <ScrollReveal direction="up" className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-8 border-y border-gray-200">
                    <Link href="/shop" className="group flex items-start gap-5 py-5">
                        <Bike className="w-9 h-9 text-[#11430F] shrink-0" aria-hidden="true" />
                        <span><span className="block text-xs uppercase tracking-widest text-gray-500 mb-2">01 / Complete bikes</span><span className="text-2xl font-medium text-gray-900 group-hover:text-[#11430F]">City to trail</span><span className="block mt-2 text-gray-600">Browse everyday bicycles for commutes, weekend rides, and more.</span></span>
                    </Link>
                    <Link href="/shop" className="group flex items-start gap-5 py-5">
                        <BatteryCharging className="w-9 h-9 text-[#11430F] shrink-0" aria-hidden="true" />
                        <span><span className="block text-xs uppercase tracking-widest text-gray-500 mb-2">02 / Electric</span><span className="text-2xl font-medium text-gray-900 group-hover:text-[#11430F]">Ride with assist</span><span className="block mt-2 text-gray-600">Explore e-bikes for longer days and easier climbs.</span></span>
                    </Link>
                    <Link href="/shop" className="group flex items-start gap-5 py-5">
                        <Wrench className="w-9 h-9 text-[#11430F] shrink-0" aria-hidden="true" />
                        <span><span className="block text-xs uppercase tracking-widest text-gray-500 mb-2">03 / Parts &amp; gear</span><span className="text-2xl font-medium text-gray-900 group-hover:text-[#11430F]">Keep rolling</span><span className="block mt-2 text-gray-600">Find practical upgrades, replacement parts, and ride essentials.</span></span>
                    </Link>
                </ScrollReveal>

            <ScrollReveal delay={0.3} className="max-w-3xl mx-auto py-16 text-center">
                <p className="text-2xl sm:text-3xl md:text-4xl font-normal text-gray-800 leading-relaxed">
                    The best bike is the one that fits your route. Start with how you ride, then find the bike, parts, and gear to match.
                </p>
            </ScrollReveal>

        </section>
    );
};

export default DiscoverySection;
