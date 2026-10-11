"use client";

import React, { useEffect, useState } from "react";
import { apiBaseUrl } from "@/config/config";
import { Truck, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const OfferAnnouncementBar = () => {
  const [offerActive, setOfferActive] = useState(false);

  useEffect(() => {
    fetch(`${apiBaseUrl}/shippingMethod`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          const offer = data.data.find(
            (m: any) => m.shippingMethod === "FREE_SHIPPING_ON_3_ITEMS"
          );
          if (offer && Boolean(offer.status)) {
            setOfferActive(true);
          } else {
            setOfferActive(false);
          }
        }
      })
      .catch(() => setOfferActive(false));
  }, []);

  if (!offerActive) return null;

  return (
    <div className="w-full bg-[#FF6C0C] text-white py-1.5 sm:py-2 px-3 sm:px-6 relative z-50 shadow-xs overflow-hidden">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-2 text-xs sm:text-sm font-medium">
        {/* Left side / Center content */}
        <Link
          href="/shop"
          className="flex items-center gap-2 sm:gap-3 mx-auto flex-wrap justify-center text-center group"
        >
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-white/20 backdrop-blur-xs text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white shrink-0">
            <Sparkles size={12} className="text-yellow-200 animate-pulse" />
            Special Offer
          </span>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Truck size={16} className="text-white shrink-0 hidden sm:inline" />
            <span className="font-semibold text-xs sm:text-sm">
              ৩টি বা তার বেশি পণ্য অর্ডারে ফ্রি ডেলিভারি (ঢাকা ও সারা দেশে)!
            </span>
            <span className="hidden md:inline text-white/80">|</span>
            <span className="hidden md:inline font-normal text-orange-100 text-xs sm:text-sm">
              Free Delivery on 3+ Items (Inside &amp; Outside Dhaka)
            </span>
          </div>
        </Link>

        {/* Right side CTA link */}
        <Link
          href="/shop"
          className="hidden lg:flex items-center gap-1 shrink-0 text-xs font-bold bg-white text-[#FF6C0C] px-2.5 py-1 rounded-[2px] hover:bg-orange-50 transition-colors shadow-xs"
        >
          <span>অর্ডার করুন</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};

export default OfferAnnouncementBar;
