"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import React, { useRef } from "react";
import { TBanner } from "@/types";

import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { apiBaseUrl, getImageUrl } from "@/config/config";
import { Swiper as SwiperClass } from "swiper";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
interface BannerProps {
  banners: TBanner[];
}

const BannerSlider: React.FC<BannerProps> = ({ banners }) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const hasMultipleBanners = (banners?.length || 0) > 1;

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-[2px] shadow-xs group">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        modules={hasMultipleBanners ? [Navigation, Autoplay] : []}
        autoplay={hasMultipleBanners ? { delay: 4000, disableOnInteraction: false } : false}
        onSwiper={(swiper) => (swiperRef.current = swiper as SwiperClass)}
        speed={1000}
        className="w-full"
      >
        {banners?.map((banner: TBanner) => (
          <SwiperSlide key={banner._id}>
            <div className="relative w-full h-[260px] sm:h-[320px] md:h-[400px] lg:h-[460px] xl:h-[500px] overflow-hidden">
              <Image
                src={getImageUrl(banner.image)}
                alt="Silk Thread Banner"
                fill
                priority={true}
                className="object-cover object-top w-full h-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1400px) 95vw, 1400px"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons - rendered ONLY when there are multiple banners to slide */}
      {hasMultipleBanners && (
        <>
          <button
            type="button"
            aria-label="Previous banner"
            className="cursor-pointer absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-gray-900 flex items-center justify-center shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 border border-white/50"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <MdArrowBackIos className="text-xl ml-1 text-gray-800" />
          </button>
          <button
            type="button"
            aria-label="Next banner"
            className="cursor-pointer absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-gray-900 flex items-center justify-center shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 border border-white/50"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <MdArrowForwardIos className="text-xl text-gray-800" />
          </button>
        </>
      )}
    </div>
  );
};

export default BannerSlider;
