import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";


export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const customer = req.user;

        const alreadyExists = customer.wishlist?.some(
            (id) => id.toString() === productId
        );

        if (alreadyExists) {
            return res.status(409).json({
                success: false,
                message: "Product already in wishlist"
            });
        }

        customer.wishlist.push(product._id);

        await customer.save();

        return res.status(201).json({
            success: true,
            message: "Product added to wishlist"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id)
            .populate({
                path: "wishlist",
                select: "name description price category image stock createdAt"
            });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        const wishlist = customer.wishlist || [];

        return res.status(200).json({
            success: true,
            count: wishlist.length,
            wishlist
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const customer = req.user;

        const wishlist = customer.wishlist || [];

        const exists = wishlist.some(
            (id) => id.toString() === productId
        );

        if (!exists) {
            return res.status(404).json({
                success: false,
                message: "Product not found in wishlist"
            });
        }

        customer.wishlist = wishlist.filter(
            (id) => id.toString() !== productId
        );

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};