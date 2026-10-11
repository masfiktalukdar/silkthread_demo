"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateCartQuantity } from "@/services/cart";
import { FiPlus, FiMinus } from "react-icons/fi";
import { toast } from "react-toastify";

interface Props {
  cartId: string;
  initialQuantity: number;
  maxQuantity?: number;
}

const CartQuantity: React.FC<Props> = ({
  cartId,
  initialQuantity,
  maxQuantity,
}) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(Number(initialQuantity) || 1);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setQuantity(Number(initialQuantity) || 1);
  }, [initialQuantity]);

  const handleUpdate = async (action: "increment" | "decrement") => {
    if (isPending) return;

    if (action === "decrement" && quantity <= 1) {
      return;
    }

    if (
      action === "increment" &&
      typeof maxQuantity === "number" &&
      maxQuantity > 0 &&
      quantity >= maxQuantity
    ) {
      toast.info(`Only ${maxQuantity} items available in stock.`);
      return;
    }

    const previousQuantity = quantity;
    const nextQuantity = action === "increment" ? quantity + 1 : quantity - 1;

    // Optimistic UI update
    setQuantity(nextQuantity);

    startTransition(async () => {
      try {
        const res = await updateCartQuantity(cartId, action);
        if (!res || res.success === false) {
          setQuantity(previousQuantity);
          toast.error("Could not update item quantity.");
          return;
        }
        router.refresh();
      } catch (err) {
        console.error("Cart quantity update error:", err);
        setQuantity(previousQuantity);
        toast.error("Failed to update quantity. Please try again.");
      }
    });
  };

  return (
    <div className="inline-flex items-center bg-gray-50/80 border border-gray-200 rounded-[2px] p-0.5 shadow-2xs">
      {/* Minus Button */}
      <button
        type="button"
        onClick={() => handleUpdate("decrement")}
        disabled={quantity <= 1 || isPending}
        title={quantity <= 1 ? "Minimum quantity is 1" : "Decrease quantity"}
        className={`w-7 h-7 flex items-center justify-center rounded-[2px] transition-all duration-150 ${
          quantity <= 1 || isPending
            ? "text-gray-300 cursor-not-allowed bg-transparent"
            : "text-gray-700 hover:text-[#FF6C0C] hover:bg-white active:scale-95 cursor-pointer shadow-2xs"
        }`}
        aria-label="Decrease quantity"
      >
        <FiMinus className="w-3.5 h-3.5" />
      </button>

      {/* Quantity Display */}
      <span className="w-8 text-center text-xs sm:text-sm font-bold text-gray-900 select-none">
        {quantity}
      </span>

      {/* Plus Button */}
      <button
        type="button"
        onClick={() => handleUpdate("increment")}
        disabled={
          isPending ||
          (typeof maxQuantity === "number" &&
            maxQuantity > 0 &&
            quantity >= maxQuantity)
        }
        title={
          typeof maxQuantity === "number" &&
          maxQuantity > 0 &&
          quantity >= maxQuantity
            ? "Maximum stock reached"
            : "Increase quantity"
        }
        className={`w-7 h-7 flex items-center justify-center rounded-[2px] transition-all duration-150 ${
          isPending ||
          (typeof maxQuantity === "number" &&
            maxQuantity > 0 &&
            quantity >= maxQuantity)
            ? "text-gray-300 cursor-not-allowed bg-transparent"
            : "text-gray-700 hover:text-[#FF6C0C] hover:bg-white active:scale-95 cursor-pointer shadow-2xs"
        }`}
        aria-label="Increase quantity"
      >
        <FiPlus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default CartQuantity;
