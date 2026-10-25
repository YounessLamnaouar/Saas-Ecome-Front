import React from "react";
import { Link } from "react-router-dom";
import { Clock, Dot, Gift, Star, Tag, Truck, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Order() {
  const { t } = useTranslation();

  const offers = [
    {
      id: 1,
      icon: <Truck className="w-4 h-4" />,
      text: t("marquee.freeDelivery"),
    },
    {
      id: 2,
      icon: <Tag className="w-4 h-4" />,
      text: t("marquee.cod"),
    },
    {
      id: 3,
      icon: <Star className="w-4 h-4" />,
      text: t("marquee.authentic"),
    },
    {
      id: 4,
      icon: <Zap className="w-4 h-4" />,
      text: t("marquee.fastShipping"),
    },
  ];

  const duplicatedOffers = [...offers, ...offers, ...offers, ...offers];

  return (
    <div
      className="bg-white py-3 overflow-hidden border-y border-gray-200"
      data-aos="fade-up"
    >
      <div className="relative" dir="ltr">
        <div className="flex items-center gap-8 whitespace-nowrap animate-scroll">
          {duplicatedOffers.map((offer, idx) => (
            <div
              key={`${offer.id}-${idx}`}
              className="flex items-center gap-2 px-4 py-1.5"
            >
              <div className="text-gray-600">{offer.icon}</div>
              <p className="text-gray-700 font-medium text-sm" dir="auto">{offer.text}</p>
              <span className="text-gray-400 text-xs mx-2">
                <Dot className="w-10 h-10" />
              </span>
              <Link to="/shop" className="text-gray-900 text-sm font-semibold hover:underline">
                {t("hero.shopNow")}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <style>{`
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
      `}</style>
    </div>
  );
}
