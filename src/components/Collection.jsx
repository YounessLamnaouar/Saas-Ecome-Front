import React from "react";
import set from "../assets/set.png";
import dress from "../assets/dress.png";
import women_Handbags from "../assets/Women_Handbags.png";
import hat from "../assets/hat.png";
import red_shoes from "../assets/red_shoes.png";

export default function Collection() {
  const categories = [
    {
      id: 1,
      name: "Accessories",
      count: "248",
      color: "bg-green-100",
      textColor: "text-green-950",
      image: set,
    },
    {
      id: 2,
      name: "Dress",
      count: "362",
      color: "bg-blue-100",
      textColor: "text-blue-950",
      image: dress,
    },
    {
      id: 3,
      name: "Women Handbags",
      count: "448",
      color: "bg-pink-100",
      textColor: "text-pink-950",
      image: women_Handbags,
    },
    {
      id: 4,
      name: "Hat",
      count: "1148",
      color: "bg-gray-100",
      textColor: "text-gray-950",
      image: hat,
    },
    {
      id: 5,
      name: "Shoes",
      count: "165",
      color: "bg-red-100",
      textColor: "text-red-950",
      image: red_shoes,
    },
  ];
  const CategoryCard = ({ cat, index, aosDelay }) => (
    <div
      data-aos="fade-right"
      data-aos-delay={aosDelay}
      className={`${cat.color} ${cat.textColor} rounded-2xl p-6 shadow-md hover:shadow-xl transition relative flex flex-col justify-between group hover:scale-105 transform duration-300 cursor-pointer`}
    >
      <div className="z-10 relative">
        <h3 className="text-xl font bold mt-1"> {cat.name} </h3>
        <p className="text-3xl font-bold mt-2"> {cat.count} </p>
        <p className="text-sm opacity-80 font-bold"> Products </p>
      </div>
      <img
        src={cat.image}
        alt={cat.name}
        className="absolute -right-0.5 -bottom-6.25 w-50 h-50 object-contain opacity-90 transition-transform duration-300 group-hover:scale-110"
      />
    </div>
  );

    const BigCategoryCard = ({ cat }) => (
    <div
      data-aos="zoom-in"
      data-aos-delay="400"
      className={`${cat.color} ${cat.textColor} rounded-3xl p-10 h-full shadow-lg hover:shadow-2xl overflow-hidden transition relative flex flex-col items-start justify-between group hover:scale-105 transform duration-300 cursor-pointer`}
    >
        <h3 className="text-3xl md:text-4xl font bold"> {cat.name} </h3>
        <p className="text-4xl md:text-5xl font-bold mt-2"> {cat.count} </p>
        <p className="text-sm opacity-80 font-bold"> Products </p>
      <img
        src={cat.image}
        alt={cat.name}
        className="absolute -right-8 bottom-0 md:w-80 md:h-80 w-50 h-50 object-contain opacity-90 transition-transform duration-300 group-hover:scale-110"
      />
    </div>
  );


  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-10">
                Shop by <span className="text-gray-600">Collection</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 auto-rows-auto">
                <div className="flex flex-col gap-6">
                    {categories.slice(0, 2).map((cat, i) => (
                        <CategoryCard key={cat.id} cat={cat} index={i} aosDelay={i * 200} />
                    ))}
                </div>
                
                <div className="flex flex-col">
                    <BigCategoryCard cat={categories[2]} />
                </div>

                <div className="flex flex-col gap-6">
                    {categories.slice(3, 5).map((cat, i) => (
                        <CategoryCard key={cat.id} cat={cat} index={i} aosDelay={i * 200} />
                    ))}
                </div>

            </div>
        </div>
    </section>
  )
}
