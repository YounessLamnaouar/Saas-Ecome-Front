import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import LikeButton from './LikeButton'
import { Skeleton } from '@/components/ui/skeleton'
import { useProducts } from '@/hooks/useProducts'

export default function Products() {
    const [currentIndex, setCurrentIndex] = useState(1)
    const { addToCart } = useCart()
    const { data, isLoading } = useProducts({ page: currentIndex, perPage: 6, sortBy: 'rating', sortDir: 'desc' })

    const currentProducts = data?.products || []
    const totalSlides = data?.meta?.total_pages || 1

    const nextSlide = () => setCurrentIndex((prev) => (prev % totalSlides) + 1)
    const prevSlide = () => setCurrentIndex((prev) => ((prev - 2 + totalSlides) % totalSlides) + 1)

  return (
    <div className="py-20 bg-white" data-aos="fade-up">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <div className="flex items-center justify-between mb-12" data-aos="fade-down">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Trending Products
                </h2>
                <div className="flex items-center gap-4">
                    <button onClick={prevSlide} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextSlide} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {isLoading &&
                      Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}

                    {!isLoading && currentProducts.map((product, idx) => (
                        <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100" data-aos="zoom-in" data-aos-delay={idx * 100}>
                            <Link to={`/product/${product.id}`} className="relative h-56 bg-gray-100 overflow-hidden block">
                                <img src={product.image} alt={product.name} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                                <LikeButton product={product} className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 cursor-pointer hover:scale-110 transition-transform" />
                            </Link>
                            <div className="p-3">
                                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm text-gray-900 font-bold">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    {product.oldPrice && (
                                        <span className="text-gray-400 line-through text-xs">
                                            ${product.oldPrice.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 capitalize">{product.categoryName}</span>
                                    <button onClick={() => addToCart(product, 1)} className="p-1.5 border rounded-lg hover:bg-gray-100 transition-all">
                                        <ShoppingCart size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}
