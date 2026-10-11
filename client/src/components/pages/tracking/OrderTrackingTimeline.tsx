"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaBoxOpen,
  FaTruck,
  FaShippingFast,
  FaHome,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaReceipt,
  FaExclamationTriangle,
  FaPauseCircle,
} from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import { getImageUrl } from "@/config/config";
import { OrderTrackingData } from "@/services/courier";

interface OrderTrackingTimelineProps {
  order: OrderTrackingData;
}

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({ order }) => {
  const courier = (order.courierName || "").toLowerCase();
  const isPathao = courier.includes("pathao");
  const isSteadfast = courier.includes("steadfast");

  // Determine external tracking URL
  const trackingUrl =
    order.trackingUrl ||
    (order.consignmentId
      ? isPathao
        ? `https://merchant.pathao.com/tracking?consignment_id=${order.consignmentId}`
        : isSteadfast
        ? `https://steadfast.com.bd/t/${order.consignmentId}`
        : null
      : null);

  // Standard delivery milestone definitions
  const steps: TimelineStep[] = [
    {
      id: "placed",
      title: "Order Placed",
      description: "We have received your order",
      icon: <FaReceipt className="text-base" />,
    },
    {
      id: "confirmed",
      title: "Confirmed & Packing",
      description: "Items verified & prepared for shipping",
      icon: <FaBoxOpen className="text-base" />,
    },
    {
      id: "picked",
      title: isPathao ? "Picked by Pathao" : isSteadfast ? "Picked by Steadfast" : "Handed to Courier",
      description: order.consignmentId
        ? `Consignment ID: ${order.consignmentId}`
        : "Courier assignment in progress",
      icon: <FaTruck className="text-base" />,
    },
    {
      id: "intransit",
      title: "In Transit",
      description: "Package is on the way between courier hubs",
      icon: <FaShippingFast className="text-base" />,
    },
    {
      id: "delivered",
      title: "Delivered",
      description: "Package delivered to your doorstep",
      icon: <FaHome className="text-base" />,
    },
  ];

  // Map internal order status & courier status to an active milestone index (0 to 4)
  const calculateActiveStep = (): { stepIndex: number; isCancelled: boolean; isHold: boolean } => {
    const rawStatus = (order.status || "").toLowerCase();
    const courierStatus = (order.courierStatus || "").toLowerCase();

    if (rawStatus.includes("cancel") || courierStatus.includes("cancel") || courierStatus.includes("return")) {
      return { stepIndex: 0, isCancelled: true, isHold: false };
    }
    if (rawStatus.includes("hold") || courierStatus.includes("hold")) {
      return { stepIndex: 2, isCancelled: false, isHold: true };
    }
    if (rawStatus === "delivered" || courierStatus.includes("delivered")) {
      return { stepIndex: 4, isCancelled: false, isHold: false };
    }
    if (
      courierStatus.includes("transit") ||
      courierStatus.includes("ready") ||
      courierStatus.includes("out_for_delivery")
    ) {
      return { stepIndex: 3, isCancelled: false, isHold: false };
    }
    if (
      rawStatus === "deliveredpending" ||
      courierStatus.includes("picked") ||
      courierStatus.includes("assigned") ||
      Boolean(order.consignmentId)
    ) {
      return { stepIndex: 2, isCancelled: false, isHold: false };
    }
    if (rawStatus === "inreview" || rawStatus === "confirmed") {
      return { stepIndex: 1, isCancelled: false, isHold: false };
    }
    // Default is Order Placed
    return { stepIndex: 0, isCancelled: false, isHold: false };
  };

  const { stepIndex, isCancelled, isHold } = calculateActiveStep();

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full text-gray-300">
                Order Tracking
              </span>
              <span className="text-lg font-bold text-white tracking-wide">
                #{order.orderId}
              </span>

              {/* Branded Courier Badge */}
              {isPathao && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E23744]/20 border border-[#E23744]/40 text-[#FF6B6B]">
                  <span className="w-2 h-2 rounded-full bg-[#E23744] animate-pulse" />
                  Pathao Courier
                </span>
              )}
              {isSteadfast && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Steadfast Courier
                </span>
              )}
              {!isPathao && !isSteadfast && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 border border-blue-500/40 text-blue-300">
                  Standard Delivery
                </span>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-2 flex items-center gap-2">
              <FaCalendarAlt /> Ordered on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Direct Live Courier Link */}
          {trackingUrl && (
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md ${
                isPathao
                  ? "bg-[#E23744] hover:bg-[#c92e3a] text-white shadow-red-900/30"
                  : isSteadfast
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/30"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              <span>View Live on {isPathao ? "Pathao" : isSteadfast ? "Steadfast" : "Courier"}</span>
              <FaExternalLinkAlt className="text-xs" />
            </motion.a>
          )}
        </div>

        {/* Consignment Highlight bar if assigned */}
        {order.consignmentId && (
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-gray-400">Consignment ID:</span>
              <span className="font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-white select-all">
                {order.consignmentId}
              </span>
            </div>
            {order.courierStatus && (
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-gray-400">Courier Status:</span>
                <span className="font-semibold text-white capitalize">
                  {order.courierStatus.replace(/_/g, " ")}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Special State Alerts */}
      {isCancelled && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6 rounded-r-lg flex items-center gap-3">
          <FaExclamationTriangle className="text-red-500 text-xl flex-shrink-0" />
          <div>
            <h4 className="font-bold text-red-800 text-sm">Order Cancelled or Returned</h4>
            <p className="text-xs text-red-600">
              This order has been cancelled or returned. Please contact our support team if you have any questions.
            </p>
          </div>
        </div>
      )}

      {isHold && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 m-6 rounded-r-lg flex items-center gap-3">
          <FaPauseCircle className="text-amber-500 text-xl flex-shrink-0" />
          <div>
            <h4 className="font-bold text-amber-800 text-sm">Order on Hold</h4>
            <p className="text-xs text-amber-700">
              Your shipment is temporarily on hold with the courier. Our team is coordinating with the delivery hero.
            </p>
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      <div className="p-6 sm:p-8 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-6">
          Delivery Progress
        </h3>

        {/* Desktop / Tablet Horizontal Timeline */}
        <div className="hidden md:grid md:grid-cols-5 relative">
          {/* Background Connector Bar */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-0">
            <div
              className={`h-full transition-all duration-700 ${
                isCancelled ? "bg-red-500" : isPathao ? "bg-[#E23744]" : "bg-emerald-600"
              }`}
              style={{
                width: `${(stepIndex / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {steps.map((step, idx) => {
            const isCompleted = idx < stepIndex;
            const isCurrent = idx === stepIndex && !isCancelled;

            return (
              <div key={step.id} className="flex flex-col items-center text-center relative px-2">
                {/* Node Icon */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: isCurrent ? 1.15 : 1 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all shadow-md z-10 ${
                    isCompleted
                      ? isPathao
                        ? "bg-[#E23744] text-white shadow-red-200"
                        : "bg-emerald-600 text-white shadow-emerald-200"
                      : isCurrent
                      ? isPathao
                        ? "bg-white text-[#E23744] border-4 border-[#E23744] ring-4 ring-red-100"
                        : "bg-white text-emerald-600 border-4 border-emerald-600 ring-4 ring-emerald-100"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}
                >
                  {isCompleted ? <FaCheckCircle className="text-lg" /> : step.icon}
                </motion.div>

                {/* Text Description */}
                <h4
                  className={`mt-3 text-xs font-bold leading-tight ${
                    isCurrent
                      ? isPathao
                        ? "text-[#E23744]"
                        : "text-emerald-700"
                      : isCompleted
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 max-w-[140px]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden space-y-6 relative pl-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
          {steps.map((step, idx) => {
            const isCompleted = idx < stepIndex;
            const isCurrent = idx === stepIndex && !isCancelled;

            return (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Milestone Node */}
                <div
                  className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                    isCompleted
                      ? isPathao
                        ? "bg-[#E23744] text-white"
                        : "bg-emerald-600 text-white"
                      : isCurrent
                      ? isPathao
                        ? "bg-white text-[#E23744] border-2 border-[#E23744] ring-2 ring-red-100"
                        : "bg-white text-emerald-600 border-2 border-emerald-600 ring-2 ring-emerald-100"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {isCompleted ? <FaCheckCircle /> : idx + 1}
                </div>

                {/* Content */}
                <div className="pl-4">
                  <h4
                    className={`text-sm font-bold ${
                      isCurrent
                        ? isPathao
                          ? "text-[#E23744]"
                          : "text-emerald-700"
                        : isCompleted
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recipient & Shipping Information Grid */}
      <div className="p-6 sm:p-8 bg-gray-50/70 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Address */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
            <FaMapMarkerAlt className="text-orange-500" /> Delivery Address
          </h4>
          <p className="text-sm font-bold text-gray-800">{order.customerName || "Customer"}</p>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            {order.customerAddress || "Address on record"}
          </p>
          {order.customerPhone && (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5 font-mono">
              <FaPhoneAlt className="text-[10px] text-gray-400" /> {order.customerPhone}
            </p>
          )}
        </div>

        {/* Payment Summary */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
            <FaReceipt className="text-blue-500" /> Payment & Charges
          </h4>
          <div className="flex justify-between items-center text-sm py-1 border-b border-gray-100">
            <span className="text-xs text-gray-500">Method</span>
            <span className="font-semibold text-gray-700">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center text-sm py-1 border-b border-gray-100">
            <span className="text-xs text-gray-500">Payment Status</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                order.paymentStatus === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm pt-2">
            <span className="text-xs font-bold text-gray-700">Total Amount</span>
            <span className="text-base font-extrabold text-gray-900">
              ৳{Number(order.totalPrice || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Ordered Items Accordion / Summary */}
      {order.products && order.products.length > 0 && (
        <div className="p-6 sm:p-8 border-t border-gray-100 bg-white">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Items in this Shipment ({order.products.length})
          </h4>
          <div className="divide-y divide-gray-100">
            {order.products.map((item, index) => {
              const product = item.productRef;
              return (
                <div key={index} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                      <Image
                        src={getImageUrl(product?.thumbnailImage)}
                        alt={product?.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-gray-800 line-clamp-1">
                        {product?.name || "Ordered Product"}
                      </h5>
                      <span className="text-[11px] text-gray-500">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-700">
                    ৳{Number(item.price || product?.price || 0).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingTimeline;
