"use client";

import "react-inner-image-zoom/lib/styles.min.css";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { getImageUrl, FALLBACK_IMAGE_URL } from "@/config/config";
import { Swiper as SwiperClass } from "swiper";
import { AnimationControls } from "framer-motion";
import InnerImageZoom from "react-inner-image-zoom";
import { motion } from "framer-motion";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

interface Props {
  thumbnailImage: string;
  backViewImage?: string;
  images?: string[];
  name?: string;
  controls: AnimationControls;
}

const ProductDetailsSlide: React.FC<Props> = ({
  controls,
  images = [],
  thumbnailImage,
  backViewImage,
  name = "Product",
}) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Helper to determine if an image is a placeholder
  const isFallbackImage = (img?: string | null): boolean => {
    if (!img || typeof img !== "string" || !img.trim() || img === "null" || img === "undefined") {
      return true;
    }
    const url = getImageUrl(img);
    return url === FALLBACK_IMAGE_URL || url.includes("placeholder");
  };

  // Collect all raw image inputs
  const rawList = [
    thumbnailImage,
    backViewImage,
    ...(Array.isArray(images) ? images : []),
  ].filter(
    (img): img is string =>
      Boolean(img && typeof img === "string" && img.trim() && img !== "null" && img !== "undefined")
  );

  // Deduplicate and filter out placeholders
  const seenUrls = new Set<string>();
  const uniqueRealImages: string[] = [];

  for (const img of rawList) {
    const url = getImageUrl(img);
    if (!isFallbackImage(img) && !seenUrls.has(url)) {
      seenUrls.add(url);
      uniqueRealImages.push(img);
    }
  }

  // If there are real images, use them. If none exist (or all are placeholders), use single fallback
  const allImages = uniqueRealImages.length > 0 ? uniqueRealImages : [FALLBACK_IMAGE_URL];

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  const currentImage = allImages[selectedImageIndex] || allImages[0];
  const isCurrentFallback = isFallbackImage(currentImage);

  return (
    <div>
      <div className="relative flex justify-center mt-1 sm:mt-2 lg:mt-0">
        {/* Main image preview */}
        <div className="w-full max-w-[360px] h-[300px] sm:max-w-[590px] md:max-w-[710px] md:h-[400px] xl:max-w-[720px] xl:h-[500px] rounded-[2px] overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
          <Swiper
            modules={[Navigation]}
            onSlideChange={(swiper) => setSelectedImageIndex(swiper.activeIndex)}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            initialSlide={selectedImageIndex}
            className="w-full h-full"
          >
            {allImages.map((img, index) => {
              const fallback = isFallbackImage(img);
              return (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-full flex items-center justify-center bg-gray-50">
                    {fallback ? (
                      <div className="relative w-full h-full flex items-center justify-center p-8 md:p-14">
                        <Image
                          src={FALLBACK_IMAGE_URL}
                          alt={name || "Product Placeholder"}
                          fill
                          className="object-contain p-8 md:p-14"
                          priority
                        />
                      </div>
                    ) : (
                      <InnerImageZoom
                        src={getImageUrl(img)}
                        zoomSrc={getImageUrl(img)}
                        zoomType="hover"
                        zoomScale={1}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Navigation Buttons (only when multiple images) */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                className="custom-prev cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all text-gray-700"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous image"
              >
                <MdArrowBackIos className="text-base ml-1" />
              </button>
              <button
                type="button"
                className="custom-next cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all text-gray-700"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next image"
              >
                <MdArrowForwardIos className="text-base" />
              </button>
            </>
          )}
        </div>

        {/* Overlay image on top for fly-to-cart animation (md and above) */}
        <div className="hidden md:block absolute top-0 w-full max-w-[590px] h-[400px] rounded-[2px] pointer-events-none">
          <motion.div animate={controls}>
            <div className="relative w-full h-[400px] bg-white rounded-[2px] overflow-hidden">
              <Image
                src={isCurrentFallback ? FALLBACK_IMAGE_URL : getImageUrl(currentImage)}
                alt={name || "Product"}
                width={500}
                height={500}
                className={`w-full h-full z-10 rounded-[2px] ${
                  isCurrentFallback ? "object-contain p-8" : "object-cover"
                }`}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Thumbnails strip - rendered ONLY when there are multiple distinct images */}
      {allImages.length > 1 && (
        <div className="overflow-x-auto scrollbar-none mt-4">
          <div className="flex gap-3 min-w-fit py-2">
            {allImages.map((img, index) => {
              const thumbFallback = isFallbackImage(img);
              return (
                <div
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`cursor-pointer border-2 rounded-[2px] overflow-hidden transition-all duration-200 ${
                    selectedImageIndex === index
                      ? "border-[#FF6C0C] ring-2 ring-orange-200"
                      : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="relative w-[60px] h-[60px] md:w-[85px] md:h-[85px] bg-gray-50 flex items-center justify-center">
                    <Image
                      src={thumbFallback ? FALLBACK_IMAGE_URL : getImageUrl(img)}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className={thumbFallback ? "object-contain p-2" : "object-cover"}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsSlide;
