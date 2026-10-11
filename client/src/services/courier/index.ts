import { apiBaseUrl } from "@/config/config";

export interface OrderTrackingData {
  orderId: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  courierName?: "pathao" | "steadfast" | string | null;
  consignmentId?: string | null;
  courierStatus?: string | null;
  trackingUrl?: string | null;
  courierTrackingData?: any;
  products?: Array<{
    productRef?: {
      _id: string;
      name: string;
      thumbnailImage?: string;
      price?: number;
    };
    quantity: number;
    price?: number;
  }>;
}

export interface OrderTrackingResponse {
  statusCode: number;
  message: string;
  data: OrderTrackingData;
}

export async function getOrderTracking(identifier: string): Promise<OrderTrackingResponse> {
  const cleanId = encodeURIComponent(identifier.trim());
  const res = await fetch(`${apiBaseUrl}/courier/track/${cleanId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to retrieve order tracking information");
  }

  return res.json();
}
