'use client';

import React from 'react';
import ScrollReveal from '../layout/ScrollReveal';

const ReviewsSection = () => {
    const reviews = [
        {
            text: "Home dine's glass jars are awesome for storage and the bamboo utensils are good for daily use",
            name: "Jane Cooper",
            role: "Nutritionist",
            active: false
        },
        {
            text: "Home dine's glass jars are awesome for storage and the bamboo utensils are good for daily use",
            name: "Jane Cooper",
            role: "Nutritionist",
            active: false
        },
        {
            text: "Home dine's glass jars are awesome for storage and the bamboo utensils are good for daily use",
            name: "Jane Cooper",
            role: "Nutritionist",
            active: true
        },
        {
            text: "Home dine's glass jars are awesome for storage and the bamboo utensils are good for daily use",
            name: "Jane Cooper",
            role: "Nutritionist",
            active: false
        }
    ];

    return (
        <section className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12">
            <div className="bg-[#e5e5e0]/60 rounded-[3rem] p-8 md:p-16">
                
                {/* Header Area */}
                <ScrollReveal direction="down" className="flex flex-col md:flex-row items-center md:items-start justify-between mb-16 gap-8 md:gap-0">
                    <div className="relative flex items-center h-32 md:h-48">
                        <span className="text-8xl md:text-[10rem] font-serif italic tracking-tighter leading-none text-gray-900 pr-4">4.9</span>
                        <div className="relative h-full flex items-center">
                            {/* Large Diagonal Slash */}
                            <div className="w-[2px] h-24 md:h-40 bg-gray-900 origin-bottom-left rotate-[25deg] md:rotate-[20deg] absolute left-0"></div>
                            <span className="text-3xl md:text-5xl font-medium pt-12 md:pt-24 pl-6 md:pl-10">5</span>
                        </div>
                    </div>

                    <div className="max-w-xs md:max-w-sm text-center md:text-left pt-8 md:pt-12">
                        <p className="text-2xl md:text-3xl font-normal leading-tight text-gray-800">
                            More than <span className="font-bold">25,000</span> <br/>
                            <span className="font-bold">5-star</span> Reviews for <br/>
                            our Award winning <br/>
                            Eco- Products
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
