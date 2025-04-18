import express from "express";
import {
  addToCart,
  cancelOrder,
  editUser,
  getAllOrders,
  getCartItem,
  getOrderHistoryById,
  getOrdersByUserId,
  getUserAddress,
  getUserCartDetail,
  orderProduct,
  updateAddress,
  userLogin,
  userSignup,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/userSignup", userSignup);
router.put("/updateAddress/:id", updateAddress);
router.get("/getUserAddress/:id",getUserAddress)
router.put("/editUser/:id", editUser);
router.post("/userLogin", userLogin);
router.post("/addToCart/:id", addToCart);
router.post("/orderProduct/:id", orderProduct);
router.get("/getAllOrders/:id", getAllOrders);
router.post("/cancelOrder/:id", cancelOrder);
router.get("/getCart/:id", getCartItem);
router.get("/getCart/:id", getUserCartDetail);
router.get("/getOrdersHistory/:id", getOrdersByUserId);
router.get("/getOrderDetail/:id", getOrderHistoryById);

export default router;
