import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { axiosInstance } from "../axiosCalls/axios";

function OrderSuccess() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(location.state?.order || null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (order) return;
        axiosInstance.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).catch(() => setError("We couldn't find this order."));
    }, [id, order]);

    return <div className="min-h-screen bg-[#f5f5f7]"><Navbar /><main className="max-w-xl mx-auto px-6 py-16"><div className="bg-white rounded-[2rem] p-10 text-center shadow-sm border border-gray-100">{error ? <><p className="text-red-600">{error}</p><button onClick={() => navigate("/orders")} className="mt-6 bg-black text-white px-6 py-3 rounded-xl">View My Orders</button></> : !order ? <p className="text-gray-500">Loading order...</p> : <><div className="w-16 h-16 bg-green-100 text-green-700 rounded-full grid place-items-center text-3xl mx-auto">✓</div><p className="text-sm uppercase tracking-[.25em] text-gray-400 font-semibold mt-7">Payment verified</p><h1 className="text-3xl font-bold mt-3">Order placed successfully!</h1><p className="text-gray-500 mt-3">Thank you for shopping with ShopKart. Your cart has been cleared.</p><div className="mt-7 bg-gray-50 rounded-2xl p-5 text-left"><p className="text-sm text-gray-400">Order ID</p><p className="font-mono text-sm mt-1 break-all">{order._id}</p><p className="text-sm text-gray-400 mt-4">Delivery to</p><p className="font-semibold mt-1">{order.shippingAddress.fullName}, {order.shippingAddress.city}</p></div><div className="grid sm:grid-cols-2 gap-3 mt-7"><button onClick={() => navigate("/orders")} className="bg-black text-white px-5 py-3.5 rounded-xl font-semibold">View My Orders</button><button onClick={() => navigate("/products")} className="border border-gray-200 px-5 py-3.5 rounded-xl font-semibold">Continue Shopping</button></div></>}</div></main></div>;
}

export default OrderSuccess;
