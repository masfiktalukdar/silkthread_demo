import { getAuthenticatedUser, getUser } from "@/services/auth";
import { getImageUrl } from "@/config/config";
import { getUserOrders } from "@/services/userInformation";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FiPackage,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiTruck,
  FiShoppingBag,
  FiInbox,
  FiExternalLink,
  FiCreditCard,
  FiMapPin,
  FiArrowRight,
} from "react-icons/fi";
import { TProduct } from "@/types";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "OrderPlaced":
      return {
        label: "Order Placed",
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <FiClock className="w-3.5 h-3.5" />,
      };
    case "InReview":
      return {
        label: "Under Review",
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <FiClock className="w-3.5 h-3.5" />,
      };
    case "DeliveredPending":
      return {
        label: "Out for Delivery",
        bg: "bg-orange-50 text-[#FF6C0C] border-orange-200",
        icon: <FiTruck className="w-3.5 h-3.5" />,
      };
    case "Delivered":
      return {
        label: "Delivered",
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <FiCheckCircle className="w-3.5 h-3.5" />,
      };
    case "PartialDelivered":
      return {
        label: "Partially Delivered",
        bg: "bg-teal-50 text-teal-700 border-teal-200",
        icon: <FiCheckCircle className="w-3.5 h-3.5" />,
      };
    case "Cancelled":
      return {
        label: "Cancelled",
        bg: "bg-red-50 text-red-700 border-red-200",
        icon: <FiXCircle className="w-3.5 h-3.5" />,
      };
    case "Hold":
      return {
        label: "On Hold",
        bg: "bg-purple-50 text-purple-700 border-purple-200",
        icon: <FiClock className="w-3.5 h-3.5" />,
      };
    default:
      return {
        label: status || "Processing",
        bg: "bg-gray-50 text-gray-700 border-gray-200",
        icon: <FiClock className="w-3.5 h-3.5" />,
      };
  }
};

const OrderHistory = async () => {
  let user = await getAuthenticatedUser();
  if (!user) {
    const fallback = await getUser();
    if (fallback && "id" in fallback && !fallback.id.includes("-")) {
      user = fallback as any;
    }
  }

  const userId = user?.id;

  let userOrderHistory: any[] = [];
  try {
    if (userId) {
      const userOrderHistoryResponse = await getUserOrders(userId as string);
      userOrderHistory = (userOrderHistoryResponse as { data: any })?.data || [];
    }
  } catch (error) {
    console.error("Error loading order history:", error);
  }

  const totalOrders = Array.isArray(userOrderHistory) ? userOrderHistory.length : 0;
  const deliveredOrders = Array.isArray(userOrderHistory)
    ? userOrderHistory.filter((o) => o.status === "Delivered").length
    : 0;
  const inTransitOrders = Array.isArray(userOrderHistory)
    ? userOrderHistory.filter((o) => o.status === "DeliveredPending" || o.status === "InReview").length
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white border border-[#EFECE6] rounded-[2px] p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 text-[#FF6C0C] rounded-[2px] shadow-2xs">
              <FiPackage className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                My Orders &amp; Invoices
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Track status, view item details, and follow courier deliveries for your purchases.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="px-4 py-2 bg-gray-50/80 border border-gray-200/80 rounded-[2px] text-center min-w-[85px]">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Total
            </span>
            <span className="text-lg font-black text-gray-900">{totalOrders}</span>
          </div>
          <div className="px-4 py-2 bg-orange-50/70 border border-orange-200/80 rounded-[2px] text-center min-w-[85px]">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#FF6C0C]">
              In Transit
            </span>
            <span className="text-lg font-black text-[#FF6C0C]">{inTransitOrders}</span>
          </div>
          <div className="px-4 py-2 bg-emerald-50/70 border border-emerald-200/80 rounded-[2px] text-center min-w-[85px]">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Delivered
            </span>
            <span className="text-lg font-black text-emerald-800">{deliveredOrders}</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {Array.isArray(userOrderHistory) && userOrderHistory.length > 0 ? (
          userOrderHistory.map((order) => {
            const statusInfo = getStatusBadge(order.status);
            const formattedDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "N/A";

            return (
              <div
                key={order?._id}
                className="bg-white border border-[#EFECE6] rounded-[2px] shadow-xs hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-[#FAF9F7] border-b border-[#EFECE6] p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Order ID:
                      </span>
                      <span className="font-mono font-black text-sm sm:text-base text-gray-900">
                        #{order?.orderId || order?._id?.slice(-8)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                      <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] text-xs font-bold border ${statusInfo.bg}`}
                    >
                      {statusInfo.icon}
                      <span>{statusInfo.label}</span>
                    </span>

                    <Link
                      href={`/track-order?id=${order.orderId || order.consignmentId || ""}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#FF6C0C] hover:bg-[#E55A00] rounded-[2px] transition-colors shadow-2xs hover:shadow-xs"
                    >
                      <FiTruck className="w-3.5 h-3.5" />
                      <span>Track Parcel</span>
                    </Link>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Courier & Shipping Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-orange-50/40 border border-orange-100 rounded-[2px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <FiTruck className="w-4 h-4 text-[#FF6C0C] shrink-0" />
                      <span className="text-xs font-semibold text-gray-700">
                        Courier Partner:
                      </span>
                      {order.courierName === "pathao" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[2px] text-xs font-bold bg-[#E23744]/10 text-[#E23744] border border-[#E23744]/30">
                          Pathao Courier {order.consignmentId ? `(#${order.consignmentId})` : ""}
                        </span>
                      ) : order.courierName === "steadfast" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[2px] text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                          Steadfast Courier {order.consignmentId ? `(#${order.consignmentId})` : ""}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-gray-800">
                          Silk Thread Express Delivery
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
                      <span>Delivery Charge: ৳{order?.shippingCost ?? 0}</span>
                      <span className="text-sm font-black text-gray-900">
                        Total: ৳{order?.totalPrice ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-3 pt-1">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Ordered Products ({order.products?.length || 0})
                    </h4>

                    <div className="divide-y divide-gray-100 border border-gray-100 rounded-[2px]">
                      {order.products?.map(
                        (item: TProduct & {
                          productRef: {
                            thumbnailImage?: string;
                            name?: string;
                            productId?: string;
                            quantity?: number;
                          };
                        }) => (
                          <div
                            key={item._id}
                            className="p-3 sm:p-4 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors"
                          >
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                              <div className="w-16 h-16 sm:w-18 sm:h-18 bg-gray-100 rounded-[2px] overflow-hidden shrink-0 border border-gray-200">
                                {item?.productRef?.thumbnailImage ? (
                                  <Image
                                    src={getImageUrl(item.productRef.thumbnailImage)}
                                    width={72}
                                    height={72}
                                    alt={item.productRef.name || "Product"}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <FiPackage className="w-6 h-6" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <h5 className="text-sm font-bold text-gray-900 truncate">
                                  {item?.productRef?.name || "Silk Thread Handloom Item"}
                                </h5>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  Code: {item?.productRef?.productId || "N/A"}
                                </p>
                                <p className="text-xs text-gray-600 font-semibold mt-1">
                                  Qty: {item.quantity} × ৳{item.price}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="block text-sm font-black text-gray-900">
                                ৳{(Number(item.price) || 0) * (Number(item.quantity) || 1)}
                              </span>
                              {item.mrpPrice && item.mrpPrice > item.price && (
                                <span className="block text-xs text-gray-400 line-through">
                                  ৳{(Number(item.mrpPrice) || 0) * (Number(item.quantity) || 1)}
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="bg-white border border-[#EFECE6] rounded-[2px] p-12 sm:p-16 text-center shadow-xs">
            <div className="w-20 h-20 bg-orange-50 text-[#FF6C0C] rounded-full flex items-center justify-center mx-auto mb-4">
              <FiInbox className="w-10 h-10" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
              No orders placed yet
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-1 mb-6 leading-relaxed">
              When you order exquisite handloom sarees, three-pieces, or luxury fabrics, your invoice details and live tracking will appear here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-[#FF6C0C] hover:bg-[#E55A00] rounded-[2px] shadow-sm hover:shadow-md transition-all"
            >
              <FiShoppingBag className="w-4 h-4" />
              <span>Explore Collection</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
