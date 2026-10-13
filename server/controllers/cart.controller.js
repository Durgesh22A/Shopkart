import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

const populatedCart = async (customerId) => {
    const customer = await Customer.findById(customerId).populate({
        path: "cart.product",
        select: "name description price category image stock"
    });

    return customer?.cart?.filter((item) => item.product) || [];
};

const sendCart = async (res, customerId, status = 200, message) => {
    const cart = await populatedCart(customerId);
    return res.status(status).json({
        success: true,
        ...(message ? { message } : {}),
        cart
    });
};

export const getCart = async (req, res) => {
    try {
        return await sendCart(res, req.user._id);
    } catch (error) {
        console.error("Get cart error:", error);
        return res.status(500).json({ success: false, message: "Unable to load cart" });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const customer = req.user;
        customer.cart ||= [];
        const item = customer.cart.find((cartItem) => cartItem.product.toString() === productId);
        const nextQuantity = (item?.quantity || 0) + 1;

        if (nextQuantity > product.stock) {
            return res.status(400).json({ success: false, message: "Requested quantity exceeds available stock" });
        }

        if (item) item.quantity = nextQuantity;
        else customer.cart.push({ product: product._id, quantity: 1 });

        await customer.save();
        return await sendCart(res, customer._id, 200, "Cart updated");
    } catch (error) {
        console.error("Add to cart error:", error);
        return res.status(500).json({ success: false, message: "Unable to update cart" });
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const quantity = Number(req.body.quantity);
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }
        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ success: false, message: "Quantity must be a whole number of at least 1" });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        if (quantity > product.stock) {
            return res.status(400).json({ success: false, message: "Requested quantity exceeds available stock" });
        }

        const item = req.user.cart?.find((cartItem) => cartItem.product.toString() === productId);
        if (!item) return res.status(404).json({ success: false, message: "Product is not in your cart" });

        item.quantity = quantity;
        await req.user.save();
        return await sendCart(res, req.user._id, 200, "Cart quantity updated");
    } catch (error) {
        console.error("Update cart error:", error);
        return res.status(500).json({ success: false, message: "Unable to update cart" });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const initialLength = req.user.cart?.length || 0;
        req.user.cart = (req.user.cart || []).filter((item) => item.product.toString() !== productId);
        if (req.user.cart.length === initialLength) {
            return res.status(404).json({ success: false, message: "Product is not in your cart" });
        }

        await req.user.save();
        return await sendCart(res, req.user._id, 200, "Product removed from cart");
    } catch (error) {
        console.error("Remove from cart error:", error);
        return res.status(500).json({ success: false, message: "Unable to update cart" });
    }
};
