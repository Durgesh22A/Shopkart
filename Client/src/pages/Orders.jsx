import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { axiosInstance } from "../axiosCalls/axios";

const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadOrders = async () => {
        setLoading(true); setError("");
        try { const { data } = await axiosInstance.get("/orders"); setOrders(data.orders || []); }
        catch (requestError) { setError(requestError.response?.data?.message || "Unable to load your orders."); }
        finally { setLoading(false); }
    };
    useEffect(() => { loadOrders(); }, []);

    return <div className="min-h-screen bg-[#f5f5f7]"><Navbar /><main className="max-w-5xl mx-auto px-6 py-12"><p className="text-sm uppercase tracking-[.25em] text-gray-400 font-semibold">Order history</p><h1 className="text-4xl font-bold mt-2">My Orders</h1>{loading && <div className="min-h-80 grid place-items-center text-gray-500">Loading your orders...</div>}{!loading && error && <div className="mt-8 bg-white rounded-3xl p-10 text-center"><p className="text-red-600">{error}</p><button onClick={loadOrders} className="mt-5 bg-black text-white px-6 py-3 rounded-xl">Try Again</button></div>}{!loading && !error && orders.length === 0 && <div className="mt-8 bg-white rounded-3xl p-12 text-center"><p className="text-5xl">📦</p><h2 className="text-2xl font-bold mt-5">No orders yet</h2><p className="text-gray-500 mt-2">Your completed purchases will appear here.</p><button onClick={() => navigate("/products")} className="mt-6 bg-black text-white px-6 py-3 rounded-xl">Start Shopping</button></div>}{!loading && !error && orders.length > 0 && <section className="mt-8 space-y-5">{orders.map((order) => <article key={order._id} className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100"><div className="flex flex-wrap justify-between gap-4"><div><p className="text-xs tracking-wider text-gray-400 uppercase">Order #{order._id.slice(-8)}</p><p className="font-semibold mt-1">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p></div><span className={order.paymentStatus === "PAID" ? "bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold h-fit" : "bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-sm font-semibold h-fit"}>{order.status.replace("_", " ")}</span></div><div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap justify-between gap-4"><p className="text-gray-600">{order.items.reduce((total, item) => total + item.quantity, 0)} items · {order.items.map((item) => item.name).join(", ")}</p><p className="font-bold text-lg">{money(order.totalAmount)}</p></div></article>)}</section>}</main></div>;
}

export default Orders;
