import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../axiosCalls/axios";
import Navbar from "../components/Navbar";

function Wishlist() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/wishlist");

      setWishlist(response.data.wishlist || []);
    } catch (error) {
      console.log(error);

      setError("Unable to load your wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);

      await axiosInstance.delete(`/wishlist/${productId}`);

      setWishlist((previousWishlist) =>
        previousWishlist.filter((product) => product._id !== productId),
      );
    } catch (error) {
      console.log(error);

      alert("Unable to remove product from wishlist.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl"></div>

        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-28">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-5">
            Your Collection
          </p>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            My Wishlist
            <span className="text-gray-500"> ♥</span>
          </h1>

          <p className="mt-5 text-lg text-gray-400 max-w-xl">
            Products you've saved for later.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-14">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center min-h-80">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>

              <p className="mt-5 text-gray-500">Loading your wishlist...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="min-h-80 flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-sm p-12 text-center max-w-md">
              <div className="text-5xl mb-5">⚠️</div>

              <h2 className="text-2xl font-bold text-gray-900">
                Something went wrong
              </h2>

              <p className="text-gray-500 mt-3">
                We couldn't load your wishlist.
              </p>

              <button
                onClick={fetchWishlist}
                className="mt-7 bg-black text-white px-7 py-3 rounded-xl hover:bg-gray-800 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && wishlist.length === 0 && (
          <div className="min-h-80 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="text-7xl mb-6">♡</div>

              <h2 className="text-3xl font-bold text-gray-900">
                Your wishlist is empty
              </h2>

              <p className="text-gray-500 mt-3 leading-relaxed">
                Save products you love and find them here later.
              </p>

              <button
                onClick={() => navigate("/products")}
                className="mt-7 bg-black text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition"
              >
                Browse Products
              </button>
            </div>
          </div>
        )}

        {/* Wishlist */}
        {!loading && !error && wishlist.length > 0 && (
          <>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                  Saved Items
                </p>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                  {wishlist.length}{" "}
                  {wishlist.length === 1 ? "Product" : "Products"} Saved
                </h2>
              </div>

              <button
                onClick={() => navigate("/products")}
                className="hidden md:block text-sm font-semibold text-gray-600 hover:text-black transition"
              >
                Continue Shopping →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Image */}
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

                  {/* Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 truncate">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      {product.stock > 0
                        ? `${product.stock} units available`
                        : "Currently unavailable"}
                    </p>

                    <p className="text-2xl font-bold text-gray-900 mt-5">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>

                    {/* View */}
                    <button
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="w-full mt-5 py-3.5 rounded-xl bg-gray-100 text-gray-900 font-semibold hover:bg-black hover:text-white transition"
                    >
                      View Details
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(product._id)}
                      disabled={removingId === product._id}
                      className="w-full mt-3 py-3 rounded-xl border border-gray-200 text-red-500 font-semibold hover:bg-red-50 transition disabled:opacity-50"
                    >
                      {removingId === product._id
                        ? "⏳ Removing..."
                        : "💔 Remove from Wishlist"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Wishlist;
