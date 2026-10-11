"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaTruck,
  FaShieldAlt,
  FaCheckCircle,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import { getOrderTracking, OrderTrackingData } from "@/services/courier";
import OrderTrackingTimeline from "@/components/pages/tracking/OrderTrackingTimeline";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || searchParams.get("consignment_id") || "";

  const [searchQuery, setSearchQuery] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderTrackingData | null>(null);

  const handleTrack = async (identifierToTrack?: string) => {
    const id = (identifierToTrack !== undefined ? identifierToTrack : searchQuery).trim();
    if (!id) {
      setError("Please enter your Order ID, Consignment ID, or Phone number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getOrderTracking(id);
      if (response && response.data) {
        setOrderData(response.data);
      } else {
        setError("No tracking information found for this ID.");
        setOrderData(null);
      }
    } catch (err: any) {
      console.error("Order tracking error:", err);
      setError(err.message || "Order not found. Please verify your ID.");
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      handleTrack(initialId);
    }
  }, [initialId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Hero Section */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-[#FF6C0C] font-semibold text-xs uppercase tracking-wider mb-4"
          >
            <FaTruck className="text-sm" />
            Live Courier Tracking
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
          >
            Track Your Shipment
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl mx-auto"
          >
            Real-time delivery milestones powered by our official courier partners:{" "}
            <span className="font-bold text-[#E23744]">Pathao</span> &{" "}
            <span className="font-bold text-emerald-600">Steadfast</span>.
          </motion.p>
        </div>

        {/* Search Input Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 mb-8"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. PRO-12345), Consignment ID, or Phone..."
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#FF6C0C] focus:outline-none transition-all text-sm font-medium placeholder-gray-400"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-gradient-to-r from-[#FF6C0C] to-[#e55a00] hover:from-[#e55a00] hover:to-[#cc4e00] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-base" />
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <FaTruck className="text-base" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2"
              >
                <FaExclamationCircle className="text-red-500 text-base flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Guidance / Badges */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
            <span className="flex items-center gap-1.5">
              <FaShieldAlt className="text-green-600" />
              Verified Real-time Courier Sync
            </span>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 font-semibold text-gray-700">
                <span className="w-2 h-2 rounded-full bg-[#E23744]" /> Pathao
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-gray-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Steadfast
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tracking Results */}
        {orderData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <OrderTrackingTimeline order={orderData} />
          </motion.div>
        )}

        {/* Empty State / Helpful Information when no search yet */}
        {!orderData && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-orange-100 text-[#FF6C0C] flex items-center justify-center text-xl mb-4">
                1
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">Find Your Order ID</h3>
              <p className="text-xs text-gray-500">
                Check your SMS confirmation or checkout receipt for your unique Order ID (e.g. PRO-12345).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-100 text-[#E23744] flex items-center justify-center text-xl mb-4">
                2
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">Courier Dispatch</h3>
              <p className="text-xs text-gray-500">
                Orders are dispatched via Pathao or Steadfast with dedicated tracking numbers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl mb-4">
                3
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">Live Updates</h3>
              <p className="text-xs text-gray-500">
                Webhooks update milestones automatically from courier pickup to your doorstep.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <FaSpinner className="animate-spin text-3xl text-[#FF6C0C]" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
