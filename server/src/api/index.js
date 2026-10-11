const AuthRouter = require("./routes/auth.route.js");
const BannerRouter = require("./routes/banner.route.js");
const AboutUsRouter = require("./routes/aboutUs.route.js");
const BrandRouter = require("./routes/brand.route.js");
const CategoryRouter = require("./routes/category.route.js");
const ContactRouter = require("./routes/contactInfo.route.js");
const CouponRouter = require("./routes/coupon.route.js");
const InventoryRouter = require("./routes/inventory.route.js");
const OrderRouter = require("./routes/order.route.js");
const PolicyRouter = require("./routes/policy.route.js");
const ProductRouter = require("./routes/product.route.js");
const SubCategoryRouter = require("./routes/subCategory.route.js");
const ChildCategoryRouter = require("./routes/childCategory.route.js");
const SubChildCategoryRouter = require("./routes/subChildCategory.route.js");
const NewsletterRouter = require("./routes/newsletter.route.js");
const PaymentServiceConfigRouter = require("./routes/paymentServiceConfig.route.js");
const ShippingMethodRouter = require("./routes/shippingMethod.route.js");
const RoleRouter = require("./routes/role.route.js");
const ReportRoute = require("./routes/report.route.js");
const UserRouter = require("./routes/user.route.js");
const CartRouter = require("./routes/cart.route.js");
const WishlistRouter = require("./routes/wishlist.js");
const ProductReviewRouter = require("./routes/productReview.route.js");
const WarehouseRoute = require("./routes/warehouse.route.js");
const WarehouseTransferRoute = require("./routes/warehouseTransfer.route.js");
const OrderBulkRoute = require("./routes/order.bulk.route.js");
const Payment = require("./routes/payment.route.js");

const { Router } = require("express");
const CampaignRoute = require("./routes/campaign.route.js");
const rootRouter = Router();
rootRouter.use("/product", ProductRouter);
rootRouter.use("/auth", AuthRouter);
rootRouter.use("/banners", BannerRouter);
rootRouter.use("/about-us", AboutUsRouter);
rootRouter.use("/brand", BrandRouter);
rootRouter.use("/category", CategoryRouter);
rootRouter.use("/contact-info", ContactRouter);
rootRouter.use("/coupon", CouponRouter);
rootRouter.use("/inventory", InventoryRouter);
rootRouter.use("/order", OrderRouter);
rootRouter.use("/policy", PolicyRouter);
rootRouter.use("/newsletter", NewsletterRouter);
rootRouter.use("/sub-category", SubCategoryRouter);
rootRouter.use("/child-category", ChildCategoryRouter);
rootRouter.use("/sub-child-category", SubChildCategoryRouter);
rootRouter.use("/shipping-method", ShippingMethodRouter);
rootRouter.use("/shippingMethod", ShippingMethodRouter);
rootRouter.use("/payment-service-config", PaymentServiceConfigRouter);
rootRouter.use("/payment", Payment);
rootRouter.use("/role", RoleRouter);
rootRouter.use("/user", UserRouter);
rootRouter.use("/cart", CartRouter);
rootRouter.use("/newsletter", CartRouter);
rootRouter.use("/product-review", ProductReviewRouter);
rootRouter.use("/wish-list", WishlistRouter);
rootRouter.use("/report", ReportRoute);
rootRouter.use("/warehouse", WarehouseRoute);
const CourierRouter = require("../modules/courier/courier.routes.js");

rootRouter.use("/warehouse-transfer", WarehouseTransferRoute);
rootRouter.use("/order-bulk", OrderBulkRoute);
rootRouter.use("/campaign", CampaignRoute );
rootRouter.use("/courier", CourierRouter);

// Convenient root webhook aliases
rootRouter.post("/webhooks/pathao", (req, res, next) => {
  const courierController = require("../modules/courier/courier.controller.js");
  return courierController.handlePathaoWebhook(req, res, next);
});
rootRouter.post("/webhooks/steadfast", (req, res, next) => {
  const courierController = require("../modules/courier/courier.controller.js");
  return courierController.handleSteadfastWebhook(req, res, next);
});

// Convenient order tracking alias
rootRouter.get("/order/track/:identifier", (req, res, next) => {
  const courierController = require("../modules/courier/courier.controller.js");
  return courierController.trackOrderPublic(req, res, next);
});

module.exports = rootRouter;
