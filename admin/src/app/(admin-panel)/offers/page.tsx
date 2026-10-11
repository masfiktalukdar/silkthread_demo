"use client";

import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/config/config";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Truck, CheckCircle2, XCircle } from "lucide-react";

export default function OffersPage() {
  const [offerId, setOfferId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/shippingMethod`);
      const data = await res.json();
      
      let offer = null;
      if (Array.isArray(data?.data)) {
        offer = data.data.find((m: any) => m.shippingMethod === 'FREE_SHIPPING_ON_3_ITEMS');
      }

      if (offer) {
        setOfferId(offer._id);
        setIsActive(Boolean(offer.status));
      } else {
        // Create offer if not found
        const createRes = await fetch(`${BASE_URL}/shippingMethod`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shippingMethod: 'FREE_SHIPPING_ON_3_ITEMS',
            rate: 0,
            status: false
          })
        });
        const createData = await createRes.json();
        const createdDoc = Array.isArray(createData?.data) ? createData.data[0] : createData?.data;
        if (createdDoc?._id) {
          setOfferId(createdDoc._id);
          setIsActive(Boolean(createdDoc.status));
        }
      }
    } catch (error) {
      console.error("Error fetching offers", error);
      toast.error("Failed to load offers. Please try refreshing.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (checked: boolean) => {
    try {
      setIsUpdating(true);
      let currentId = offerId;

      // If offer ID is somehow missing, ensure it exists first
      if (!currentId) {
        const createRes = await fetch(`${BASE_URL}/shippingMethod`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shippingMethod: 'FREE_SHIPPING_ON_3_ITEMS',
            rate: 0,
            status: checked
          })
        });
        const createData = await createRes.json();
        const createdDoc = Array.isArray(createData?.data) ? createData.data[0] : createData?.data;
        if (createdDoc?._id) {
          currentId = createdDoc._id;
          setOfferId(currentId);
          setIsActive(checked);
          toast.success(`Free Shipping Offer is now ${checked ? "Active" : "Inactive"}`);
          return;
        } else {
          throw new Error("Failed to initialize offer");
        }
      }

      // Optimistic update
      setIsActive(checked);

      const res = await fetch(`${BASE_URL}/shippingMethod/status/${currentId}?status=${checked}`, {
        method: 'PUT'
      });

      if (!res.ok) {
        throw new Error("Failed to update status on server");
      }

      toast.success(`Free Shipping Offer is now ${checked ? "Active" : "Inactive"}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      // Revert optimistic update
      setIsActive(!checked);
      toast.error("Failed to update offer status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Truck className="w-8 h-8 text-[#FF6C0C]" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Special Offers & Promotions</h1>
          <p className="text-sm text-gray-500 mt-1">Configure global store discounts and shipping promotions.</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center gap-2 p-8 text-gray-500 justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#FF6C0C]" />
          <span>Loading offers...</span>
        </div>
      ) : (
        <Card className="shadow-md border border-gray-200 hover:shadow-lg transition-all rounded-xl overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>Free Shipping on 3+ Items</span>
              </CardTitle>
              <div className="flex items-center gap-3">
                {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-[#FF6C0C]" />}
                <Switch 
                  checked={isActive} 
                  onCheckedChange={handleToggle} 
                  disabled={isUpdating}
                  id="free-shipping-toggle"
                  className="cursor-pointer data-[state=checked]:bg-[#FF6C0C]"
                />
              </div>
            </div>
            <CardDescription className="text-sm text-gray-600 mt-2">
              Automatically apply free delivery (both inside and outside Dhaka) when a customer adds 3 or more items to their cart.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="free-shipping-toggle" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Offer Status:
                </Label>
                {isActive ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ACTIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                    <XCircle className="w-3.5 h-3.5" />
                    INACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {isActive 
                  ? "Customers purchasing 3 or more items receive ৳0 delivery fee at checkout."
                  : "Standard shipping rates apply based on customer location (Dhaka: ৳60, Outside: ৳120)."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
