'use client';

import React from 'react';
import ScrollReveal from '../layout/ScrollReveal';

const ReviewsSection = () => {
    const reviews = [
        {
            text: "Think about your usual route, distance, and terrain before choosing a bike.",
            name: "Choose your route",
            role: "Commute, trail, or weekend ride",
            active: false
        },
        {
            text: "An electric bike adds pedal assistance for hills and longer days in the saddle.",
            name: "Consider electric",
            role: "Compare assist options",
            active: false
        },
        {
            text: "Check frame fit and component compatibility before ordering a bike or part.",
            name: "Check the details",
            role: "Fit and compatibility matter",
            active: true
        },
        {
            text: "Helmets, racks, locks, and replacement parts help tailor a setup to your day.",
            name: "Finish your setup",
            role: "Parts and accessories",
            active: false
        }
    ];

    return (
        <section className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12">
            <div className="bg-[#e5e5e0]/60 rounded-[3rem] p-8 md:p-16">
                
                {/* Header Area */}
                <ScrollReveal direction="down" className="flex flex-col md:flex-row items-center md:items-start justify-between mb-16 gap-8 md:gap-0">
                    <div className="relative flex items-center h-32 md:h-48">
                        <span className="text-8xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-gray-900 pr-4">01</span>
                        <div className="relative h-full flex items-center">
                            {/* Large Diagonal Slash */}
                            <div className="w-[2px] h-24 md:h-40 bg-gray-900 origin-bottom-left rotate-[25deg] md:rotate-[20deg] absolute left-0"></div>
                            <span className="text-3xl md:text-5xl font-medium pt-12 md:pt-24 pl-6 md:pl-10">03</span>
                        </div>
                    </div>

                    <div className="max-w-xs md:max-w-sm text-center md:text-left pt-8 md:pt-12">
                        <p className="text-2xl md:text-3xl font-normal leading-tight text-gray-800">
                            A few things <br/>
                            to consider <br/>
                            before your <br/>
                            next ride
                        </p>
                    </div>
                </ScrollReveal>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {reviews.map((review, index) => (
                        <ScrollReveal 
                            key={index} 
                            delay={index * 0.1}
                            className={`rounded-3xl p-8 flex flex-col justify-between aspect-[3/4] ${review.active ? 'bg-white shadow-xl' : 'bg-white/40'}`}
                        >
                            <div className="text-[#ff8a8a] text-6xl font-serif leading-none mb-4">
                                “
                            </div>
                            <p className="text-gray-700 text-lg leading-relaxed mb-8">
                                {review.text}
                            </p>
                            <div className="mt-auto">
                                <p className="text-gray-900 font-serif text-xl font-medium mb-0.5">{review.name}</p>
                                <p className="font-[family-name:var(--font-great-vibes)] text-2xl text-gray-500 leading-none">{review.role}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ReviewsSection;
