"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Eye, X, Plus, Minus, Check, Zap } from "lucide-react";
import { getImageUrl, FALLBACK_IMAGE_URL } from "@/config/config";
import { getUser } from "@/services/auth";
import { addToCart } from "@/services/cart";
import { toast } from "react-toastify";
import { TProduct } from "@/types";

interface ProductProps {
  product: TProduct;
}

interface ModalProps {
  product: TProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number, inventoryRef?: string) => Promise<void>;
  isLoading: boolean;
  actionType: "cart" | "buy";
}

// Add to Cart / Buy Now Modal Component
const AddToCartModal: React.FC<ModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  actionType,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedInventory, setSelectedInventory] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedInventory("");
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const hasDiscount = product.discount > 0;
  const totalPrice = product.price * quantity;
  const totalMrp = product.mrpPrice * quantity;
  const totalSavings = (product.mrpPrice - product.price) * quantity;
  const hasInventoryOptions =
    (product.inventoryType === "colorLevelInventory" ||
      product.inventoryType === "levelInventory" ||
      product.inventoryType === "colorInventory") &&
    product.inventoryRef?.length > 0;

  const modalImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : product.thumbnailImage;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 pb-24 sm:pb-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2px] shadow-2xl animate-scale-in overflow-hidden max-w-md w-full max-h-[85vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
            {actionType === "buy" ? (
              <Zap size={22} className="text-[#FF6C0C]" />
            ) : (
              <ShoppingCart size={22} className="text-[#FF6C0C]" />
            )}
            <span>{actionType === "buy" ? "এখনি কিনুন" : "কার্টে যোগ করুন"}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Product Header */}
          <div className="flex gap-3.5 bg-gray-50 p-3.5 rounded-[2px] border border-gray-100">
            <div className="w-20 h-20 shrink-0 bg-white rounded-[2px] overflow-hidden shadow-sm border border-gray-100 relative">
              <Image
                src={getImageUrl(modalImage)}
                alt={product.name}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as any).src = FALLBACK_IMAGE_URL;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-tight">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-lg font-bold text-[#FF6C0C]">৳{product.price}</span>
                {hasDiscount && (
                  <>
                    <span className="text-xs line-through text-gray-400">৳{product.mrpPrice}</span>
                    <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold">
                      {product.discountType === "percent"
                        ? `${product.discount}% OFF`
                        : `৳${product.discountAmount} OFF`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Size / Color Selector */}
          {hasInventoryOptions && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                {product.inventoryType === "levelInventory"
                  ? "সাইজ নির্বাচন করুন"
                  : product.inventoryType === "colorInventory"
                  ? "কালার নির্বাচন করুন"
                  : "সাইজ ও কালার নির্বাচন করুন"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.inventoryRef.map((item: any) => {
                  const isOutOfStock = !item.quantity || item.quantity <= 0;
                  let displayValue = "Option";
                  if (product.inventoryType === "levelInventory") {
                    displayValue = item.level || item.size || "Size";
                  } else if (product.inventoryType === "colorInventory") {
                    displayValue = item.name || "Color";
                  } else if (product.inventoryType === "colorLevelInventory") {
                    const colorName = item.name || "Color";
                    const sizeName = item.level || item.size || "Size";
                    displayValue = `${colorName} - ${sizeName}`;
                  }

                  return (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => setSelectedInventory(item._id)}
                      className={`p-2.5 rounded-[2px] border-2 transition-all text-xs font-semibold text-center ${
                        selectedInventory === item._id
                          ? "border-[#FF6C0C] bg-orange-50 text-[#FF6C0C] shadow-xs"
                          : "border-gray-200 hover:border-[#FF6C0C] hover:bg-orange-50/50 text-gray-700"
                      }`}
                    >
                      <div className="font-bold uppercase truncate">{displayValue}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              পরিমাণ (Quantity)
            </label>
            <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-[2px] border border-gray-200">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 bg-white hover:bg-gray-100 rounded-[2px] transition-colors flex items-center justify-center border border-gray-200 text-gray-700 disabled:opacity-40 cursor-pointer"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="text-xl font-bold text-gray-800 w-10 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                className="w-8 h-8 bg-white hover:bg-gray-100 rounded-[2px] transition-colors flex items-center justify-center border border-gray-200 text-gray-700 disabled:opacity-40 cursor-pointer"
                disabled={quantity >= 99}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-[2px] p-3.5 border border-gray-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>মূল্য ({quantity} টি)</span>
              <span className="font-bold text-gray-900">৳{totalPrice}</span>
            </div>
            {hasDiscount && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>মোট সাশ্রয়</span>
                <span>- ৳{totalSavings}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-[#FF6C0C] pt-2 border-t border-gray-200">
              <span>সর্বমোট</span>
              <span>৳{totalPrice}</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => onConfirm(quantity, selectedInventory || undefined)}
            disabled={isLoading || (hasInventoryOptions && !selectedInventory)}
            className={`w-full py-3 rounded-[2px] font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              actionType === "buy"
                ? "bg-linear-to-r from-[#FF6C0C] to-[#E55A00] text-white hover:from-[#E55A00] hover:to-[#CC4F00]"
                : "bg-gray-900 text-white hover:bg-black"
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Check size={18} strokeWidth={2.5} />
                <span>
                  {actionType === "buy" ? "নিশ্চিত করুন ও এখনি কিনুন" : "নিশ্চিত করুন ও কার্টে যোগ করুন"}
                </span>
              </>
            )}
          </button>

          {hasInventoryOptions && !selectedInventory && (
            <p className="text-center text-xs text-red-500 font-semibold">
              অনুগ্রহ করে সাইজ বা কালার নির্বাচন করুন
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Product Card
const ShopProductCard: React.FC<ProductProps> = ({ product }) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"cart" | "buy">("cart");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    getUser()
      .then((user) => {
        if (user?.id) setUserId(user.id);
      })
      .catch(() => {});
  }, []);

  const hasDiscount = product.discount > 0;
  const isStockOut = false;

  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : product.thumbnailImage;

  const handleQuickAddClick = (e: React.MouseEvent, action: "cart" | "buy" = "cart") => {
    e.preventDefault();
    e.stopPropagation();
    if (!isStockOut) {
      setModalAction(action);
      setIsModalOpen(true);
    }
  };

  const handleConfirmCart = async (quantity: number, inventoryRef?: string) => {
    setIsLoading(true);
    try {
      const cartData = {
        productRef: product._id,
        quantity: quantity,
        userRef: userId,
        inventoryRef: inventoryRef || null,
      };

      await addToCart(cartData);
      setIsModalOpen(false);

      if (modalAction === "buy") {
        router.push("/checkout");
      } else {
        toast.success("পণ্যটি সফলভাবে কার্টে যুক্ত হয়েছে!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("কার্টে যোগ করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  const isFallbackImage =
    imageError ||
    !displayImage ||
    displayImage === FALLBACK_IMAGE_URL ||
    displayImage.includes("placeholder");

  return (
    <>
      <div className="bg-white rounded-[2px] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-square bg-gray-50 flex items-center justify-center">
          <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0">
            {isFallbackImage ? (
              <Image
                src={FALLBACK_IMAGE_URL}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <Image
                src={getImageUrl(displayImage)}
                alt={product.name}
                fill
                onError={() => setImageError(true)}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            )}
          </Link>

          {/* Stock Out Ribbon */}
          {isStockOut && (
            <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden pointer-events-none z-20">
              <div className="bg-[#FF6C0C] text-white font-bold text-[10px] px-8 py-1 -rotate-45 shadow-lg transform -translate-x-6 translate-y-3 text-center">
                STOCK OUT
              </div>
            </div>
          )}

          {/* Stock Out Overlay */}
          {isStockOut && (
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px] z-10 pointer-events-none" />
          )}

          {/* Discount Badge */}
          {hasDiscount && !isStockOut && (
            <div className="absolute top-2 left-2 bg-linear-to-r from-red-500 to-red-600 text-white px-2 py-0.5 rounded-[2px] text-[10px] font-bold shadow-md z-10">
              {product.discountType === "percentage" || product.discountType === "percent"
                ? `${product.discount}% OFF`
                : `৳${product.discountAmount} OFF`}
            </div>
          )}

          {/* Free Shipping Badge */}
          {product.freeShipping && !isStockOut && (
            <div className="absolute top-2 right-2 bg-linear-to-r from-green-500 to-green-600 text-white px-2 py-0.5 rounded-[2px] text-[10px] font-bold shadow-md z-10">
              Free Delivery
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-3.5 flex flex-col grow justify-between bg-white">
          <div>
            <Link href={`/product/${product.slug}`}>
              <h3 className="font-semibold text-gray-800 mb-1.5 line-clamp-2 text-xs sm:text-sm leading-snug hover:text-[#FF6C0C] transition-colors">
                {product.name}
              </h3>
            </Link>

            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-gray-900">
                ৳{product.price}
              </span>
              {hasDiscount && (
                <span className="text-xs line-through text-gray-400">
                  ৳{product.mrpPrice}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons: Stack vertically on mobile, side-by-side on sm and larger */}
          <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 w-full mt-auto pt-2">
            <button
              type="button"
              onClick={(e) => handleQuickAddClick(e, "cart")}
              disabled={isStockOut}
              className={`w-full sm:flex-1 py-2 sm:py-2 px-1 rounded-[2px] transition-all duration-300 flex items-center justify-center gap-1 font-bold text-[11px] sm:text-xs shadow-xs ${
                isStockOut
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-900 hover:shadow-md cursor-pointer active:scale-95"
              }`}
            >
              <ShoppingCart size={13} />
              <span>কার্টে রাখুন</span>
            </button>
            <button
              type="button"
              onClick={(e) => handleQuickAddClick(e, "buy")}
              className="w-full sm:flex-1 py-2 sm:py-2 px-1 rounded-[2px] transition-all duration-300 flex items-center justify-center gap-1 font-bold text-[11px] sm:text-xs shadow-xs bg-linear-to-r from-[#FF6C0C] to-[#E55A00] text-white hover:from-[#E55A00] hover:to-[#CC4F00] hover:shadow-md cursor-pointer active:scale-95"
            >
              <Zap size={13} className="shrink-0" />
              <span>এখনি কিনুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddToCartModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCart}
        isLoading={isLoading}
        actionType={modalAction}
      />
    </>
  );
};

export default ShopProductCard;
