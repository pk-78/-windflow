import express from "express"
import { addToCart, changeOrderStatus, editUser, getAllOrders, orderProduct, updateAddress, userLogin, userSignup } from "../controllers/user.controller.js"


const router= express.Router()

router.post("/userSignup", userSignup);
router.put("/updateAddress/:id", updateAddress);
router.put("/editUser/:id", editUser);
router.post("/userLogin", userLogin)
router.post("/addToCart/:id", addToCart)
router.post("/orderProduct/:id", orderProduct)
router.get("/getAllOrders/:id", getAllOrders)
router.post("/changeOrderStatus/:id",changeOrderStatus )

export default router;

