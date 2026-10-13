import crypto from "crypto";
import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import razorpay from "../config/razorpay.js";

const requiredAddressFields = ["fullName", "phone", "addressLine1", "city", "state", "pincode"];

const normalizeAddress = (address = {}) => requiredAddressFields.reduce((result, field) => {
    result[field] = typeof address[field] === "string" ? address[field].trim() : "";
    return result;
}, {});

const isValidAddress = (address) => requiredAddressFields.every((field) => address[field])
    && /^[1-9][0-9]{5}$/.test(address.pincode)
    && /^[0-9+()\-\s]{7,20}$/.test(address.phone);

const getFreshCart = async (customerId) => {
    const customer = await Customer.findById(customerId).populate("cart.product");
    if (!customer) throw new Error("Customer not found");
    if (!customer.cart?.length) {
        const error = new Error("Your cart is empty");
        error.statusCode = 400;
        throw error;
    }

    const items = [];
    for (const cartItem of customer.cart) {
        const product = cartItem.product;
        if (!product) {
            const error = new Error("A product in your cart is no longer available");
            error.statusCode = 400;
            throw error;
        }
        if (cartItem.quantity > product.stock) {
            const error = new Error(`${product.name} no longer has enough stock`);
            error.statusCode = 400;
            throw error;
        }
        items.push({
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: cartItem.quantity,
            image: product.image
        });
    }

    return { customer, items, totalAmount: items.reduce((total, item) => total + item.price * item.quantity, 0) };
};

export const createPaymentOrder = async (req, res) => {
    let shopKartOrder;
    try {
        const shippingAddress = normalizeAddress(req.body.shippingAddress);
        if (!isValidAddress(shippingAddress)) {
            return res.status(400).json({ success: false, message: "Please enter a complete delivery address, valid phone number and 6-digit pincode" });
        }

        const { items, totalAmount } = await getFreshCart(req.user._id);
        shopKartOrder = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            totalAmount
        });

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: shopKartOrder._id.toString()
        });

        shopKartOrder.razorpayOrderId = razorpayOrder.id;
        await shopKartOrder.save();

        return res.status(201).json({
            success: true,
            shopKartOrderId: shopKartOrder._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        if (shopKartOrder && !shopKartOrder.razorpayOrderId) await Order.findByIdAndDelete(shopKartOrder._id);
        console.error("Create payment order error:", error);
        return res.status(error.statusCode || 502).json({
            success: false,
            message: error.message === "Customer not found" ? "Unable to create order" : error.message
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!mongoose.Types.ObjectId.isValid(shopKartOrderId) || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Incomplete payment verification data" });
        }

        const order = await Order.findOne({ _id: shopKartOrderId, user: req.user._id });
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        if (order.paymentStatus === "PAID") return res.status(200).json({ success: true, message: "Payment already verified", order });
        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({ success: false, message: "Payment order does not match this order" });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
            .digest("hex");
        const validSignature = expectedSignature.length === razorpay_signature.length
            && crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature));
        if (!validSignature) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        // Recheck and atomically deduct stock after Razorpay's signature is trusted.
        for (const item of order.items) {
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: item.product, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true }
            );
            if (!updatedProduct) {
                return res.status(400).json({ success: false, message: `${item.name} is no longer available in the requested quantity. Please contact support for payment assistance.` });
            }
        }

        order.paymentStatus = "PAID";
        order.status = "PLACED";
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();

        const customer = await Customer.findById(req.user._id);
        customer.cart = [];
        await customer.save();

        return res.status(200).json({ success: true, message: "Payment verified and order placed", order });
    } catch (error) {
        console.error("Verify payment error:", error);
        return res.status(500).json({ success: false, message: "Unable to verify payment" });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Get orders error:", error);
        return res.status(500).json({ success: false, message: "Unable to load orders" });
    }
};

export const getOrderById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid order ID" });
        }
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        return res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Get order error:", error);
        return res.status(500).json({ success: false, message: "Unable to load order" });
    }
};
