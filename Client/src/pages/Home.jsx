import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../axiosCalls/axios";
import Navbar from "../components/Navbar";

function Home() {
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axiosInstance.get("/customers/me");

                setCustomer(response.data.customer);
            } catch (error) {
                console.log(error);
                setError("Unable to load your profile.");

                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f5f7]">

                <Navbar />

                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center">

                        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>

                        <p className="mt-4 text-gray-500">
                            Loading your account...
                        </p>

                    </div>
                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f5f7]">

            <Navbar />

            {/* HERO */}
            <section className="relative overflow-hidden bg-black text-white">

                {/* Glow */}
                <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl"></div>

                <div className="absolute -bottom-40 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">

                    <div className="max-w-3xl">

                        <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
                            Welcome back
                        </p>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mt-5">
                            Hey, {customer?.fullName?.split(" ")[0]} 👋
                        </h1>

                        <p className="text-xl text-gray-400 mt-6 leading-relaxed">
                            Everything you need is right here.
                            Explore products, discover something new
                            and enjoy your ShopKart experience.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-9">

                            <button
                                onClick={() => navigate("/products")}
                                className="bg-white text-black px-7 py-4 rounded-2xl font-semibold hover:bg-gray-200 transition"
                            >
                                Explore Products →
                            </button>

                            <button
                                onClick={() =>
                                    document
                                        .getElementById("profile")
                                        ?.scrollIntoView({
                                            behavior: "smooth"
                                        })
                                }
                                className="border border-gray-700 px-7 py-4 rounded-2xl font-semibold hover:bg-white/10 transition"
                            >
                                View Profile
                            </button>

                        </div>

                    </div>

                </div>

            </section>

            {/* QUICK STATS */}
            <section className="max-w-7xl mx-auto px-6 -mt-8 relative">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    <div className="bg-white rounded-3xl p-7 shadow-lg border border-gray-100">

                        <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center text-xl">
                            🛍️
                        </div>

                        <p className="text-2xl font-bold mt-5">
                            Shop
                        </p>

                        <p className="text-gray-500 mt-1">
                            Browse our product collection
                        </p>

                    </div>

                    <div className="bg-white rounded-3xl p-7 shadow-lg border border-gray-100">

                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl">
                            ⚡
                        </div>

                        <p className="text-2xl font-bold mt-5">
                            Fast & Easy
                        </p>

                        <p className="text-gray-500 mt-1">
                            Find products in seconds
                        </p>

                    </div>

                    <div className="bg-white rounded-3xl p-7 shadow-lg border border-gray-100">

                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl">
                            🔒
                        </div>

                        <p className="text-2xl font-bold mt-5">
                            Secure
                        </p>

                        <p className="text-gray-500 mt-1">
                            Your account stays protected
                        </p>

                    </div>

                </div>

            </section>

            {/* PROFILE */}
            <section
                id="profile"
                className="max-w-7xl mx-auto px-6 py-16"
            >

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Profile Card */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10">

                        <div className="flex items-center gap-5 mb-10">

                            <div className="w-20 h-20 rounded-3xl bg-black text-white flex items-center justify-center text-3xl font-bold">
                                {customer?.fullName?.charAt(0)}
                            </div>

                            <div>
                                <p className="text-sm uppercase tracking-widest text-gray-400">
                                    Your Account
                                </p>

                                <h2 className="text-3xl font-bold mt-1">
                                    {customer?.fullName}
                                </h2>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div className="bg-[#f5f5f7] rounded-2xl p-5">

                                <p className="text-sm text-gray-400">
                                    Full Name
                                </p>

                                <p className="font-semibold text-lg mt-2">
                                    {customer?.fullName}
                                </p>

                            </div>

                            <div className="bg-[#f5f5f7] rounded-2xl p-5">

                                <p className="text-sm text-gray-400">
                                    Email Address
                                </p>

                                <p className="font-semibold text-lg mt-2 break-all">
                                    {customer?.email}
                                </p>

                            </div>

                            <div className="bg-[#f5f5f7] rounded-2xl p-5">

                                <p className="text-sm text-gray-400">
                                    Phone Number
                                </p>

                                <p className="font-semibold text-lg mt-2">
                                    {customer?.phone}
                                </p>

                            </div>

                            <div className="bg-[#f5f5f7] rounded-2xl p-5">

                                <p className="text-sm text-gray-400">
                                    Account Status
                                </p>

                                <p className="font-semibold text-green-600 text-lg mt-2">
                                    ● Active
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Side CTA */}
                    <div className="bg-black text-white rounded-3xl p-8 md:p-10 flex flex-col justify-between overflow-hidden relative">

                        <div className="absolute -right-20 -top-20 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl"></div>

                        <div className="relative">

                            <p className="text-gray-400 uppercase tracking-widest text-sm">
                                ShopKart
                            </p>

                            <h2 className="text-3xl font-bold mt-4 leading-tight">
                                Ready to discover something new?
                            </h2>

                            <p className="text-gray-400 mt-4 leading-relaxed">
                                Explore our growing collection of products.
                            </p>

                        </div>

                        <button
                            onClick={() => navigate("/products")}
                            className="relative mt-10 bg-white text-black py-4 rounded-2xl font-semibold hover:bg-gray-200 transition"
                        >
                            Start Shopping →
                        </button>

                    </div>

                </div>

            </section>

            {/* FOOTER */}
            <footer className="border-t border-gray-200">

                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-500">

                    <p>
                        © 2026 ShopKart
                    </p>

                    <p>
                        Built with React • Express • MongoDB
                    </p>

                </div>

            </footer>

        </div>
    );
}

export default Home;