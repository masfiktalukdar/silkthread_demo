import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { apiBaseUrl, getImageUrl } from "@/config/config";
import { TProduct } from "../ProductCard/types";
// Category Banner Card - Matches ProductBannerCard style
export const CategoryBannerCard: React.FC<{ product: TProduct }> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  
  // Use bannerImage if available, otherwise fallback to image, thumbnailImage, or images array
  const rawImage =
    (product as any)?.bannerImage ||
    (product as any)?.image ||
    (product as any)?.thumbnailImage ||
    (Array.isArray(product?.images) && product.images.length > 0
      ? product.images[0]
      : undefined);
  const displayImage = Array.isArray(rawImage) ? rawImage[0] : rawImage;

  return (
    <div className="w-full h-full relative group overflow-hidden">
      <Link href={`/shop?subCategory=${product.slug || product._id}`} className="block h-full relative">
        <div className="relative h-full rounded-[2px] overflow-hidden">
          {imageError ? (
            <div className="w-full h-full bg-linear-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <div className="text-center p-4">
                <ShoppingCart size={64} className="mx-auto text-orange-400 mb-3" />
                <p className="text-lg font-semibold text-gray-700">{product.name}</p>
              </div>
            </div>
          ) : (
            <Image 
              src={getImageUrl(displayImage)} 
              alt={product.name || "SubCategory"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              className="object-cover rounded-[2px] transition-transform duration-300 group-hover:scale-105"
            />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 w-full rounded-[2px]"></div>
          
          {/* Bottom Title with hover effect */}
          <div className="bottom-0 absolute w-full text-center bg-linear-to-t from-black/75 via-black/35 to-transparent group-hover:from-black/85 rounded-b-[2px] text-white z-20 duration-300 py-3 sm:py-4 px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl capitalize font-bold drop-shadow-md tracking-wide">{product.name}</h2>
          </div>
        </div>
      </Link>
    </div>
  );
};