import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../axiosCalls/axios";
import Navbar from "../components/Navbar";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [added, setAdded] = useState(false);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosInstance.get(`/products/${id}`);

            setProduct(response.data.product);
        } catch (error) {
            console.log(error);

            if (error.response?.status === 404) {
                setError("Product not found.");
            } else {
                setError("Something went wrong while loading the product.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        setAdded(true);

        setTimeout(() => {
            setAdded(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#f5f5f7]">

            <Navbar />

            {/* Loading */}
            {loading && (
                <main className="max-w-7xl mx-auto px-6 py-16">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">

                        <div className="h-[550px] bg-gray-200 rounded-3xl"></div>

                        <div className="flex flex-col justify-center">

                            <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>

                            <div className="h-12 bg-gray-200 rounded w-3/4 mb-5"></div>

                            <div className="h-8 bg-gray-200 rounded w-40 mb-8"></div>

                            <div className="h-5 bg-gray-200 rounded w-full mb-3"></div>
                            <div className="h-5 bg-gray-200 rounded w-5/6 mb-3"></div>
                            <div className="h-5 bg-gray-200 rounded w-4/6 mb-10"></div>

                            <div className="h-14 bg-gray-200 rounded-2xl"></div>

                        </div>

                    </div>

                </main>
            )}


            {/* Error */}
            {!loading && error && (
                <main className="min-h-[70vh] flex items-center justify-center px-6">

                    <div className="bg-white rounded-3xl shadow-sm p-12 text-center max-w-md">

                        <div className="text-6xl mb-6">
                            😕
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            {error}
                        </h1>

                        <p className="text-gray-500 mt-3">
                            We couldn't find the product you're looking for.
                        </p>

                        <button
                            onClick={() => navigate("/products")}
                            className="mt-7 bg-black text-white px-7 py-3 rounded-xl hover:bg-gray-800 transition"
                        >
                            Back to Products
                        </button>

                    </div>

                </main>
            )}


            {/* Product Details */}
            {!loading && !error && product && (

                <main className="max-w-7xl mx-auto px-6 py-12">

                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/products")}
                        className="flex items-center gap-2 text-gray-500 hover:text-black transition mb-8 font-medium"
                    >
                        <span className="text-xl">
                            ←
                        </span>

                        Back to Products
                    </button>


                    <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm">

                        <div className="grid grid-cols-1 lg:grid-cols-2">

                            {/* Image Section */}
                            <div className="relative bg-gray-50 min-h-[500px] lg:min-h-[650px] flex items-center justify-center overflow-hidden">

                                <img
                                    src={product.image}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://placehold.co/800x800/f5f5f5/999999?text=No+Image";
                                    }}
                                    className="w-full h-full max-h-[650px] object-contain p-10 hover:scale-105 transition-transform duration-700"
                                />


                                {/* Category */}
                                <div className="absolute top-6 left-6">

                                    <span className="bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-bold text-gray-800 shadow-sm">
                                        {product.category}
                                    </span>

                                </div>


                                {/* Stock */}
                                <div className="absolute top-6 right-6">

                                    {product.stock > 0 ? (

                                        <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow">
                                            In Stock
                                        </span>

                                    ) : (

                                        <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow">
                                            Sold Out
                                        </span>

                                    )}

                                </div>

                            </div>


                            {/* Details Section */}
                            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">

                                <p className="text-sm uppercase tracking-[0.25em] text-gray-400 font-semibold mb-4">
                                    ShopKart Product
                                </p>


                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                                    {product.name}
                                </h1>


                                {/* Price */}
                                <div className="mt-7">

                                    <span className="text-4xl font-bold text-gray-900">
                                        ₹{product.price.toLocaleString("en-IN")}
                                    </span>

                                </div>


                                {/* Divider */}
                                <div className="h-px bg-gray-100 my-8"></div>


                                {/* Description */}
                                <div>

                                    <p className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-3">
                                        Description
                                    </p>

                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        {product.description}
                                    </p>

                                </div>


                                {/* Product Info */}
                                <div className="grid grid-cols-2 gap-4 mt-8">

                                    <div className="bg-[#f5f5f7] rounded-2xl p-5">

                                        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                                            Category
                                        </p>

                                        <p className="text-gray-900 font-bold mt-2">
                                            {product.category}
                                        </p>

                                    </div>


                                    <div className="bg-[#f5f5f7] rounded-2xl p-5">

                                        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                                            Availability
                                        </p>

                                        <p className="text-gray-900 font-bold mt-2">
                                            {product.stock > 0
                                                ? `${product.stock} units`
                                                : "Out of stock"}
                                        </p>

                                    </div>

                                </div>


                                {/* Add to Cart */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className={`w-full mt-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                                        product.stock === 0
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : added
                                            ? "bg-green-500 text-white"
                                            : "bg-black text-white hover:bg-gray-800 hover:-translate-y-1 hover:shadow-xl"
                                    }`}
                                >
                                    {product.stock === 0
                                        ? "Out of Stock"
                                        : added
                                        ? "✓ Added to Cart"
                                        : "Add to Cart"}
                                </button>


                                {/* Extra Info */}
                                <div className="flex items-center justify-center gap-8 mt-7 text-sm text-gray-400">

                                    <span>
                                        ✓ Secure Shopping
                                    </span>

                                    <span>
                                        ✓ Quality Products
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </main>

            )}

        </div>
    );
}

export default ProductDetails;