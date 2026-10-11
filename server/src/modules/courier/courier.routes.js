const express = require("express");
const courierController = require("./courier.controller.js");
const { pathaoService, steadfastService } = require("./index.js");
const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");

const router = express.Router();

// ----------------- Webhooks -----------------
// Pathao Courier Webhook (Delivery status update)
router.post("/webhooks/pathao", courierController.handlePathaoWebhook);

// Steadfast Courier Webhook (Delivery status update)
router.post("/webhooks/steadfast", courierController.handleSteadfastWebhook);

// ----------------- Public Tracking -----------------
// Public lookup for customer tracking (by orderId, consignmentId, or phone)
router.get("/track/:identifier", courierController.trackOrderPublic);

// ----------------- Courier Dispatch (Admin) -----------------
router.post("/send/pathao/:orderId", courierController.sendToPathao);
router.post("/send/steadfast/:orderId", courierController.sendToSteadfast);

// ----------------- Pathao Delivery Geography & Stores -----------------
router.get(
  "/pathao/stores",
  catchError(async (req, res) => {
    const stores = await pathaoService.getStores();
    const resDoc = responseHandler(200, "Pathao stores", stores);
    res.status(resDoc.statusCode).json(resDoc);
  })
);

router.get(
  "/pathao/cities",
  catchError(async (req, res) => {
    const cities = await pathaoService.getCities();
    const resDoc = responseHandler(200, "Pathao cities", cities);
    res.status(resDoc.statusCode).json(resDoc);
  })
);

router.get(
  "/pathao/zones/:cityId",
  catchError(async (req, res) => {
    const zones = await pathaoService.getZones(req.params.cityId);
    const resDoc = responseHandler(200, "Pathao zones", zones);
    res.status(resDoc.statusCode).json(resDoc);
  })
);

router.get(
  "/pathao/areas/:zoneId",
  catchError(async (req, res) => {
    const areas = await pathaoService.getAreas(req.params.zoneId);
    const resDoc = responseHandler(200, "Pathao areas", areas);
    res.status(resDoc.statusCode).json(resDoc);
  })
);

// ----------------- Steadfast Utilities -----------------
router.get(
  "/steadfast/balance",
  catchError(async (req, res) => {
    const balance = await steadfastService.getCurrentBalance();
    const resDoc = responseHandler(200, "Steadfast balance", balance);
    res.status(resDoc.statusCode).json(resDoc);
  })
);

module.exports = router;
