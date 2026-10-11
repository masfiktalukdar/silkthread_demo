import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/config/config";
import CartDelete from "@/components/actionButton/CartDelete";
import CartQuantity from "@/components/actionButton/CartQuantity";
import { getCartProducts } from "@/services/cart";
import { getUser } from "@/services/auth";
import { TProduct } from "@/types";
import { Key, ReactNode } from "react";
import { Metadata } from "next";
import { ShoppingBag, ArrowRight, ShoppingCart, Package, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Silk Thread | Cart",
  description: "Best E-commerce platform in BD",
};

const Cart = async () => {
  const user = await getUser();
  const userId = user?.id;
  const coupon = "";
  const products = await getCartProducts(userId, coupon);

  const cartDetails = products?.data?.cartDetails || [];
  const totalPrice = products?.data?.totalPrice || 0;
  const subTotalPrice = products?.data?.subTotalPrice || 0;
  const totalSaved = subTotalPrice - totalPrice;

  const totalItemsCount = cartDetails.reduce(
    (sum: number, item: any) => sum + (Number(item?.quantity) || 1),
    0
  );

  const isEmpty = cartDetails.length === 0;

  return (
    <>
      <div className="min-h-screen bg-[#FAF9F6]">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-100 py-8 px-4">
          <div className="Container mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6C0C]/10 rounded-full flex items-center justify-center">
                <ShoppingBag size={20} className="text-[#FF6C0C]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Your Shopping Cart</h1>
                <p className="text-sm text-gray-500">
                  {isEmpty
                    ? "Your cart is empty"
                    : `${totalItemsCount} item${totalItemsCount !== 1 ? "s" : ""} in your cart`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="Container mx-auto py-8 px-4">
          {isEmpty ? (
            /* Empty Cart State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart size={40} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-8 max-w-md">
                Looks like you haven't added anything to your cart yet. Start shopping and discover our amazing products!
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#FF6C0C] hover:bg-[#E55A00] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <ShoppingBag size={18} />
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Desktop Header */}
                <div className="hidden lg:grid grid-cols-12 bg-white rounded-[2px] px-5 py-4 border border-gray-100 shadow-sm text-xs font-bold text-gray-500 uppercase tracking-widest items-center">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Unit Price</div>
                  <div className="col-span-1 text-center">Size</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-1 text-center">Total</div>
                  <div className="col-span-1 text-center">Del</div>
                </div>

                {/* Cart Product Rows */}
                {cartDetails.map(
                  (product: {
                    inventory: any;
                    quantity: string | number;
                    subtotal: ReactNode;
                    savedAmount: ReactNode;
                    cartId: string;
                    _id: Key | null | undefined;
                    product: TProduct;
                  }) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-[2px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                    >
                      {/* Desktop Row */}
                      <div className="hidden lg:grid grid-cols-12 items-center px-5 py-4">
                        {/* Product Info */}
                        <div className="col-span-5 flex items-center gap-4">
                          <div className="relative w-20 h-20 rounded-[2px] overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                            {product?.product?.thumbnailImage && (
                              <Image
                                height={80}
                                width={80}
                                src={getImageUrl(product?.product?.thumbnailImage)}
                                alt={product?.product?.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2 mb-1">
                              {product?.product?.name}
                            </p>
                            <span className="inline-flex items-center gap-1 text-xs text-[#FF6C0C] bg-orange-50 rounded-full px-2 py-0.5 font-medium">
                              <Package size={10} />
                              In Stock
                            </span>
                          </div>
                        </div>

                        {/* Unit Price */}
                        <div className="col-span-2 text-center">
                          <p className="font-bold text-gray-800 text-sm">৳{product?.product?.price}</p>
                          {product?.product?.price !== product?.product?.mrpPrice && (
                            <p className="text-xs text-gray-400 line-through">৳{product?.product?.mrpPrice}</p>
                          )}
                        </div>

                        {/* Size */}
                        <div className="col-span-1 text-center">
                          {product?.inventory?.level ? (
                            <span className="inline-block bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5 rounded uppercase">
                              {product?.inventory?.level}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </div>

                        {/* Quantity with + and - buttons */}
                        <div className="col-span-2 flex justify-center">
                          <CartQuantity
                            cartId={product?.cartId}
                            initialQuantity={Number(product?.quantity) || 1}
                            maxQuantity={
                              product?.inventory?.quantity ||
                              (product?.product as any)?.mainInventory
                            }
                          />
                        </div>

                        {/* Subtotal */}
                        <div className="col-span-1 text-center">
                          <p className="font-bold text-gray-800 text-sm">৳{product?.subtotal}</p>
                          {Number(product?.savedAmount) > 0 && (
                            <p className="text-xs text-green-600 font-medium">-৳{product?.savedAmount}</p>
                          )}
                        </div>

                        {/* Delete */}
                        <div className="col-span-1 flex justify-center">
                          <CartDelete cardId={product?.cartId} />
                        </div>
                      </div>

                      {/* Mobile Card */}
                      <div className="lg:hidden p-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-24 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                            {product?.product?.thumbnailImage && (
                              <Image
                                height={96}
                                width={80}
                                src={getImageUrl(product?.product?.thumbnailImage)}
                                alt={product?.product?.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm leading-tight mb-2 line-clamp-2">
                              {product?.product?.name}
                            </p>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              {product?.inventory?.level ? (
                                <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5 rounded uppercase">
                                  {product?.inventory?.level}
                                </span>
                              ) : <span />}
                              <CartQuantity
                                cartId={product?.cartId}
                                initialQuantity={Number(product?.quantity) || 1}
                                maxQuantity={
                                  product?.inventory?.quantity ||
                                  (product?.product as any)?.mainInventory
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-gray-800">৳{product?.subtotal}</span>
                                {product?.product?.price !== product?.product?.mrpPrice && (
                                  <span className="text-xs text-gray-400 line-through ml-2">৳{product?.product?.mrpPrice}</span>
                                )}
                              </div>
                              <CartDelete cardId={product?.cartId} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {/* Continue Shopping */}
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-[#FF6C0C] hover:text-[#E55A00] font-semibold text-sm transition-colors mt-2"
                >
                  <ArrowRight size={16} className="rotate-180" />
                  Continue Shopping
                </Link>
              </div>

              {/* Order Summary Panel */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-[2px] border border-gray-100 shadow-sm p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">
                    Order Summary
                  </h3>

                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})</span>
                      <span className="font-semibold text-gray-800">৳{subTotalPrice}</span>
                    </div>
                    {totalSaved > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount Savings</span>
                        <span className="font-semibold">-৳{totalSaved}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Delivery Charge</span>
                      <span className="font-semibold text-gray-500">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-800 text-lg">Total</span>
                      <span className="font-bold text-[#FF6C0C] text-xl">৳{totalPrice}</span>
                    </div>
                    {totalSaved > 0 && (
                      <p className="text-xs text-green-600 text-right mt-1 font-medium">
                        You're saving ৳{totalSaved}!
                      </p>
                    )}
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-between px-5 py-3.5 bg-linear-to-r from-[#FF6C0C] to-[#E55A00] hover:from-[#E55A00] hover:to-[#CC4F00] text-white font-bold rounded-[2px] transition-all duration-200 shadow-md hover:shadow-lg mb-3 active:scale-[0.99] group cursor-pointer"
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-base sm:text-lg leading-tight font-extrabold tracking-wide">চেকআউট করুন</span>
                      <span className="text-[11px] font-medium text-orange-100 leading-tight">Proceed to Checkout ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold bg-white/20 px-2.5 py-1 rounded-[2px] backdrop-blur-xs">৳{totalPrice}</span>
                      <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>

                  <Link
                    href="/shop"
                    className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 font-semibold py-3 rounded-[2px] transition-all duration-200 text-sm"
                  >
                    Continue Shopping
                  </Link>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <p className="text-xs text-gray-500">Secure SSL encrypted checkout</p>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <p className="text-xs text-gray-500">Cash on Delivery available</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </div>
                      <p className="text-xs text-gray-500">Easy returns & exchanges</p>
                    </div>
                  </div>
                </div>

                {/* Bulk Order Notice */}
                <div className="mt-4 bg-orange-50 border border-orange-100 rounded-[2px] p-4">
                  <p className="text-xs text-gray-600 text-center">
                    For bulk orders call{" "}
                    <span className="font-bold text-gray-800">01623-726069</span>
                    {" "}or email{" "}
                    <span className="font-bold text-gray-800">silkthread.bd@gmail.com</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
