import { Clock, Dot, Gift, Star, Tag, Truck, Zap } from "lucide-react";
import React from "react";

export default function Order() {
  const offers = [
    {
      id: 1,
      icon: <Gift className="w-4 h-4" />,
      text: "Free Gift on orders over 100$",
    },
    {
      id: 2,
      icon: <Tag className="w-4 h-4" />,
      text: "Up to 50% OFF on Summer Collection",
    },
    {
      id: 3,
      icon: <Truck className="w-4 h-4" />,
      text: "Free Shipping Worldwide",
    },
    {
      id: 4,
      icon: <Clock className="w-4 h-4" />,
      text: "Flash Sale: 24 Hours Only",
    },
    {
      id: 5,
      icon: <Star className="w-4 h-4" />,
      text: "Buy 2 Get 1 Free On Selected Items",
    },
    {
      id: 6,
      icon: <Zap className="w-4 h-4" />,
      text: "Extra 10% OFF for New Membres",
    },
  ];

  const duplicatedOffres = [...offers, ...offers, ...offers];

  return (
    <div
      className="bg-white py-3 overflow-hidden border-y border-gray-200"
      data-aos="fade-up"
    >
      <div className="relative">
        <div className="flex items-center gap-8 whitespace-nowrap animate-scroll">
          {duplicatedOffres.map((offer, idx) => (
            <div
              key={`${offer.id}-${idx}`}
              className="flex items-center gap-2 px-4 py-1.5"
            >
              <div className="text-gray-600">{offer.icon}</div>
              <p className="text-gray-700 font-medium text-sm">{offer.text}</p>
              <span className="text-gray-400 text-xs mx-2">
                <Dot className="w-10 h-10" />
              </span>
              <a href="#" className="text-gray-900 text-sm font-semibold">
                Show Now
              </a>
            </div>
          ))}
        </div>
      </div>
      <style jsx>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll {
            animation: scroll 25s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>
    </div>
  );
}
