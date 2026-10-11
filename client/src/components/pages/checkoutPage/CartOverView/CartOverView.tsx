"use client";

import { getImageUrl } from "@/config/config";
import { TProduct } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Key, useState } from "react";

interface Props {
  products: any;
  shipping: number;
}

const CartOverView: React.FC<Props> = ({ products, shipping }) => {
  const [showCartOverview, setShowCartOverview] = useState(false);

  const cartDetails = products?.cartDetails || [];

  const totalQuantity = cartDetails.reduce(
    (sum: number, item: any) => sum + (Number(item.quantity) || 1),
    0
  );

  // Subtotal is price before discount (sum of mrpPrice * quantity, fallback to price)
  const subtotal = cartDetails.reduce((sum: number, item: any) => {
    const origPrice =
      Number(item.product?.mrpPrice) > 0
        ? Number(item.product?.mrpPrice)
        : Number(item.product?.price || 0);
    return sum + origPrice * (Number(item.quantity) || 1);
  }, 0);

  // Product-level discount (difference between mrp and price)
  const productDiscounts = cartDetails.reduce((sum: number, item: any) => {
    const origPrice =
      Number(item.product?.mrpPrice) > 0
        ? Number(item.product?.mrpPrice)
        : Number(item.product?.price || 0);
    const salePrice = Number(item.product?.price || origPrice);
    const itemDiscount = Math.max(0, origPrice - salePrice);
    return sum + itemDiscount * (Number(item.quantity) || 1);
  }, 0);

  // Coupon discount
  const couponDiscount = Number(products?.couponDiscount) || 0;

  // Discount is all the sum of given discount
  const totalDiscount = productDiscounts + couponDiscount;

  // Grand total is subtotal + shipping - discount
  const grandTotal = Math.max(0, subtotal + (shipping || 0) - totalDiscount);

  return (
    <div className="top-20 sticky">
      <div
        onClick={() => setShowCartOverview((prev) => !prev)}
        className="top-0 left-0 absolute lg:hidden bg-[#1D4092] w-full py-2.5 rounded-[2px] cursor-pointer shadow-md z-10"
      >
        <h2 className="text-center text-white text-sm font-semibold flex items-center justify-center gap-2">
          <span>Cart Overview (অর্ডার সংক্ষেপ)</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
            ৳{grandTotal}
          </span>
        </h2>
      </div>

      <AnimatePresence>
        {(showCartOverview ||
          (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
          <motion.div
            key="cart-overview"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 50 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`bg-white border border-gray-200 px-6 sm:px-8 py-6 rounded-[2px] shadow-sm ${
              showCartOverview ? "block" : "hidden"
            } lg:block lg:mt-8`}
          >
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="text-lg sm:text-xl font-bold text-gray-800">
                Cart Overview
              </div>
              <Link href="/cart">
                <span className="text-sm font-semibold text-[#FF6C0C] hover:underline">
                  Modify Order
                </span>
              </Link>
            </div>

            <div className="divide-y divide-gray-100 max-h-[320px] overflow-y-auto pr-1">
              {cartDetails.map(
                (item: {
                  _id?: Key | null;
                  cartId?: Key | null;
                  quantity: number | string;
                  product: TProduct;
                  inventory?: any;
                }) => (
                  <div
                    className="py-3 flex items-center gap-3"
                    key={item.cartId || item._id}
                  >
                    <div className="w-14 h-14 relative shrink-0 bg-gray-50 rounded-[2px] overflow-hidden border border-gray-100">
                      {item?.product?.thumbnailImage ? (
                        <Image
                          fill
                          src={getImageUrl(item.product.thumbnailImage)}
                          alt={item.product.name || "Product"}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                          Silk
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1">
                        {item.product?.name}
                      </p>
                      {item.inventory?.name && item.inventory.name !== "Unknown" && (
                        <p className="text-[11px] text-gray-500">
                          {item.inventory.name}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.quantity} × ৳{item.product?.price} = ৳{(Number(item.product?.price) || 0) * (Number(item.quantity) || 1)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-gray-900">
                        ৳{(Number(item.product?.price) || 0) * (Number(item.quantity) || 1)}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2.5 text-sm">
              <div className="flex justify-between font-medium text-gray-600">
                <p>Subtotal ({totalQuantity} {totalQuantity === 1 ? "item" : "items"} / মূল মূল্য):</p>
                <p className="text-gray-900 font-semibold">৳{subtotal}</p>
              </div>

              <div className="flex justify-between font-medium text-gray-600">
                <p>Shipping (শিপিং খরচ):</p>
                <p className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-gray-900"}`}>
                  {shipping === 0 ? "Free (৳0)" : `৳${shipping}`}
                </p>
              </div>

              <div className="flex justify-between font-medium text-gray-600">
                <p>Discount (মোট ডিসকাউন্ট):</p>
                <p className="text-green-600 font-semibold">-৳{totalDiscount}</p>
              </div>

              <div className="flex justify-between items-center font-bold text-base sm:text-lg pt-3 border-t-2 border-gray-200 text-gray-900">
                <p>Grand Total (সর্বমোট):</p>
                <p className="text-[#FF6C0C] text-xl font-extrabold">
                  ৳{grandTotal}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartOverView;
