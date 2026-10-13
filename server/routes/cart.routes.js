import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { addToCart, getCart, removeFromCart, updateCartQuantity } from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getCart);
router.post("/:productId", authMiddleware, addToCart);
router.patch("/:productId", authMiddleware, updateCartQuantity);
router.delete("/:productId", authMiddleware, removeFromCart);

export default router;
