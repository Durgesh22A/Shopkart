import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../axiosCalls/axios";

function Register() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await axiosInstance.post("/customers/register", {
                fullName,
                email,
                password,
                phone
            });

            navigate("/login");

        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-5">

            <div className="w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

                {/* ================= LEFT SIDE ================= */}

                <div className="relative hidden lg:flex bg-black text-white min-h-[720px] p-14 flex-col justify-between overflow-hidden">

                    {/* Glow effects */}
                    <div className="absolute -top-32 -right-32 w-[450px] h-[450px] bg-purple-600/30 rounded-full blur-3xl"></div>

                    <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] bg-blue-600/20 rounded-full blur-3xl"></div>

                    {/* Logo */}
                    <div className="relative z-10">

                        <div className="text-3xl font-bold tracking-tight">
                            ShopKart<span className="text-gray-500">.</span>
                        </div>

                        <p className="text-gray-500 text-sm mt-2">
                            Your everyday shopping destination
                        </p>

                    </div>

                    {/* Main message */}
                    <div className="relative z-10 max-w-lg">

                        <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-5">
                            Join ShopKart
                        </p>

                        <h1 className="text-5xl font-bold leading-tight">
                            Your shopping
                            <br />
                            <span className="text-gray-500">
                                journey starts here.
                            </span>
                        </h1>

                        <p className="text-gray-400 mt-6 text-lg leading-relaxed">
                            Create your account and discover a simple,
                            modern way to explore products you'll love.
                        </p>

                    </div>

                    {/* Features */}
                    <div className="relative z-10 grid grid-cols-3 gap-6">

                        <div>
                            <p className="text-2xl mb-2">
                                🛍️
                            </p>

                            <p className="text-sm font-semibold text-white">
                                Discover
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                New products
                            </p>
                        </div>

                        <div>
                            <p className="text-2xl mb-2">
                                ⚡
                            </p>

                            <p className="text-sm font-semibold text-white">
                                Simple
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                Easy shopping
                            </p>
                        </div>

                        <div>
                            <p className="text-2xl mb-2">
                                🔒
                            </p>

                            <p className="text-sm font-semibold text-white">
                                Secure
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                Protected account
                            </p>
                        </div>

                    </div>

                </div>

                {/* ================= RIGHT SIDE ================= */}

                <div className="p-8 sm:p-12 lg:p-14 flex items-center">

                    <div className="w-full max-w-md mx-auto">

                        {/* Mobile Logo */}
                        <div className="lg:hidden mb-9">

                            <h1 className="text-3xl font-bold">
                                ShopKart<span className="text-gray-400">.</span>
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Your everyday shopping destination
                            </p>

                        </div>

                        {/* Heading */}
                        <div className="mb-8">

                            <p className="text-sm uppercase tracking-[0.2em] text-gray-400 font-semibold">
                                Create Account
                            </p>

                            <h2 className="text-4xl font-bold text-gray-900 mt-3">
                                Get started.
                            </h2>

                            <p className="text-gray-500 mt-3">
                                Create your ShopKart account in a few seconds.
                            </p>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-5 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form
                            onSubmit={handleRegister}
                            className="space-y-4"
                        >

                            {/* Full Name */}
                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                    required
                                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-5 py-3.5 outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition"
                                />

                            </div>

                            {/* Email */}
                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-5 py-3.5 outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition"
                                />

                            </div>

                            {/* Phone */}
                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(e.target.value)
                                    }
                                    required
                                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-5 py-3.5 outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition"
                                />

                            </div>

                            {/* Password */}
                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    className="w-full bg-[#f5f5f7] border border-gray-200 rounded-xl px-5 py-3.5 outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition"
                                />

                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 hover:shadow-lg active:scale-[0.99] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed mt-2"
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account →"}
                            </button>

                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-7">

                            <div className="flex-1 h-px bg-gray-200"></div>

                            <span className="text-xs text-gray-400 uppercase tracking-widest">
                                Already a member?
                            </span>

                            <div className="flex-1 h-px bg-gray-200"></div>

                        </div>

                        {/* Login */}
                        <Link
                            to="/login"
                            className="block w-full text-center border border-gray-200 py-4 rounded-xl font-semibold text-gray-800 hover:bg-gray-50 transition"
                        >
                            ← Back to Login
                        </Link>

                        {/* Footer */}
                        <p className="text-center text-xs text-gray-400 mt-7">
                            By creating an account, you can start exploring ShopKart.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;