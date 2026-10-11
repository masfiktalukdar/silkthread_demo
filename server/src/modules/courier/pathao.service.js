const pathaoConfig = require("../../config/pathao.config.js");
const { OrderSchema } = require("../../models/order/orderSchema.js");

class PathaoService {
  constructor() {
    this.config = pathaoConfig;
    this.cachedToken = null;
    this.tokenExpiresAt = 0;
  }

  /**
   * Fetches a valid Pathao Aladdin Bearer access token.
   * Utilizes in-memory caching to avoid issuing duplicate tokens unnecessarily.
   * Pathao tokens typically expire in 15-30 days; cached with a 5-minute safety threshold.
   */
  async getAccessToken() {
    const now = Date.now();
    // Return cached token if valid and not within 5 minutes of expiration
    if (this.cachedToken && this.tokenExpiresAt > now + 5 * 60 * 1000) {
      return this.cachedToken;
    }

    const { baseUrl, clientId, clientSecret, username, password } = this.config;

    if (!clientId || !clientSecret || !username || !password) {
      throw new Error(
        "Pathao API credentials are incomplete. Please check PATHAO_CLIENT_ID, PATHAO_CLIENT_SECRET, PATHAO_USERNAME, and PATHAO_PASSWORD in .env"
      );
    }

    const tokenUrl = `${baseUrl}/aladdin/api/v1/issue-token`;
    const payload = {
      client_id: clientId,
      client_secret: clientSecret,
      username: username,
      password: password,
      grant_type: "password",
    };

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const rawText = await response.text();
      let data;
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch (parseErr) {
        data = { message: rawText || `HTTP ${response.status} ${response.statusText}` };
      }

      if (!response.ok) {
        console.error("Pathao Auth Error Response:", {
          status: response.status,
          statusText: response.statusText,
          data,
        });
        throw new Error(
          `Pathao authentication failed (${response.status}): ${
            data?.message || data?.error_description || "Invalid Pathao API credentials. Please configure real Pathao credentials in server/.env"
          }`
        );
      }

      if (!data?.access_token) {
        throw new Error("Pathao issue-token API response did not contain an access_token");
      }

      this.cachedToken = data.access_token;
      // expires_in is in seconds (e.g., 2592000 for 30 days)
      const expiresInMs = (Number(data.expires_in) || 3600) * 1000;
      this.tokenExpiresAt = now + expiresInMs;

      return this.cachedToken;
    } catch (error) {
      console.error("Error in PathaoService.getAccessToken:", error.message);
      throw error;
    }
  }

  /**
   * Maps order data into Pathao Aladdin schema and dispatches order creation.
   * @param {Object} orderData - Internal order object or direct creation payload
   * @returns {Promise<{success: boolean, consignment_id: string, data: Object}>}
   */
  async createOrder(orderData) {
    try {
      const token = await this.getAccessToken();

      // Normalize fields from application OrderSchema or direct payload
      const recipientName =
        orderData.recipient_name || orderData.customerName || "";
      const recipientPhone =
        orderData.recipient_phone || orderData.customerPhone || "";
      const recipientAddress =
        orderData.recipient_address ||
        [
          orderData.customerAddress,
          orderData.customerHouse ? `House: ${orderData.customerHouse}` : "",
          orderData.customerRoad ? `Road: ${orderData.customerRoad}` : "",
          orderData.customerThana ? `Thana: ${orderData.customerThana}` : "",
          orderData.customerCity ? `City: ${orderData.customerCity}` : "",
        ]
          .filter(Boolean)
          .join(", ") ||
        "";

      if (!recipientName) throw new Error("Recipient name is required for Pathao delivery");
      if (!recipientPhone) throw new Error("Recipient phone is required for Pathao delivery");
      if (!recipientAddress) throw new Error("Recipient address is required for Pathao delivery");

      // Calculate amount to collect: 0 if paid online/completed, otherwise total payable
      let amountToCollect = 0;
      if (
        orderData.paymentStatus === "COMPLETED" ||
        orderData.paymentMethod === "Online" ||
        orderData.amount_to_collect === 0
      ) {
        amountToCollect = 0;
      } else if (orderData.amount_to_collect !== undefined) {
        amountToCollect = Number(orderData.amount_to_collect);
      } else if (orderData.totalPrice !== undefined) {
        amountToCollect = Number(orderData.totalPrice);
      }

      // Quantity calculation
      const itemQuantity =
        orderData.item_quantity ||
        (Array.isArray(orderData.products)
          ? orderData.products.reduce((acc, p) => acc + (p.quantity || 1), 0)
          : 1);

      // Pathao Aladdin payload schema
      const pathaoPayload = {
        store_id: Number(orderData.store_id || this.config.storeId || 1),
        merchant_order_id: String(
          orderData.merchant_order_id || orderData.orderId || orderData._id || ""
        ),
        recipient_name: recipientName.trim(),
        recipient_phone: recipientPhone.trim(),
        recipient_address: recipientAddress.trim(),
        recipient_city: Number(orderData.recipient_city || orderData.city_id || 1),
        recipient_zone: Number(orderData.recipient_zone || orderData.zone_id || 1),
        recipient_area: orderData.recipient_area || orderData.area_id ? Number(orderData.recipient_area || orderData.area_id) : undefined,
        delivery_type: Number(orderData.delivery_type || 48), // 48 = normal delivery
        item_type: Number(orderData.item_type || 2), // 2 = parcel
        special_instruction: orderData.special_instruction || orderData.note || "",
        item_quantity: itemQuantity,
        item_weight: Number(orderData.item_weight || 0.5),
        amount_to_collect: amountToCollect,
        item_description:
          orderData.item_description ||
          `Order ${orderData.merchant_order_id || orderData.orderId || ""}`,
      };

      const orderUrl = `${this.config.baseUrl}/aladdin/api/v1/orders`;

      const response = await fetch(orderUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(pathaoPayload),
      });

      const rawResponseText = await response.text();
      let responseData;
      try {
        responseData = rawResponseText ? JSON.parse(rawResponseText) : {};
      } catch (parseErr) {
        responseData = { message: rawResponseText || `HTTP ${response.status} ${response.statusText}` };
      }

      if (!response.ok) {
        console.error("Pathao Order Creation Failed:", {
          status: response.status,
          statusText: response.statusText,
          payload: pathaoPayload,
          response: responseData,
        });
        throw new Error(
          `Pathao Order Creation Failed (${response.status}): ${
            responseData?.message || JSON.stringify(responseData?.errors || responseData)
          }`
        );
      }

      const consignmentId =
        responseData?.data?.consignment_id || responseData?.consignment_id;

      if (!consignmentId) {
        throw new Error("Pathao response did not contain consignment_id");
      }

      // If an existing order in database matches, update it with consignment details
      const orderIdentifier = orderData.orderId || orderData._id || orderData.merchant_order_id;
      if (orderIdentifier) {
        await OrderSchema.findOneAndUpdate(
          {
            $or: [
              { orderId: orderIdentifier },
              ...(typeof orderIdentifier === "string" && orderIdentifier.match(/^[0-9a-fA-F]{24}$/)
                ? [{ _id: orderIdentifier }]
                : []),
            ],
          },
          {
            $set: {
              consignmentId: consignmentId,
              courierName: "pathao",
              courierStatus: responseData?.data?.order_status || "Pending",
              courierTrackingData: responseData?.data || responseData,
            },
          }
        ).catch((dbErr) => {
          console.warn("Could not auto-link consignment to order in DB:", dbErr.message);
        });
      }

      return {
        success: true,
        consignment_id: consignmentId,
        data: responseData?.data || responseData,
      };
    } catch (error) {
      console.error("PathaoService.createOrder Exception:", error.message);
      throw error;
    }
  }

  /**
   * Tracks an order using consignment_id from Pathao API
   * @param {string} consignmentId
   */
  async trackOrder(consignmentId) {
    const token = await this.getAccessToken();
    const url = `${this.config.baseUrl}/aladdin/api/v1/orders/${consignmentId}/info`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        `Pathao Tracking Failed (${response.status}): ${data?.message || JSON.stringify(data)}`
      );
    }

    return data?.data || data;
  }

  /**
   * Fetches registered merchant stores from Pathao
   */
  async getStores() {
    const token = await this.getAccessToken();
    const url = `${this.config.baseUrl}/aladdin/api/v1/stores`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to fetch Pathao stores: ${data?.message || JSON.stringify(data)}`);
    }

    return data?.data?.data || data?.data || [];
  }

  /**
   * Fetches cities supported by Pathao
   */
  async getCities() {
    const token = await this.getAccessToken();
    const url = `${this.config.baseUrl}/aladdin/api/v1/city-list`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return data?.data?.data || data?.data || [];
  }

  /**
   * Fetches zones for a specific city from Pathao
   * @param {number|string} cityId
   */
  async getZones(cityId) {
    const token = await this.getAccessToken();
    const url = `${this.config.baseUrl}/aladdin/api/v1/cities/${cityId}/zone-list`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return data?.data?.data || data?.data || [];
  }

  /**
   * Fetches areas for a specific zone from Pathao
   * @param {number|string} zoneId
   */
  async getAreas(zoneId) {
    const token = await this.getAccessToken();
    const url = `${this.config.baseUrl}/aladdin/api/v1/zones/${zoneId}/area-list`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return data?.data?.data || data?.data || [];
  }
}

module.exports = new PathaoService();
