import React from 'react';

const BestsellersSection = () => {
    return (
      <section className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-16 md:pt-24 font-sans tracking-wide">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 md:gap-0">
            <div>
                <h2 className="text-lg md:text-xl text-gray-800 mb-2">Eco Essential Planet-Friendly</h2>
                <h3 className="text-3xl md:text-4xl text-gray-900 font-medium">
                    Bestselling <span className="font-serif italic font-normal">Products</span>
                </h3>
            </div>
            <button className="flex items-center gap-2 text-xl md:text-2xl text-[#11430F] hover:opacity-80 transition font-medium">
                More products <span className="text-2xl md:text-3xl mt-[-4px]">&rarr;</span>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="flex flex-col rounded-xl overflow-hidden bg-[#e9fba7]">
                <div className="relative aspect-[4/5] w-full bg-[#A8AD8B]">
                    <img src="/product-utensils-green.png" alt="Utencils holder" className="w-full h-full object-cover mix-blend-multiply" />
                    <span className="absolute top-4 left-4 border border-white/50 text-white bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-serif italic">Promotion</span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-3">
                            <span className="w-3.5 h-3.5 rounded-full bg-blue-700"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-gray-900"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-green-800"></span>
                        </div>
                        <h4 className="text-gray-900 font-medium text-lg leading-tight">Utencils <br/> holder</h4>
                    </div>
                    <div className="flex justify-between items-end mt-auto">
                        <span className="text-gray-900 font-medium">Kes 999</span>
                        <button className="bg-[#11430F] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1a5c17] transition">+ Cart</button>
                    </div>
                </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col rounded-xl overflow-hidden bg-[#e9fba7]">
                <div className="relative aspect-[4/5] w-full bg-[#A8AD8B]">
                    <img src="/product-utensils-bamboo.png" alt="Bamboo Made Utencils holder" className="w-full h-full object-cover mix-blend-multiply" />
                    <span className="absolute top-4 left-4 border border-white/50 text-white bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-serif italic">New</span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-3">
                            <span className="w-3.5 h-3.5 rounded-full bg-blue-700"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-gray-900"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-green-800"></span>
                        </div>
                        <h4 className="text-gray-900 font-medium text-lg leading-tight">Bamboo Made Utencils <br/> holder</h4>
                    </div>
                    <div className="flex justify-between items-end mt-auto">
                        <span className="text-gray-900 font-medium">Kes 999</span>
                        <button className="bg-[#11430F] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1a5c17] transition">+ Cart</button>
                    </div>
                </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col rounded-xl overflow-hidden bg-[#e9fba7]">
                <div className="relative aspect-[4/5] w-full bg-[#A8AD8B]">
                    <img src="/product-fridge.png" alt="Fridge" className="w-full h-full object-cover mix-blend-multiply" />
                    <span className="absolute top-4 left-4 border border-white/50 text-white bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-serif italic border-box">Customer Favourite</span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-3">
                            <span className="w-3.5 h-3.5 rounded-full bg-blue-700"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-gray-900"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-green-800"></span>
                        </div>
                        <h4 className="text-gray-900 font-medium text-lg leading-tight">Fridge</h4>
                    </div>
                    <div className="flex justify-between items-end mt-auto">
                        <span className="text-gray-900 font-medium">Kes 999</span>
                        <button className="bg-[#11430F] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1a5c17] transition">+ Cart</button>
                    </div>
                </div>
            </div>

            {/* Card 4 */}
            <div className="flex flex-col rounded-xl overflow-hidden bg-[#e9fba7]">
                <div className="relative aspect-[4/5] w-full bg-[#A8AD8B]">
                    <img src="/product-drinkware.png" alt="Reusable drinkware" className="w-full h-full object-cover mix-blend-multiply" />
                    <span className="absolute top-4 left-4 border border-white/50 text-white bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-serif italic">New</span>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                        <div className="flex items-center gap-1.5 mb-3">
                            <span className="w-3.5 h-3.5 rounded-full bg-blue-700"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-gray-900"></span>
                            <span className="w-3.5 h-3.5 rounded-full bg-green-800"></span>
                        </div>
                        <h4 className="text-gray-900 font-medium text-lg leading-tight">Reusable drinkware for <br/> a greener lifestyle.</h4>
                    </div>
                    <div className="flex justify-between items-end mt-auto">
                        <span className="text-gray-900 font-medium">Kes 999</span>
                        <button className="bg-[#11430F] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1a5c17] transition">+ Cart</button>
                    </div>
                </div>
            </div>
        </div>
      </section>
    );
};

export default BestsellersSection;
