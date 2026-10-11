"use client";

import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Eye, Check, Zap } from 'lucide-react';
import Image from 'next/image';
import { apiBaseUrl, getImageUrl, FALLBACK_IMAGE_URL } from '@/config/config';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface TProduct {
  _id: string;
  name: string;
  slug: string;
  thumbnailImage: string;
  backViewImage?: string;
  images: string[];
  price: number;
  mrpPrice: number;
  discount: number;
  discountType: string;
  discountAmount: number;
  description: string;
  inventoryType: string;
  inventoryRef: any[];
  mainInventory: number;
  productId: string;
  sizeChartImage?: string;
  videoUrl?: string;
  subCategoryRef?: any;
  freeShipping: boolean;
}

interface HomeProductSectionProps {
  products: {
    category: TProduct;
    result: TProduct[];
  };
  userRef?: string;
  onAddToCart: (data: any) => Promise<any>;
}

// Product Card Component
const ProductCard: React.FC<{ 
  product: TProduct; 
  onQuickAdd: (product: TProduct, action?: 'cart' | 'buy') => void; 
  onViewDetails: (product: TProduct) => void;
}> = ({ product, onQuickAdd, onViewDetails }) => {
  const [imageError, setImageError] = useState(false);
  const hasDiscount = product.discount > 0;
  const isStockOut = false;
  
  // Get the first image from the images array, fallback to thumbnailImage
  const displayImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : product.thumbnailImage;
  
  const handleImageError = () => {
    setImageError(true);
  };

  const handleQuickAddClick = (e: React.MouseEvent, action: 'cart' | 'buy' = 'cart') => {
    e.preventDefault();
    e.stopPropagation();
    if (!isStockOut) {
      onQuickAdd(product, action);
    }
  };

  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onViewDetails(product);
  };

  const isFallbackImage =
    imageError ||
    !displayImage ||
    displayImage === FALLBACK_IMAGE_URL ||
    displayImage.includes("placeholder");

  return (
    <div className="bg-white rounded-[2px] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col h-full justify-between">
      <div className="relative overflow-hidden aspect-square bg-gray-50 flex items-center justify-center">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0" />
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
            onError={handleImageError}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
        
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
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px] z-10 pointer-events-none"></div>
        )}
        
        {hasDiscount && !isStockOut && (
          <div className="absolute top-2 left-2 bg-linear-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-[2px] text-[10px] font-bold shadow-lg z-10">
            {product.discountType === 'percentage' ? `${product.discount}% OFF` : `৳${product.discountAmount} OFF`}
          </div>
        )}
        
        {product.freeShipping && !isStockOut && (
          <div className="absolute top-2 right-2 bg-linear-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-[2px] text-[10px] font-bold shadow-lg z-10">
            Free Ship
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-3.5 flex flex-col grow justify-between bg-white">
        <div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-gray-800 mb-1.5 line-clamp-2 text-xs sm:text-sm leading-snug hover:text-[#FF6C0C] transition-colors">
              {product.name}
            </h3>
          
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-gray-900">৳{product.price}</span>
              {hasDiscount && (
                <span className="text-xs line-through text-gray-400">৳{product.mrpPrice}</span>
              )}
            </div>
          </Link>
        </div>

        {/* Action Buttons: Stack vertically on mobile, side-by-side on sm and larger */}
        <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 w-full mt-auto pt-2">
          <button 
            type="button"
            onClick={(e) => handleQuickAddClick(e, 'cart')}
            disabled={isStockOut}
            className={`w-full sm:flex-1 py-2 sm:py-2 px-1 rounded-[2px] transition-all duration-300 flex items-center justify-center gap-1 font-bold text-[11px] sm:text-xs shadow-xs ${
              isStockOut ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-900 hover:shadow-md cursor-pointer active:scale-95'
            }`}
          >
            <ShoppingCart size={13} />
            <span>কার্টে রাখুন</span>
          </button>
          <button 
            type="button"
            onClick={(e) => handleQuickAddClick(e, 'buy')}
            className="w-full sm:flex-1 py-2 sm:py-2 px-1 rounded-[2px] transition-all duration-300 flex items-center justify-center gap-1 font-bold text-[11px] sm:text-xs shadow-xs bg-linear-to-r from-[#FF6C0C] to-[#E55A00] text-white hover:from-[#E55A00] hover:to-[#CC4F00] hover:shadow-md cursor-pointer active:scale-95"
          >
            <Zap size={13} className="shrink-0" />
            <span>এখনি কিনুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Category Banner Card - Matches ProductBannerCard style
const CategoryBannerCard: React.FC<{ product: TProduct }> = ({ product }) => {
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

// Modal Component
const AddToCartModal: React.FC<{ 
  product: TProduct | null; 
  isOpen: boolean; 
  onClose: () => void;
  onConfirm: (quantity: number, inventoryRef?: string) => void;
  isLoading: boolean;
  actionType?: 'cart' | 'buy';
}> = ({ product, isOpen, onClose, onConfirm, isLoading, actionType }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedInventory, setSelectedInventory] = useState<string>("");
  
  if (!isOpen || !product) return null;
  
  const hasDiscount = product.discount > 0;
  const totalPrice = product.price * quantity;
  const totalMrp = product.mrpPrice * quantity;
  const totalSavings = (product.mrpPrice - product.price) * quantity;
  const hasInventoryOptions = (product.inventoryType === 'colorLevelInventory' || product.inventoryType === 'levelInventory' || product.inventoryType === 'colorInventory') && product.inventoryRef?.length > 0;
  
  const modalImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : product.thumbnailImage;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 pb-24 sm:pb-6 overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white rounded-[2px] shadow-2xl animate-scale-in overflow-hidden max-w-md w-full max-h-[85vh] overflow-y-auto my-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart size={22} className="text-[#FF6C0C]" />
            {actionType === 'buy' ? 'এখনি কিনুন' : 'কার্টে যোগ করুন'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X size={22} />
          </button>
        </div>
        
        <div className="p-5 sm:p-6">
          <div className="flex gap-3.5 mb-4 bg-gray-50 p-3.5 rounded-[2px] border border-gray-100">
            <div className="w-24 h-24 shrink-0 bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src={getImageUrl(modalImage)} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1 leading-tight text-sm">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-2 font-mono bg-white px-2 py-0.5 rounded inline-block">
                ID: {product.productId}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl font-bold text-[#FF6C0C]">৳{product.price}</span>
                {hasDiscount && (
                  <>
                    <span className="text-sm line-through text-gray-400">৳{product.mrpPrice}</span>
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">
                      {product.discountType === 'percent' ? `${product.discount}% OFF` : `৳${product.discountAmount} OFF`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {hasInventoryOptions && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {product.inventoryType === 'levelInventory' ? 'সাইজ নির্বাচন করুন' : 
                 product.inventoryType === 'colorInventory' ? 'কালার নির্বাচন করুন' : 
                 'সাইজ ও কালার নির্বাচন করুন'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.inventoryRef.map((item: any) => {
                  const isOutOfStock = item.quantity === 0 || item.quantity < 0;
                  
                  let displayValue = 'Option';
                  
                  if (product.inventoryType === 'levelInventory') {
                    displayValue = item.level || item.size || 'Size';
                  } else if (product.inventoryType === 'colorInventory') {
                    displayValue = item.name || 'Color';
                  } else if (product.inventoryType === 'colorLevelInventory') {
                    const colorName = item.name || 'Color';
                    const sizeName = item.level || item.size || 'Size';
                    displayValue = `${colorName} - ${sizeName}`;
                  }
                  
                  return (
                    <button
                      key={item._id}
                      onClick={() => setSelectedInventory(item._id)}
                      className={`p-2.5 rounded-[2px] border-2 transition-all text-xs font-semibold ${
                        selectedInventory === item._id 
                          ? 'border-[#FF6C0C] bg-orange-50 text-[#FF6C0C]' 
                          : 'border-gray-200 hover:border-[#FF6C0C] hover:bg-orange-50 text-gray-700'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-bold uppercase">{displayValue}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-[2px] border border-gray-200">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 bg-white hover:bg-gray-100 rounded-[2px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs border border-gray-200 cursor-pointer"
                disabled={quantity <= 1}
              >
                <Minus size={18} strokeWidth={2.5} />
              </button>
              <span className="text-xl font-bold text-gray-800 w-12 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                className="p-2 bg-white hover:bg-gray-100 rounded-[2px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs border border-gray-200 cursor-pointer"
                disabled={quantity >= 99}
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-lg p-4 mb-4 border border-gray-200">
            <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Order Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({quantity} items)</span>
                <span className="font-bold text-gray-900">৳{totalPrice}</span>
              </div>
              {hasDiscount && (
                <>
                  <div className="flex justify-between text-sm text-gray-400 line-through">
                    <span>Original Price</span>
                    <span>৳{totalMrp}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-green-600 bg-green-50 -mx-2 px-2 py-1 rounded">
                    <span>You Save</span>
                    <span>৳{totalSavings}</span>
                  </div>
                </>
              )}
              {product.freeShipping && (
                <div className="flex justify-between text-sm font-bold text-green-600 pt-2 border-t border-gray-200">
                  <span>Shipping</span>
                  <span className="flex items-center gap-1">
                    <Check size={16} />
                    FREE
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-[#FF6C0C] pt-3 border-t-2 border-gray-300">
                <span>Total</span>
                <span>৳{totalPrice}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => onConfirm(quantity, selectedInventory || undefined)}
            disabled={isLoading || (hasInventoryOptions && !selectedInventory)}
            className={`w-full py-3 rounded-lg font-bold text-base flex items-center justify-center gap-2 shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              actionType === 'buy' 
                ? 'bg-[#FF6C0C] text-white hover:bg-[#E55A00] hover:shadow-md'
                : 'bg-black text-white hover:bg-gray-800 hover:shadow-md'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                <Check size={20} strokeWidth={2.5} />
                {actionType === 'buy' ? 'নিশ্চিত করুন ও এখনি কিনুন' : 'নিশ্চিত করুন ও কার্টে যোগ করুন'}
              </>
            )}
          </button>
          
          {hasInventoryOptions && !selectedInventory && (
            <p className="text-center text-sm text-red-500 mt-3 font-semibold">
              অনুগ্রহ করে {product.inventoryType === 'levelInventory' ? 'সাইজ' : 
                           product.inventoryType === 'colorInventory' ? 'কালার' : 
                           'সাইজ/কালার'} নির্বাচন করুন
            </p>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

import { useRouter } from 'next/navigation';

// Main Component
const HomeProductSection: React.FC<HomeProductSectionProps> = ({ products, userRef, onAddToCart }) => {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalAction, setModalAction] = useState<'cart' | 'buy'>('cart');
  const [visibleCount, setVisibleCount] = useState(15);
  
  const handleQuickAdd = (product: TProduct, action: 'cart' | 'buy' = 'cart') => {
    setSelectedProduct(product);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleConfirmCart = async (quantity: number, inventoryRef?: string) => {
    if (!selectedProduct) return;
    
    setIsLoading(true);
    
    try {
      const cartData = {
        productRef: selectedProduct._id,
        quantity: quantity,
        userRef: userRef,
        inventoryRef: inventoryRef || null
      };
      
      await onAddToCart(cartData);
      
      setIsModalOpen(false);
      
      if (modalAction === 'buy') {
        router.push('/checkout');
      } else {
        toast.success('Product added to cart successfully!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const allProducts = products?.result || [];
  const displayProducts = allProducts.slice(0, visibleCount);

  if (displayProducts.length === 0 && !products?.category) {
    return null;
  }

  return (

    <div>
      <div className="Container my-2 sm:my-3">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {/* Category Banner - Exact same size for all subcategories (0.8x reduced) */}
          <div className={`col-span-2 md:col-span-2 lg:col-span-2 ${
            displayProducts.length > 2 ? "md:row-span-2" : ""
          } h-[260px] sm:h-[320px] md:h-[440px] lg:h-[540px]`}>
            {products?.category && (
              <CategoryBannerCard product={products.category} />
            )}
          </div>
          
          {/* Product Cards */}
          {displayProducts.map((product) => (
            <ProductCard 
              key={product._id}
              product={product}
              onQuickAdd={handleQuickAdd} 
              onViewDetails={(prod: TProduct) => {
                router.push(`/product/${prod.slug}`);
              }}          
            />
          ))}
        </div>
      </div>

      {/* See more button for subcategory products */}
      {allProducts.length > visibleCount && (
        <div className="text-center mt-6 sm:mt-8">
          <button 
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="px-8 py-2.5 sm:px-10 sm:py-3 bg-linear-to-r from-[#FF6C0C] to-[#E55A00] text-white rounded-[2px] hover:from-[#E55A00] hover:to-[#CC4F00] transition-all duration-300 font-semibold text-sm sm:text-base shadow-sm hover:shadow-md cursor-pointer active:scale-95"
          >
            See more
          </button>
        </div>
      )}
      
      <AddToCartModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCart}
        isLoading={isLoading}
        actionType={modalAction}
      />
    </div>
  );
};

export default HomeProductSection;