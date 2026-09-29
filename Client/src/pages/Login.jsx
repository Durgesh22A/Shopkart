import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../axiosCalls/axios";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await axiosInstance.post("/customers/login", {
                email,
                password
            });

            navigate("/home");

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-5">

            <div className="w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

                {/* ================= LEFT SIDE ================= */}

                <div className="relative hidden lg:flex bg-black text-white min-h-[650px] p-14 flex-col justify-between overflow-hidden">

                    {/* Glow */}
                    <div className="absolute -top-32 -right-32 w-[450px] h-[450px] bg-purple-600/30 rounded-full blur-3xl"></div>

                    <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] bg-blue-600/20 rounded-full blur-3xl"></div>

                    {/* Content */}
                    <div className="relative z-10">

                        <div className="text-3xl font-bold tracking-tight">
                            ShopKart<span className="text-gray-500">.</span>
                        </div>

                        <p className="text-gray-500 text-sm mt-2">
                            Your everyday shopping destination
                        </p>

                    </div>

                    <div className="relative z-10 max-w-lg">

                        <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-5">
                            Welcome back
                        </p>

                        <h1 className="text-5xl font-bold leading-tight">
                            Everything you want.
                            <br />
                            <span className="text-gray-500">
                                All in one place.
                            </span>
                        </h1>

                        <p className="text-gray-400 mt-6 text-lg leading-relaxed">
                            Discover products you'll love, explore new
                            collections and make shopping simple.
                        </p>

                    </div>

                    {/* Bottom features */}
                    <div className="relative z-10 flex gap-8 text-sm text-gray-400">

                        <div>
                            <p className="text-white font-semibold">
                                01
                            </p>
                            <p className="mt-1">
                                Explore
                            </p>
                        </div>

                        <div>
                            <p className="text-white font-semibold">
                                02
                            </p>
                            <p className="mt-1">
                                Discover
                            </p>
                        </div>

                        <div>
                            <p className="text-white font-semibold">
                                03
                            </p>
                            <p className="mt-1">
                                Shop
                            </p>
                        </div>

                    </div>

                </div>

                {/* ================= RIGHT SIDE ================= */}

                <div className="p-8 sm:p-12 lg:p-16 flex items-center">

                    <div className="w-full max-w-md mx-auto">

                        {/* Mobile Logo */}
                        <div className="lg:hidden mb-10">

                            <h1 className="text-3xl font-bold">
                                ShopKart<span className="text-gray-400">.</span>
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Your everyday shopping destination
                            </p>

                        </div>

                        {/* Heading */}
                        <div className="mb-10">

                            <p className="text-sm uppercase tracking-[0.2em] text-gray-400 font-semibold">
                                Account
                            </p>

                            <h2 className="text-4xl font-bold text-gray-900 mt-3">
                                Welcome back.
                            </h2>

                            <p className="text-gray-500 mt-3">
                                Sign in to continue shopping with ShopKart.
                            </p>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-5">

                            {/* Email */}
                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-5 py-4 outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition"
                                />

                            </div>

                            {/* Password */}
                            <div>

                                <div className="flex justify-between items-center mb-2">

                                    <label className="text-sm font-semibold text-gray-700">
                                        Password
                                    </label>

                                </div>

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-5 py-4 outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition"
                                />

                            </div>

                            {/* Login */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 hover:shadow-lg active:scale-[0.99] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? "Signing in..." : "Sign In →"}
                            </button>

                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-8">

                            <div className="flex-1 h-px bg-gray-200"></div>

                            <span className="text-xs text-gray-400 uppercase tracking-widest">
                                New here?
                            </span>

                            <div className="flex-1 h-px bg-gray-200"></div>

                        </div>

                        {/* Register */}
                        <Link
                            to="/register"
                            className="block w-full text-center border border-gray-200 py-4 rounded-xl font-semibold text-gray-800 hover:bg-gray-50 transition"
                        >
                            Create an Account
                        </Link>

                        {/* Footer */}
                        <p className="text-center text-xs text-gray-400 mt-8">
                            Secure authentication powered by ShopKart
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;