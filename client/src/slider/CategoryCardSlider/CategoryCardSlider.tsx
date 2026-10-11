"use client";

import { TCategory } from "@/types";
import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import { apiBaseUrl, getImageUrl } from "@/config/config";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryProps {
  categoriesList: TCategory[];
}

const CategoryCardSlider: React.FC<CategoryProps> = ({ categoriesList }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  const sortedCategories = [...(categoriesList || [])].sort(
    (a, b) => Number(b.status) - Number(a.status)
  );

  // Display actual categories only
  const displayCategories = [...sortedCategories];

  // Check if content overflows and can scroll
  useEffect(() => {
    const checkCanScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScroll(scrollWidth > clientWidth + 10);
      }
    };

    checkCanScroll();
    // Re-check after images/fonts settle
    const timer = setTimeout(checkCanScroll, 500);
    window.addEventListener("resize", checkCanScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkCanScroll);
    };
  }, [displayCategories]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Track scroll position for indicators
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !canScroll) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.scrollWidth / (displayCategories.length || 1);
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [displayCategories.length, canScroll]);

  // Auto sliding with reverse - only when content actually overflows
  useEffect(() => {
    if (!canScroll) return;
    let direction: "left" | "right" = "right";
    
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (direction === "right" && container.scrollLeft >= maxScroll - 10) {
          direction = "left";
        } else if (direction === "left" && container.scrollLeft <= 10) {
          direction = "right";
        }
        
        scroll(direction);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [canScroll]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-bold mt-1 mb-3 ">
            Explore our wide range of products
          </p>
        </div>
        {/* Navigation buttons - shown ONLY if content overflows */}
        {canScroll && (
          <div className="hidden md:flex gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-white border-2 border-gray-200 hover:border-[#FF6C0C] hover:bg-[#FF6C0C] hover:text-white transition-all duration-300 shadow-md cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-white border-2 border-gray-200 hover:border-[#FF6C0C] hover:bg-[#FF6C0C] hover:text-white transition-all duration-300 shadow-md cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className={`flex gap-2 sm:gap-3 lg:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory ${
            displayCategories.length <= 5 ? "md:justify-center justify-start" : "justify-start"
          }`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayCategories?.map((category, index) => {
            const isUpcoming = 'isUpcoming' in category && category.isUpcoming;
            
            return (
              <Link
                key={category._id}
                href={isUpcoming ? "#" : `/shop?category=${category.slug || category._id}`}
                className="flex-shrink-0 snap-start"
                onClick={(e) => isUpcoming && e.preventDefault()}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: isUpcoming ? 1 : 1.03 }}
                  className={`group relative w-32 h-40 sm:w-40 sm:h-52 md:w-48 md:h-64 lg:w-60 lg:h-80 bg-white border-2 ${
                    isUpcoming 
                      ? "border-dashed border-gray-300 bg-gray-50" 
                      : "border-gray-200 hover:border-[#FF6C0C] hover:shadow-2xl"
                  } rounded-[2px] overflow-hidden transition-all duration-300 ${
                    isUpcoming ? "cursor-default" : "cursor-pointer"
                  } flex flex-col`}
                >
                  {isUpcoming ? (
                    <div className="relative w-full flex-1 flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                      <div className="text-center p-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-2 sm:mb-3 rounded-full bg-white/80 flex items-center justify-center">
                          <span className="text-2xl sm:text-3xl lg:text-4xl">🎁</span>
                        </div>
                        <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-400">
                          Coming Soon
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full flex-1">
                      <Image
                        src={getImageUrl(category.image)}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 240px"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-1.5 sm:p-2 lg:p-3 text-center bg-white">
                    <p className={`text-xs sm:text-sm lg:text-base font-semibold ${
                      isUpcoming 
                        ? "text-gray-400" 
                        : "text-gray-700 group-hover:text-[#FF6C0C]"
                    } transition-colors duration-300 capitalize line-clamp-2`}>
                      {isUpcoming ? "Upcoming" : category.name}
                    </p>
                  </div>

                  {!isUpcoming && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6C0C]" />
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Gradient overlays removed to match off-white background */}
      </div>

      {/* Mobile scroll indicators - rendered ONLY when content can scroll */}
      {canScroll && (
        <div className="flex md:hidden justify-center gap-1.5 mt-3">
          {displayCategories?.slice(0, Math.min(5, displayCategories.length)).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex % 5
                  ? "bg-[#FF6C0C] w-6"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryCardSlider;