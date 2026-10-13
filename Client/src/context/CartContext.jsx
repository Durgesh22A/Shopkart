import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../axiosCalls/axios";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pendingIds, setPendingIds] = useState(new Set());

    const refreshCart = useCallback(async ({ silent = false } = {}) => {
        if (!silent) setLoading(true);
        setError("");
        try {
            const response = await axiosInstance.get("/cart");
            setCartItems(response.data.cart || []);
            return response.data.cart || [];
        } catch (requestError) {
            setCartItems([]);
            if (requestError.response?.status !== 401) setError("Unable to load your cart.");
            return [];
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    useEffect(() => { refreshCart(); }, [refreshCart]);

    const runCartAction = useCallback(async (productId, request) => {
        setPendingIds((current) => new Set(current).add(productId));
        setError("");
        try {
            const response = await request();
            setCartItems(response.data.cart || []);
            return response.data.cart || [];
        } catch (requestError) {
            const message = requestError.response?.data?.message || "Unable to update your cart.";
            setError(message);
            throw new Error(message);
        } finally {
            setPendingIds((current) => {
                const next = new Set(current);
                next.delete(productId);
                return next;
            });
        }
    }, []);

    const value = useMemo(() => ({
        cartItems,
        loading,
        error,
        refreshCart,
        addToCart: (productId) => runCartAction(productId, () => axiosInstance.post(`/cart/${productId}`)),
        updateQuantity: (productId, quantity) => runCartAction(productId, () => axiosInstance.patch(`/cart/${productId}`, { quantity })),
        removeFromCart: (productId) => runCartAction(productId, () => axiosInstance.delete(`/cart/${productId}`)),
        isPending: (productId) => pendingIds.has(productId),
        clearCartLocally: () => setCartItems([]),
        itemCount: cartItems.reduce((total, item) => total + item.quantity, 0),
        subtotal: cartItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0)
    }), [cartItems, loading, error, refreshCart, runCartAction, pendingIds]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used inside CartProvider");
    return context;
}
