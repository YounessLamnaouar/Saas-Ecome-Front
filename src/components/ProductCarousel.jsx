import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "motion/react";

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

function ProductSlide({ product, index, itemWidth, itemHeight, trackItemOffset, x, transition, wasDragged }) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const rotateY = useTransform(x, range, [90, 0, -90], { clamp: false });
  const outOfStock = typeof product.stock === "number" && product.stock <= 0;

  return (
    <motion.div
      className="relative shrink-0 rounded-2xl overflow-hidden shadow-xl cursor-grab active:cursor-grabbing bg-gray-200"
      style={{ width: itemWidth, height: itemHeight, rotateY }}
      transition={transition}
    >
      <Link
        to={`/product/${product.id}`}
        draggable={false}
        onClick={(e) => wasDragged.current && e.preventDefault()}
        className="group absolute inset-0 block"
      >
        <img
          src={product.image}
          alt={product.name}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
        />

        {/* dark gradient so the text stays readable on any image */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent" />

        {outOfStock && (
          <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-md">
            Out of Stock
          </span>
        )}

        <div className="absolute left-6 bottom-6 right-24 text-white">
          <p className="text-xs md:text-sm uppercase tracking-widest text-white/80">
            {product.categoryName}
          </p>
          <h3 className="text-2xl md:text-4xl font-black leading-tight line-clamp-2">{product.name}</h3>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-xl md:text-3xl font-bold">${Number(product.price).toFixed(2)}</span>
            {product.oldPrice && (
              <span className="text-sm md:text-lg text-white/60 line-through">
                ${Number(product.oldPrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProductCarousel({
  items = [],
  baseWidth = 800,
  itemHeight = 500,
  autoplay = true,
  autoplayDelay = 3500,
  pauseOnHover = true,
  loop = true,
}) {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState(loop ? 1 : 0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const wasDragged = useRef(false);

  // autoplay
  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return;
    if (pauseOnHover && isHovered) return;
    const timer = setInterval(() => {
      setPosition((prev) => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);
    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  // reset when items / width change
  useEffect(() => {
    const start = loop ? 1 : 0;
    setPosition(start);
    x.set(-start * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) return setIsAnimating(false);
    const lastClone = itemsForRender.length - 1;
    const jumpTo = position === lastClone ? 1 : position === 0 ? items.length : null;
    if (jumpTo === null) return setIsAnimating(false);

    setIsJumping(true);
    setPosition(jumpTo);
    x.set(-jumpTo * trackItemOffset);
    requestAnimationFrame(() => {
      setIsJumping(false);
      setIsAnimating(false);
    });
  };

  const handleDragEnd = (_, { offset, velocity }) => {
    setTimeout(() => (wasDragged.current = false), 0);
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD ? 1
      : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD ? -1
      : 0;
    if (direction === 0) return;
    setPosition((prev) => Math.max(0, Math.min(prev + direction, itemsForRender.length - 1)));
  };

  const dragProps = loop
    ? {}
    : { dragConstraints: { left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0), right: 0 } };

  const activeIndex =
    items.length === 0 ? 0 : loop ? (position - 1 + items.length) % items.length : Math.min(position, items.length - 1);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden p-4 rounded-[28px] bg-black/20 backdrop-blur-sm border border-white/20"
      style={{ width: baseWidth }}
    >
      <motion.div
        className="flex"
        drag={isAnimating ? false : "x"}
        {...dragProps}
        style={{
          width: itemWidth,
          gap: GAP,
          perspective: 1000,
          perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
          x,
        }}
        onDragStart={() => (wasDragged.current = true)}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={() => setIsAnimating(true)}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((product, index) => (
          <ProductSlide
            key={`${product.id}-${index}`}
            product={product}
            index={index}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
            wasDragged={wasDragged}
          />
        ))}
      </motion.div>

      {/* dots overlay the bottom-right of the slide */}
      <div className="absolute right-8 bottom-8 flex items-center gap-2 z-10">
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setPosition(loop ? index + 1 : index)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              activeIndex === index ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
