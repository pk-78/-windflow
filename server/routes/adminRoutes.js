import express from "express";
import {
  adminLogin,
  adminSignup,
  changeOrderStatus,
  editAdmin,
  getCancelledOrders,
  getDeliveredOrders,
  getOrderById,
  getPendingOrders,
  getShippedOrders,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/adminSignup", adminSignup);
router.post("/adminLogin", adminLogin);
router.put("/editAdmin/:id", editAdmin);
router.get("/orders/pendingOrders", getPendingOrders);
router.get("/orders/shippedOrders", getShippedOrders);
router.get("/orders/deliveredOrders", getDeliveredOrders);
router.get("/orders/cancelledOrders", getCancelledOrders);
router.get("/orders/getOrder/:id", getOrderById);
router.post("/orders/orderStatus", changeOrderStatus);

export default router;
