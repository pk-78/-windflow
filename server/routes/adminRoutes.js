import express from "express";
import { adminLogin, adminSignup, editAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/adminSignup", adminSignup);
router.post("/adminLogin", adminLogin);
router.put("/editAdmin/:id", editAdmin);

export default router;
