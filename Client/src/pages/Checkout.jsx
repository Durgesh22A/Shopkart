import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { axiosInstance } from "../axiosCalls/axios";

const initialAddress = { fullName: "", phone: "", addressLine1: "", city: "", state: "", pincode: "" };
const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const loadRazorpay = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
});

function Checkout() {
    const navigate = useNavigate();
    const { cartItems, loading: cartLoading, subtotal, itemCount, clearCartLocally } = useCart();
    const [shippingAddress, setShippingAddress] = useState(initialAddress);
    const [error, setError] = useState("");
    const [placing, setPlacing] = useState(false);

    useEffect(() => { if (!cartLoading && cartItems.length === 0) navigate("/cart", { replace: true }); }, [cartLoading, cartItems.length, navigate]);

    const updateField = (event) => setShippingAddress((current) => ({ ...current, [event.target.name]: event.target.value }));
    const validate = () => Object.values(shippingAddress).every((value) => value.trim()) && /^[1-9][0-9]{5}$/.test(shippingAddress.pincode) && /^[0-9+()\-\s]{7,20}$/.test(shippingAddress.phone);

    const placeOrder = async (event) => {
        event.preventDefault();
        if (!validate()) return setError("Please complete all delivery fields with a valid phone number and 6-digit pincode.");
        setError(""); setPlacing(true);
        try {
            const loaded = await loadRazorpay();
            if (!loaded) throw new Error("Razorpay checkout could not be loaded. Check your internet connection and try again.");
            const { data } = await axiosInstance.post("/orders/create-payment-order", { shippingAddress });
            const checkout = new window.Razorpay({
                key: data.key, amount: data.amount, currency: data.currency, name: "ShopKart", description: "ShopKart Order", order_id: data.razorpayOrderId,
                prefill: { name: shippingAddress.fullName, contact: shippingAddress.phone }, theme: { color: "#111111" },
                handler: async (payment) => {
                    try {
                        const verification = await axiosInstance.post("/orders/verify-payment", { shopKartOrderId: data.shopKartOrderId, ...payment });
                        clearCartLocally();
                        navigate(`/order-success/${verification.data.order._id}`, { state: { order: verification.data.order } });
                    } catch (requestError) { setError(requestError.response?.data?.message || "Payment could not be verified. Your cart is still available."); }
                    finally { setPlacing(false); }
                },
                modal: { ondismiss: () => setPlacing(false) }
            });
            checkout.on("payment.failed", () => { setError("Payment failed. Your cart is still available—please try again."); setPlacing(false); });
            checkout.open();
        } catch (requestError) { setError(requestError.response?.data?.message || requestError.message || "Unable to start checkout."); setPlacing(false); }
    };

    if (cartLoading) return <div className="min-h-screen bg-[#f5f5f7]"><Navbar /><div className="grid place-items-center min-h-80 text-gray-500">Loading checkout...</div></div>;

    return <div className="min-h-screen bg-[#f5f5f7]"><Navbar /><main className="max-w-6xl mx-auto px-6 py-12"><p className="text-sm uppercase tracking-[.25em] text-gray-400 font-semibold">Secure checkout</p><h1 className="text-4xl font-bold mt-2">Delivery details</h1><div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-7 mt-9 items-start"><form onSubmit={placeOrder} className="bg-white p-7 sm:p-9 rounded-3xl shadow-sm border border-gray-100"><h2 className="text-xl font-bold">Shipping address</h2>{error && <p className="mt-5 p-4 rounded-xl bg-red-50 text-red-600 text-sm">{error}</p>}<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">{[["fullName","Full name","text"],["phone","Phone number","tel"],["addressLine1","Address line","text"],["city","City","text"],["state","State","text"],["pincode","Pincode","text"]].map(([name,label,type]) => <label key={name} className={name === "addressLine1" ? "sm:col-span-2" : ""}><span className="block text-sm font-semibold text-gray-700 mb-2">{label}</span><input required name={name} type={type} value={shippingAddress[name]} onChange={updateField} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-black" /></label>)}</div><button disabled={placing} className="mt-8 w-full bg-black text-white py-4 rounded-xl font-semibold disabled:bg-gray-400">{placing ? "Opening secure payment..." : `Pay ${money(subtotal)} securely`}</button></form><aside className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 lg:sticky lg:top-6"><h2 className="text-xl font-bold">Your order</h2><div className="mt-5 space-y-4">{cartItems.map(({ product, quantity }) => product && <div key={product._id} className="flex gap-3 text-sm"><img src={product.image} alt="" className="w-12 h-12 object-contain bg-gray-50 rounded-lg" /><p className="flex-1 font-medium">{product.name} <span className="text-gray-400">× {quantity}</span></p><span>{money(product.price * quantity)}</span></div>)}</div><div className="mt-6 pt-5 border-t border-gray-100 flex justify-between font-bold text-lg"><span>Total ({itemCount} items)</span><span>{money(subtotal)}</span></div></aside></div></main></div>;
}

export default Checkout;
