import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createPaymentOrder, getOrderById, getOrders, verifyPayment } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create-payment-order", authMiddleware, createPaymentOrder);
router.post("/verify-payment", authMiddleware, verifyPayment);
router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrderById);

export default router;
