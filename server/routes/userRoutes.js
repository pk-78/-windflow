import express from "express"
import { editUser, updateAddress, userLogin, userSignup } from "../controllers/user.controller.js"


const router= express.Router()

router.post("/userSignup", userSignup);
router.put("/updateAddress/:id", updateAddress);
router.put("/editUser/:id", editUser);
router.post("/userLogin", userLogin)

export default router;

