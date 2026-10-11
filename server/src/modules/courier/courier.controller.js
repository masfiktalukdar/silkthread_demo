const pathaoConfig = require("../../config/pathao.config.js");
const steadfastConfig = require("../../config/steadfast.config.js");
const pathaoService = require("./pathao.service.js");
const steadfastService = require("./steadfast.service.js");
const { OrderSchema } = require("../../models/order/orderSchema.js");
const responseHandler = require("../../utils/responseHandler.js");
const catchError = require("../../middleware/errors/catchError.js");

// Status mapping helper for Pathao
const mapPathaoStatusToInternal = (pathaoStatus) => {
  if (!pathaoStatus) return "OrderPlaced";
  const s = String(pathaoStatus).toLowerCase().replace(/[\s_-]+/g, "");
  switch (s) {
    case "pending":
    case "accepted":
      return "OrderPlaced";
    case "picked":
    case "intransit":
    case "readyfordelivery":
    case "assigned":
      return "DeliveredPending";
    case "delivered":
    case "partialdelivered":
      return "Delivered";
    case "returned":
    case "cancelled":
    case "return":
      return "Cancelled";
    case "hold":
    case "onhold":
      return "Hold";
    default:
      return "InReview";
  }
};

// Status mapping helper for Steadfast
const mapSteadfastStatusToInternal = (steadfastStatus) => {
  if (!steadfastStatus) return "OrderPlaced";
  const s = String(steadfastStatus).toLowerCase().replace(/[\s_-]+/g, "");
  switch (s) {
    case "pending":
    case "inreview":
      return "OrderPlaced";
    case "deliveredapprovalpending":
    case "partialdeliveredapprovalpending":
      return "DeliveredPending";
    case "delivered":
    case "partialdelivered":
      return "Delivered";
    case "cancelled":
    case "cancelledapprovalpending":
      return "Cancelled";
    case "hold":
      return "Hold";
    default:
      return "InReview";
  }
};

class CourierController {
  /**
   * Pathao Webhook Receiver
   * Handles incoming delivery status updates from Pathao Aladdin API
   */
  handlePathaoWebhook = async (req, res) => {
    try {
      // 1. Security Check
      const secretHeader =
        req.headers["x-webhook-secret"] ||
        req.headers["x-pathao-signature"] ||
        req.headers["x-pathao-secret"] ||
        req.query.secret ||
        req.body?.webhook_secret;

      if (pathaoConfig.webhookSecret && secretHeader !== pathaoConfig.webhookSecret) {
        console.warn("Pathao Webhook: Unauthorized attempt with secret:", secretHeader);
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid webhook secret",
        });
      }

      const {
        consignment_id,
        merchant_order_id,
        order_status,
        order_status_slug,
        updated_at,
      } = req.body || {};

      console.log("Pathao Webhook Received:", {
        consignment_id,
        merchant_order_id,
        order_status,
        updated_at,
      });

      if (!consignment_id && !merchant_order_id) {
        // Still return 200 to prevent infinite webhook retries, but acknowledge missing IDs
        return res.status(200).json({
          success: true,
          message: "Webhook received but missing consignment_id / merchant_order_id",
        });
      }

      // 2. Find order in MongoDB
      const query = {
        $or: [
          ...(consignment_id ? [{ consignmentId: String(consignment_id) }] : []),
          ...(merchant_order_id ? [{ orderId: String(merchant_order_id) }] : []),
          ...(typeof merchant_order_id === "string" && merchant_order_id.match(/^[0-9a-fA-F]{24}$/)
            ? [{ _id: merchant_order_id }]
            : []),
        ],
      };

      const order = await OrderSchema.findOne(query);

      if (!order) {
        console.warn("Pathao Webhook: No matching order found for", {
          consignment_id,
          merchant_order_id,
        });
        return res.status(200).json({
          success: true,
          message: "Webhook processed: order not found in database",
        });
      }

      // 3. Update order statuses
      const newStatus = mapPathaoStatusToInternal(order_status);
      order.courierName = "pathao";
      order.courierStatus = order_status;
      order.status = newStatus;

      // If delivered via COD, mark payment as completed
      if (
        (order_status?.toLowerCase() === "delivered" || newStatus === "Delivered") &&
        order.paymentMethod === "CashOnDelivery"
      ) {
        order.paymentStatus = "COMPLETED";
      }

      order.courierTrackingData = {
        ...(order.courierTrackingData || {}),
        ...req.body,
        last_webhook_received_at: new Date().toISOString(),
        tracking_url: `https://merchant.pathao.com/tracking?consignment_id=${consignment_id || order.consignmentId}`,
      };

      if (consignment_id && !order.consignmentId) {
        order.consignmentId = String(consignment_id);
      }

      await order.save();

      console.log(`Pathao Webhook: Order ${order.orderId} updated to [${newStatus}] (Courier: ${order_status})`);

      return res.status(200).json({
        success: true,
        message: "Pathao delivery status updated successfully",
        orderId: order.orderId,
        status: order.status,
      });
    } catch (error) {
      console.error("Pathao Webhook Handler Error:", error);
      // Return 200 to prevent webhook flood retries from Pathao
      return res.status(200).json({
        success: false,
        error: error.message,
      });
    }
  };

  /**
   * Steadfast Webhook Receiver
   * Handles incoming delivery status updates from Steadfast Courier API
   */
  handleSteadfastWebhook = async (req, res) => {
    try {
      // 1. Security Check
      const secretHeader =
        req.headers["x-webhook-secret"] ||
        req.headers["x-steadfast-secret"] ||
        req.query.secret ||
        req.body?.webhook_secret;

      if (steadfastConfig.webhookSecret && secretHeader !== steadfastConfig.webhookSecret) {
        console.warn("Steadfast Webhook: Unauthorized attempt with secret:", secretHeader);
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid webhook secret",
        });
      }

      const {
        consignment_id,
        invoice,
        status,
        tracking_code,
        updated_at,
      } = req.body || {};

      console.log("Steadfast Webhook Received:", {
        consignment_id,
        invoice,
        status,
        tracking_code,
        updated_at,
      });

      if (!consignment_id && !invoice) {
        return res.status(200).json({
          success: true,
          message: "Webhook received but missing consignment_id / invoice",
        });
      }

      // 2. Find order in MongoDB
      const query = {
        $or: [
          ...(consignment_id ? [{ consignmentId: String(consignment_id) }] : []),
          ...(invoice ? [{ orderId: String(invoice) }] : []),
          ...(typeof invoice === "string" && invoice.match(/^[0-9a-fA-F]{24}$/)
            ? [{ _id: invoice }]
            : []),
        ],
      };

      const order = await OrderSchema.findOne(query);

      if (!order) {
        console.warn("Steadfast Webhook: No matching order found for", {
          consignment_id,
          invoice,
        });
        return res.status(200).json({
          success: true,
          message: "Webhook processed: order not found in database",
        });
      }

      // 3. Update order statuses
      const newStatus = mapSteadfastStatusToInternal(status);
      order.courierName = "steadfast";
      order.courierStatus = status;
      order.status = newStatus;

      // If delivered via COD, mark payment as completed
      if (
        (status?.toLowerCase() === "delivered" || newStatus === "Delivered") &&
        order.paymentMethod === "CashOnDelivery"
      ) {
        order.paymentStatus = "COMPLETED";
      }

      order.courierTrackingData = {
        ...(order.courierTrackingData || {}),
        ...req.body,
        last_webhook_received_at: new Date().toISOString(),
        tracking_code: tracking_code || order.courierTrackingData?.tracking_code,
        tracking_url: `https://steadfast.com.bd/t/${consignment_id || order.consignmentId}`,
      };

      if (consignment_id && !order.consignmentId) {
        order.consignmentId = String(consignment_id);
      }

      await order.save();

      console.log(`Steadfast Webhook: Order ${order.orderId} updated to [${newStatus}] (Courier: ${status})`);

      return res.status(200).json({
        success: true,
        message: "Steadfast delivery status updated successfully",
        orderId: order.orderId,
        status: order.status,
      });
    } catch (error) {
      console.error("Steadfast Webhook Handler Error:", error);
      return res.status(200).json({
        success: false,
        error: error.message,
      });
    }
  };

  /**
   * Public Order Tracking Endpoint
   * Accepts orderId, consignmentId, or phone number and returns tracking progress.
   */
  trackOrderPublic = catchError(async (req, res) => {
    const { identifier } = req.params;
    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Tracking identifier is required",
      });
    }

    const cleanId = String(identifier).trim();

    const order = await OrderSchema.findOne({
      $or: [
        { orderId: cleanId },
        { consignmentId: cleanId },
        { customerPhone: cleanId },
        { "courierTrackingData.tracking_code": cleanId },
        ...(cleanId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: cleanId }] : []),
      ],
    })
      .populate("products.productRef", "name thumbnailImage price")
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found. Please verify your Order ID or Consignment ID.",
      });
    }

    // Determine live tracking URL and sync live status if available
    let trackingUrl = null;
    if (order.consignmentId) {
      if (order.courierName === "pathao") {
        trackingUrl = `https://merchant.pathao.com/tracking?consignment_id=${order.consignmentId}`;
      } else if (order.courierName === "steadfast") {
        trackingUrl = `https://steadfast.com.bd/t/${order.consignmentId}`;
      }
    }

    if (order.courierName === "steadfast") {
      try {
        let liveData = null;
        if (order.consignmentId) {
          liveData = await steadfastService.trackByConsignmentId(order.consignmentId);
        } else if (order.orderId) {
          liveData = await steadfastService.trackByInvoice(order.orderId);
        }
        if (liveData && liveData.delivery_status) {
          order.courierStatus = liveData.delivery_status;
          order.courierTrackingData = liveData;
          await OrderSchema.findByIdAndUpdate(order._id, {
            courierStatus: liveData.delivery_status,
            courierTrackingData: liveData,
          });
        }
      } catch (liveErr) {
        // Fall back to database tracking data if live API is pending or inactive
      }
    }

    const trackingResult = {
      orderId: order.orderId,
      customerName: order.customerName,
      customerAddress: order.customerAddress,
      customerPhone: order.customerPhone ? order.customerPhone.slice(0, 4) + "****" + order.customerPhone.slice(-3) : "",
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      courierName: order.courierName || (order.consignmentId ? "courier" : null),
      consignmentId: order.consignmentId || null,
      courierStatus: order.courierStatus || null,
      trackingUrl,
      courierTrackingData: order.courierTrackingData || null,
      products: order.products || [],
    };

    const resDoc = responseHandler(200, "Order tracking info retrieved", trackingResult);
    return res.status(resDoc.statusCode).json(resDoc);
  });

  /**
   * Admin: Dispatch order to Pathao
   */
  sendToPathao = catchError(async (req, res) => {
    const { orderId } = req.params;
    const order = await OrderSchema.findOne({
      $or: [
        { orderId },
        ...(orderId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: orderId }] : []),
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const result = await pathaoService.createOrder({
      ...order.toObject(),
      ...req.body,
    });

    const resDoc = responseHandler(200, "Order dispatched to Pathao Courier", result);
    return res.status(resDoc.statusCode).json(resDoc);
  });

  /**
   * Admin: Dispatch order to Steadfast
   */
  sendToSteadfast = catchError(async (req, res) => {
    const { orderId } = req.params;
    const order = await OrderSchema.findOne({
      $or: [
        { orderId },
        ...(orderId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: orderId }] : []),
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const result = await steadfastService.createOrder({
      ...order.toObject(),
      ...req.body,
    });

    const resDoc = responseHandler(200, "Order dispatched to Steadfast Courier", result);
    return res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new CourierController();
