"use client";
import React, { useState } from "react";

import Image from "next/image";
import { rajdhani } from "@/app/font";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { TProduct } from "@/types";
import { apiBaseUrl, getImageUrl } from "@/config/config";
import ProductDetailsSlide from "@/slider/ProductDetailsSlide/ProductDetailsSlide";
import { addToCart } from "@/services/cart";
import { toast } from "react-toastify";
import { getUser } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useAnimation } from "framer-motion";
import { ArrowLeft, ShoppingCart, Zap } from "lucide-react";
interface Props {
  product: TProduct;
}

const ProductDetails: React.FC<Props> = ({ product }) => {
  const [count, setCount] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const [levelError, setLevelError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const router = useRouter();
  const controls = useAnimation();
  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const {
    name,
    thumbnailImage,
    backViewImage,
    description,
    mrpPrice,
    price,
    inventoryRef,
    inventoryType,
    images,
    _id,
  } = product;

  // const userId = "67f4c99c11813048a36a2496";

  const handleAddToCart = async (actionType: 'cart' | 'buy' = 'cart') => {
    const user = await getUser();
    // if not logged in then redirect to login page
    if (!user) {
      toast.error("Please login to add product to cart.");
      router.push("/login");
      return;
    }
    if (
      (inventoryType === "levelInventory" ||
        inventoryType === "colorLevelInventory") &&
      !selectedLevel
    ) {
      setLevelError(true);
      return;
    }

    if (
      (inventoryType === "colorLevelInventory" ||
        inventoryType === "colorInventory") &&
      !selectedColor
    ) {
      setColorError(true);
      return;
    }
    try {
      controls.set({ x: 0, y: 0, scale: 1 });
      const product: {
        quantity: number;
        productRef: string;
        userRef: string | undefined;
        inventoryRef?: string | null;
      } = {
        quantity: count,
        productRef: _id,
        userRef: user?.id,
      };

      if (inventoryType == "inventory") {
        product.inventoryRef = inventoryRef[0]._id;
      } else if (inventoryType == "levelInventory") {
        product.inventoryRef = selectedLevel;
      } else if (inventoryType == "colorInventory") {
        product.inventoryRef = selectedColor;
      } else if (inventoryType == "colorLevelInventory") {
        product.inventoryRef = selectedColor;
      }

      await addToCart(product);
      
      if (actionType === 'buy') {
        router.push('/checkout');
      } else {
        toast.success("Product added to cart!");
      }
      setLevelError(false);
      setColorError(false);
      controls.start({
        scale: 0.01,
        x: 1200,
        y: -200,
        transition: { duration: 0.6, ease: "easeInOut" },
      });

      setTimeout(() => {
        controls.set({ x: 10, scale: 0 });
      }, 1000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("Failed to add product to cart.");
    }
  };
  

  const handleBack = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        router.push("/shop");
      }
    }
  };

  return (
    <div className="Container pt-4 sm:pt-5 md:pt-6 pb-16">
      {/* Top Left Back Button */}
      <div className="mb-3 sm:mb-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-[2px] bg-gray-100 hover:bg-orange-50 text-gray-700 hover:text-[#FF6C0C] border border-gray-200 hover:border-orange-200 transition-all text-xs sm:text-sm font-semibold cursor-pointer active:scale-95 shadow-2xs group relative z-20 select-none touch-manipulation"
          aria-label="Go back to previous page"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
          <span>পেছনে যান (Back)</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-start">
        <ProductDetailsSlide
          controls={controls}
          thumbnailImage={thumbnailImage}
          backViewImage={backViewImage}
          images={images}
          name={name}
        />

        <div className="">
          <h2 className={`text-2xl lg:text-3xl font-bold text-gray-700 ${rajdhani.className}`}>
            {name}
          </h2>

          <div className="flex gap-2 mt-2 text-gray-700">
            {Number(price) !== Number(mrpPrice) ? (
              <>
                <p className="line-through text-[#262626]/60 font-semibold flex items-center gap-1">
                  <span>৳</span> <span>{Number(mrpPrice).toFixed(2)}</span>
                </p>
                <p className="flex items-center gap-1 font-semibold text-xl lg:text-2xl text-gray-700">
                  <span>৳</span> <span>{Number(price).toFixed(2)}</span>
                </p>
              </>
            ) : (
              <p className="flex items-center gap-1 font-semibold text-xl lg:text-2xl text-gray-700">
                <span>৳</span> <span>{Number(price).toFixed(2)}</span>
              </p>
            )}
          </div>


          <div className="mt-3">
            {(inventoryType === "levelInventory" ||
              inventoryType === "colorLevelInventory") && (
                <div className="flex flex-col">
                  <h3 className={`text-base md:text-lg font-semibold ${rajdhani.className}`}>
                    Select Size:
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#262626]/60 mt-1 cursor-pointer">
                    {inventoryRef
                      ?.filter(
                        (value, index, item) =>
                          index === item.findIndex((t) => t.level === value.level)
                      )
                      .map((size) => (
                        <p
                          key={size._id}
                          onClick={() => {
                            setLevel(size.level);
                            setSelectedLevel(size._id);
                            setSelectedColor(null);
                            setLevelError(false);
                          }}
                          className={`w-[40px] h-[30px] border border-[#FF6C0C] hover:text-[#FF6C0C] duration-300 cursor-pointer rounded-[2px] text-center flex items-center justify-center uppercase ${level === size.level ? "bg-primary text-white" : "border-primary"
                            }`}
                        >
                          {size.level}
                        </p>
                      ))}
                  </div>
                  {levelError && (
                    <p className="text-red-500 text-sm mt-1">
                      Please select a size.
                    </p>
                  )}
                </div>
              )}
          </div>

          <div className="mt-3">
            {(inventoryType === "colorLevelInventory" && selectedLevel) ||
              inventoryType === "colorInventory" ? (
              <div className="flex flex-col">
                <h3
                  className={`text-base md:text-lg font-semibold text-[#262626] ${rajdhani.className}`}
                >
                  Select Color:
                </h3>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#262626]/60 mt-1">
                  {inventoryRef
                    ?.filter((item) =>
                      inventoryType === "colorLevelInventory"
                        ? item.level === level
                        : true
                    )
                    .filter(
                      (value, index, arr) =>
                        index === arr.findIndex((t) => t.color === value.color)
                    )
                    .map((colorItem) => (
                      <div
                        key={colorItem._id}
                        onClick={() => {
                          setSelectedColor(colorItem._id);
                          setColorError(false);
                        }}
                        className={`border ${selectedColor === colorItem._id
                          ? "border-[#1F4193] border-2 w-[20px] h-[20px]"
                          : "border-[#262626] w-[25px] h-[25px]"
                          } rounded-full cursor-pointer`}
                        style={{ backgroundColor: colorItem.color }}
                      />
                    ))}
                </div>
                {colorError && (
                  <p className="text-red-500 text-sm mt-1">
                    Please select color.
                  </p>
                )}
              </div>
            ) : null}
          </div>

          <div className="border-b-2 pb-4 border-[#FF6C0C]">
            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between border-2 border-orange-200/80 bg-orange-50/40 rounded-[2px] px-3.5 py-2 sm:w-[130px] shrink-0">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="p-1 hover:bg-white rounded-[2px] transition-colors text-gray-700 hover:text-[#FF6C0C] cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={15} />
                </button>
                <span className="font-bold text-gray-900 text-sm sm:text-base px-2">{count}</span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="p-1 hover:bg-white rounded-[2px] transition-colors text-gray-700 hover:text-[#FF6C0C] cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={15} />
                </button>
              </div>

              {/* Action Buttons: Add to Cart and Buy Now with Icons */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 flex-1 w-full">
                <button
                  type="button"
                  onClick={() => handleAddToCart('cart')}
                  className="w-full bg-gray-800 hover:bg-gray-900 transition-all flex justify-center items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 font-bold text-xs sm:text-sm rounded-[2px] text-white cursor-pointer hover:shadow-md active:scale-95 whitespace-nowrap min-w-0"
                >
                  <ShoppingCart size={16} className="shrink-0" />
                  <span className="truncate">কার্টে রাখুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddToCart('buy')}
                  className="w-full bg-linear-to-r from-[#FF6C0C] to-[#E55A00] hover:from-[#E55A00] hover:to-[#CC4F00] transition-all flex justify-center items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 font-bold text-xs sm:text-sm rounded-[2px] text-white cursor-pointer hover:shadow-md active:scale-95 whitespace-nowrap min-w-0 shadow-sm"
                >
                  <Zap size={16} className="shrink-0" />
                  <span className="truncate">এখনি কিনুন</span>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
