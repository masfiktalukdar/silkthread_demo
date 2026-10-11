const steadfastConfig = require("../../config/steadfast.config.js");
const { OrderSchema } = require("../../models/order/orderSchema.js");

class SteadfastService {
  constructor() {
    this.config = steadfastConfig;
  }

  /**
   * Helper to construct auth headers for Steadfast API
   */
  getHeaders() {
    const { apiKey, secretKey } = this.config;
    if (!apiKey || !secretKey) {
      throw new Error(
        "Steadfast API credentials are missing. Please verify STEADFAST_API_KEY and STEADFAST_SECRET_KEY in .env"
      );
    }

    return {
      "Content-Type": "application/json",
      "Api-Key": apiKey,
      "Secret-Key": secretKey,
    };
  }

  /**
   * Creates an order with Steadfast Courier.
   * Maps internal order data, sends API request, and auto-links consignment details to MongoDB.
   * @param {Object} orderData
   * @returns {Promise<{success: boolean, consignment_id: string|number, data: Object}>}
   */
  async createOrder(orderData) {
    try {
      const headers = this.getHeaders();

      const invoice = String(
        orderData.invoice || orderData.orderId || orderData._id || ""
      );
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

      if (!invoice) throw new Error("Invoice / Order ID is required for Steadfast order creation");
      if (!recipientName) throw new Error("Recipient name is required for Steadfast delivery");
      if (!recipientPhone) throw new Error("Recipient phone is required for Steadfast delivery");
      if (!recipientAddress) throw new Error("Recipient address is required for Steadfast delivery");

      // Calculate amount to collect: 0 if paid online, else total payable
      let codAmount = 0;
      if (
        orderData.paymentStatus === "COMPLETED" ||
        orderData.paymentMethod === "Online" ||
        orderData.cod_amount === 0
      ) {
        codAmount = 0;
      } else if (orderData.cod_amount !== undefined) {
        codAmount = Number(orderData.cod_amount);
      } else if (orderData.totalPrice !== undefined) {
        codAmount = Number(orderData.totalPrice);
      }

      const payload = {
        invoice: invoice.trim(),
        recipient_name: recipientName.trim(),
        recipient_phone: recipientPhone.trim(),
        recipient_address: recipientAddress.trim(),
        cod_amount: codAmount,
        note: orderData.note || orderData.special_instruction || "",
      };

      const url = `${this.config.baseUrl}/create_order`;

      let response;
      try {
        response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      } catch (fetchErr) {
        throw new Error(
          `Unable to connect to Steadfast Courier API (${fetchErr.message}). Please verify network connection or Steadfast API credentials in server/.env`
        );
      }

      const rawText = await response.text();
      let responseData;
      try {
        responseData = rawText ? JSON.parse(rawText) : {};
      } catch (parseErr) {
        responseData = { message: rawText || `HTTP ${response.status} ${response.statusText}` };
      }

      if (!response.ok || responseData.status !== 200) {
        if (rawText && rawText.includes("Account is not active")) {
          throw new Error(
            "Steadfast Courier API: Your merchant account is not yet active. Please contact Steadfast / Packzy support to activate API access."
          );
        }
        console.error("Steadfast Order Creation Failed:", {
          status: response.status,
          payload,
          response: responseData,
        });
        throw new Error(
          `Steadfast Order Creation Failed: ${responseData?.message || JSON.stringify(responseData?.errors || responseData)}`
        );
      }

      const consignment = responseData.consignment || {};
      const consignmentId = consignment.consignment_id || responseData.consignment_id;
      const trackingCode = consignment.tracking_code || responseData.tracking_code;

      // Update Order in MongoDB if matching order found
      if (invoice) {
        await OrderSchema.findOneAndUpdate(
          {
            $or: [
              { orderId: invoice },
              ...(typeof invoice === "string" && invoice.match(/^[0-9a-fA-F]{24}$/)
                ? [{ _id: invoice }]
                : []),
            ],
          },
          {
            $set: {
              consignmentId: String(consignmentId),
              courierName: "steadfast",
              courierStatus: consignment.status || "in_review",
              courierTrackingData: {
                ...consignment,
                tracking_code: trackingCode,
                tracking_url: consignmentId ? `https://steadfast.com.bd/t/${consignmentId}` : null,
              },
            },
          }
        ).catch((err) => {
          console.warn("Could not auto-link Steadfast consignment to order in DB:", err.message);
        });
      }

      return {
        success: true,
        consignment_id: consignmentId,
        tracking_code: trackingCode,
        data: consignment,
      };
    } catch (error) {
      console.error("SteadfastService.createOrder Exception:", error.message);
      throw error;
    }
  }

  /**
   * Tracks an order using consignment ID
   * @param {string|number} consignmentId
   */
  async trackByConsignmentId(consignmentId) {
    const headers = this.getHeaders();
    const url = `${this.config.baseUrl}/status_by_cid/${consignmentId}`;

    const response = await fetch(url, { method: "GET", headers });
    const data = await response.json();

    if (!response.ok || data.status !== 200) {
      throw new Error(`Steadfast tracking failed: ${data?.message || JSON.stringify(data)}`);
    }

    return data;
  }

  /**
   * Tracks an order using Invoice / Order ID
   * @param {string} invoice
   */
  async trackByInvoice(invoice) {
    const headers = this.getHeaders();
    const url = `${this.config.baseUrl}/status_by_invoice/${invoice}`;

    const response = await fetch(url, { method: "GET", headers });
    const data = await response.json();

    if (!response.ok || data.status !== 200) {
      throw new Error(`Steadfast tracking failed: ${data?.message || JSON.stringify(data)}`);
    }

    return data;
  }

  /**
   * Tracks an order using Tracking Code
   * @param {string} trackingCode
   */
  async trackByTrackingCode(trackingCode) {
    const headers = this.getHeaders();
    const url = `${this.config.baseUrl}/status_by_trackingcode/${trackingCode}`;

    const response = await fetch(url, { method: "GET", headers });
    const data = await response.json();

    if (!response.ok || data.status !== 200) {
      throw new Error(`Steadfast tracking failed: ${data?.message || JSON.stringify(data)}`);
    }

    return data;
  }

  /**
   * Checks fraud statistics for a customer phone number
   * @param {string} phone
   */
  async checkFraud(phone) {
    const headers = this.getHeaders();
    const url = `${this.config.baseUrl}/fraud_check/${phone}`;

    const response = await fetch(url, { method: "GET", headers });
    const data = await response.json();
    return data;
  }

  /**
   * Checks current Steadfast merchant account balance
   */
  async getCurrentBalance() {
    const headers = this.getHeaders();
    const url = `${this.config.baseUrl}/get_balance`;

    const response = await fetch(url, { method: "GET", headers });
    const data = await response.json();
    return data;
  }
}

module.exports = new SteadfastService();
