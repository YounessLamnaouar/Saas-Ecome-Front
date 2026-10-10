// import React from "react";
// import Navbar from "./Navbar";

// export default function Hero() {
//   return (
//     <div className="min-h-screen transition-colors duration-1000 overflow-hidden bg-amber-600">
//       <div className="container mx-auto px-4 md:px-8 lg:px-16 h-[calc(90vh-80px)] flex items-center justify-center">
//         <div className="relative group w-full flex justify-center items-center">
//             <div className="absolute inset-0 pointer-events-none flex justify-center items-center" data-aos="fade-up" data-aos-duration="1500">
//                 <span className="text-[4rem] md:text-[12rem] lg:text-[17rem] font-black text-black/20 select-none whitespace-nowrap animate-pulse">
//                     FASHION
//                 </span>
//             </div>
//             <div className="relative z-10 animate-float" data-aos="zoom-in" data-aos-duration="1200" data-aos-delay="300">
                                
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import ProductCarousel from "./ProductCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";

// Carousel takes ~80% of the screen width and ~75% of the screen height
const WIDTH_RATIO = 0.8;
const HEIGHT_RATIO = 0.75;
const PADDING = 32; // 16px padding on each side of the carousel frame

function useCarouselSize() {
  const get = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const width = w < 640 ? w - 32 : Math.min(w * WIDTH_RATIO, 1500);
    const height = Math.max(h * HEIGHT_RATIO - PADDING, 320);
    return { width: Math.round(width), height: Math.round(height) };
  };
  const [size, setSize] = useState(get);
  useEffect(() => {
    const onResize = () => setSize(get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

export default function Hero() {
  const { data, isLoading } = useProducts({ perPage: 8, sortBy: "rating", sortDir: "desc" });
  const products = data?.products || [];
  const { width, height } = useCarouselSize();

  return (
    <div className="min-h-screen transition-colors duration-1000 overflow-hidden bg-amber-600">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 h-[calc(90vh-80px)] flex items-center justify-center">
        <div className="relative group w-full flex justify-center items-center">
          {/* big background text (now mostly hidden behind the carousel) */}
          <div
            className="absolute inset-0 pointer-events-none flex justify-center items-center"
            data-aos="fade-up"
            data-aos-duration="1500"
          >
            <span className="text-[4rem] md:text-[12rem] lg:text-[17rem] font-black text-black/20 select-none whitespace-nowrap animate-pulse">
              FASHION
            </span>
          </div>

          <div className="relative z-10" data-aos="zoom-in" data-aos-duration="1200" data-aos-delay="300">
            {isLoading || products.length === 0 ? (
              <Skeleton
                className="rounded-[28px] bg-white/20"
                style={{ width, height: height + 32 }}
              />
            ) : (
              <ProductCarousel
                items={products}
                baseWidth={width}
                itemHeight={height}
                autoplay
                autoplayDelay={3500}
                pauseOnHover
                loop
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}