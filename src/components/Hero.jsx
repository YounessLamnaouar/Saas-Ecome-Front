import React from "react";
import Navbar from "./Navbar";

export default function Hero() {
  return (
    <div className="min-h-screen transition-colors duration-1000 overflow-hidden bg-amber-600">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 h-[calc(90vh-80px)] flex items-center justify-center">
        <div className="relative group w-full flex justify-center items-center">
            <div className="absolute inset-0 pointer-events-none flex justify-center items-center" data-aos="fade-up" data-aos-duration="1500">
                <span className="text-[4rem] md:text-[12rem] lg:text-[17rem] font-black text-black/20 select-none whitespace-nowrap animate-pulse">
                    FASHION
                </span>
            </div>
            <div className="relative z-10 animate-float" data-aos="zoom-in" data-aos-duration="1200" data-aos-delay="300">
                                
            </div>
        </div>
      </div>
    </div>
  );
}
