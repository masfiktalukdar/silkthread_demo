"use server";

import {
  BASE_URL,
  STEADFAST_API_KEY,
  STEADFAST_BASE_URL,
  STEADFAST_SECRET_KEY,
} from "@/config/config";
import { SteadfastOrderPayload } from "@/types/shared";

/**
 * Dispatches an order to Pathao Courier via backend API
 * Automatically records consignmentId and courierStatus in DB
 */
export async function sendOrderToPathao(orderId: string, extraData?: any) {
  try {
    const response = await fetch(`${BASE_URL}/courier/send/pathao/${orderId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(extraData || {}),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Pathao dispatch error: ${response.statusText}`);
    }
    return data;
  } catch (error: any) {
    console.error("sendOrderToPathao error:", error.message);
    throw error;
  }
}

/**
 * Dispatches an order to Steadfast Courier via backend API
 * Automatically records consignmentId and courierStatus in DB
 */
export async function sendOrderToSteadfast(orderId: string, extraData?: any) {
  try {
    const response = await fetch(`${BASE_URL}/courier/send/steadfast/${orderId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(extraData || {}),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Steadfast dispatch error: ${response.statusText}`);
    }
    return data;
  } catch (error: any) {
    console.error("sendOrderToSteadfast error:", error.message);
    throw error;
  }
}

/**
 * Legacy direct Steadfast order creator (kept for backward compatibility)
 */
export async function createSteadfastOrder(data: SteadfastOrderPayload) {
  try {
    const response = await fetch(`${STEADFAST_BASE_URL}/create_order`, {
      headers: {
        "Content-Type": "application/json",
        "Api-Key": STEADFAST_API_KEY || "",
        "Secret-Key": STEADFAST_SECRET_KEY || "",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.json();
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}
