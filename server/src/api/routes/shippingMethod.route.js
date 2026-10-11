const { Router } = require("express");
const controller = require("../../modules/shippingMethod/shipping.method.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const ShippingMethodRoute = Router();

// Uncomment the line below if JWT authentication is required
// ShippingMethodRoute.use(jwtAuth());

ShippingMethodRoute.route("/")
  .post(upload.any(), controller.createShippingMethod)
  .get(controller.getAllShippingMethod);

ShippingMethodRoute.post("/create", upload.any(), controller.createShippingMethod);

ShippingMethodRoute.get("/pagination", controller.getShippingMethodWithPagination);

ShippingMethodRoute.put("/status/:id", controller.updateShippingMethodStatus);

ShippingMethodRoute.route("/:id")
  .get(controller.getSingleShippingMethod)
  .put(upload.any(), controller.updateShippingMethod)
  .delete(controller.deleteShippingMethod);

module.exports = ShippingMethodRoute;
