import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../axiosCalls/axios";
import Navbar from "../components/Navbar";

function Products() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [wishlistIds, setWishlistIds] = useState([]);
    const [savingId, setSavingId] = useState(null);
    const [wishlistError, setWishlistError] = useState("");

    // Fetch products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (search.trim()) {
                params.search = search.trim();
            }

            if (category) {
                params.category = category;
            }

            const response = await axiosInstance.get("/products", {
                params
            });

            const productList = response.data.products || [];

            setProducts(productList);

            const uniqueCategories = [
                ...new Set(
                    productList.map((product) => product.category)
                )
            ];

            setCategories(uniqueCategories);
        } catch (error) {
            console.log(error);
            setError("Unable to load products.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch wishlist
    const fetchWishlist = async () => {
        try {
            const response = await axiosInstance.get("/wishlist");

            const wishlist = response.data.wishlist || [];

            setWishlistIds(
                wishlist.map((product) => product._id)
            );
        } catch (error) {
            console.log(error);
            setWishlistIds([]);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    // Search + category filter
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 400);

        return () => clearTimeout(timer);
    }, [search, category]);

    // Add product to wishlist
    const handleWishlist = async (productId) => {
        try {
            setSavingId(productId);
            setWishlistError("");

            await axiosInstance.post(
                `/wishlist/${productId}`
            );

            setWishlistIds((previousIds) => [
                ...previousIds,
                productId
            ]);
        } catch (error) {
            console.log(error);

            if (error.response?.status === 409) {
                setWishlistIds((previousIds) =>
                    previousIds.includes(productId)
                        ? previousIds
                        : [...previousIds, productId]
                );
            } else if (error.response?.status === 401) {
                setWishlistError(
                    "Please login to use wishlist."
                );
            } else {
                setWishlistError(
                    "Unable to add product to wishlist."
                );
            }
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f7]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-black text-white">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl"></div>

                <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-32">
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-5">
                        ShopKart Store
                    </p>

                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                        Find what
                        <span className="text-gray-500">
                            {" "}you love.
                        </span>
                    </h1>

                    <p className="mt-5 text-lg text-gray-400 max-w-xl">
                        Explore our collection of carefully selected
                        products made for everyday life.
                    </p>
                </div>
            </section>

            {/* Search + Category */}
            <section className="relative max-w-7xl mx-auto px-6 -mt-10">
                <div className="bg-white rounded-3xl shadow-xl p-3 flex flex-col md:flex-row gap-3">

                    {/* Search */}
                    <div className="flex-1 flex items-center bg-[#f5f5f7] rounded-2xl px-5">
                        <span className="text-gray-400 text-xl">
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full bg-transparent outline-none px-4 py-4 text-gray-800 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Category */}
                    <div className="md:w-64">
                        <select
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                            className="w-full h-full min-h-[56px] bg-[#f5f5f7] rounded-2xl px-5 outline-none text-gray-800 cursor-pointer"
                        >
                            <option value="">
                                All Categories
                            </option>

                            {categories.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-6 py-14">

                {/* Wishlist Error */}
                {wishlistError && (
                    <div className="mb-6 bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-4">
                        {wishlistError}
                    </div>
                )}

                {/* Header */}
                {!loading && !error && (
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                                Explore
                            </p>

                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                                Our Products
                            </h2>
                        </div>

                        <p className="text-gray-500">
                            {products.length}{" "}
                            {products.length === 1
                                ? "product"
                                : "products"}{" "}
                            available
                        </p>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="min-h-80 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>

                            <p className="mt-5 text-gray-500">
                                Loading products...
                            </p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="min-h-80 flex items-center justify-center">
                        <div className="bg-white rounded-3xl shadow-sm p-12 text-center max-w-md">
                            <div className="text-5xl mb-5">
                                ⚠️
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900">
                                Something went wrong
                            </h2>

                            <p className="text-gray-500 mt-3">
                                We couldn't load the products.
                            </p>

                            <button
                                onClick={fetchProducts}
                                className="mt-7 bg-black text-white px-7 py-3 rounded-xl hover:bg-gray-800 transition"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty */}
                {!loading &&
                    !error &&
                    products.length === 0 && (
                        <div className="min-h-80 flex items-center justify-center">
                            <div className="text-center max-w-md">
                                <div className="text-7xl mb-6">
                                    🔍
                                </div>

                                <h2 className="text-3xl font-bold text-gray-900">
                                    No products found
                                </h2>

                                <p className="text-gray-500 mt-3">
                                    Try changing your search or
                                    category filter.
                                </p>

                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setCategory("");
                                    }}
                                    className="mt-7 bg-black text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    )}

                {/* Product Grid */}
                {!loading &&
                    !error &&
                    products.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                            {products.map((product) => {
                                const isWishlisted =
                                    wishlistIds.includes(
                                        product._id
                                    );

                                const isSaving =
                                    savingId === product._id;

                                return (
                                    <div
                                        key={product._id}
                                        className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                                    >

                                        {/* Product Image */}
                                        <div className="relative h-72 bg-gray-50 overflow-hidden">

                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "https://placehold.co/600x600/f5f5f5/999999?text=No+Image";
                                                }}
                                                className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-500"
                                            />

                                            {/* Category */}
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-gray-800 shadow-sm border border-gray-100">
                                                    {product.category}
                                                </span>
                                            </div>

                                            {/* Stock */}
                                            <div className="absolute top-4 right-4">
                                                {product.stock > 0 ? (
                                                    <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow">
                                                        In Stock
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow">
                                                        Sold Out
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-6">

                                            <h3 className="text-xl font-bold text-gray-900 truncate">
                                                {product.name}
                                            </h3>

                                            <p className="text-sm text-gray-500 mt-2">
                                                {product.stock > 0
                                                    ? `${product.stock} units available`
                                                    : "Currently unavailable"}
                                            </p>

                                            {/* Price */}
                                            <p className="text-2xl font-bold text-gray-900 mt-5">
                                                ₹
                                                {product.price.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>

                                            {/* View Product */}
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/products/${product._id}`
                                                    )
                                                }
                                                className="w-full mt-5 py-3.5 rounded-xl bg-gray-100 text-gray-900 font-semibold hover:bg-black hover:text-white transition"
                                            >
                                                View Product
                                            </button>

                                            {/* Wishlist */}
                                            <button
                                                onClick={() => {
                                                    if (
                                                        isWishlisted
                                                    ) {
                                                        navigate(
                                                            "/wishlist"
                                                        );
                                                    } else {
                                                        handleWishlist(
                                                            product._id
                                                        );
                                                    }
                                                }}
                                                disabled={isSaving}
                                                className={`w-full mt-3 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                                                    isSaving
                                                        ? "bg-gray-100 text-gray-400 cursor-wait"
                                                        : "bg-pink-50 text-pink-600 border border-pink-100 hover:bg-pink-100"
                                                }`}
                                            >
                                                {isSaving
                                                    ? "⏳ Saving..."
                                                    : isWishlisted
                                                    ? "Go to Wishlist →"
                                                    : "♡ Add to Wishlist"}
                                            </button>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
            </main>
        </div>
    );
}

export default Products;