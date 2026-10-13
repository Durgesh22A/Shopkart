import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

function Cart() {
    const navigate = useNavigate();
    const { cartItems, loading, error, refreshCart, updateQuantity, removeFromCart, isPending, itemCount, subtotal } = useCart();

    return (
        <div className="min-h-screen bg-[#f5f5f7]">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="flex items-end justify-between mb-9">
                    <div>
                        <p className="text-sm uppercase tracking-[.25em] text-gray-400 font-semibold">Shopping bag</p>
                        <h1 className="text-4xl font-bold text-gray-900 mt-2">My Cart</h1>
                    </div>
                    {!loading && cartItems.length > 0 && <button onClick={() => navigate("/products")} className="font-semibold text-gray-600 hover:text-black">Continue shopping →</button>}
                </div>

                {loading && <div className="min-h-80 grid place-items-center text-gray-500">Loading your cart...</div>}
                {!loading && error && <div className="bg-white rounded-3xl p-10 text-center shadow-sm"><p className="text-red-600">{error}</p><button onClick={() => refreshCart()} className="mt-5 bg-black text-white px-6 py-3 rounded-xl">Try Again</button></div>}
                {!loading && !error && cartItems.length === 0 && (
                    <div className="min-h-80 grid place-items-center text-center bg-white rounded-3xl shadow-sm p-10">
                        <div><p className="text-6xl">🛒</p><h2 className="text-2xl font-bold mt-5">Your cart is empty</h2><p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p><button onClick={() => navigate("/products")} className="mt-6 bg-black text-white px-6 py-3 rounded-xl font-semibold">Browse Products</button></div>
                    </div>
                )}
                {!loading && !error && cartItems.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-7 items-start">
                        <section className="space-y-4">
                            {cartItems.map(({ product, quantity }) => product && (
                                <article key={product._id} className="bg-white rounded-3xl p-5 sm:p-6 flex gap-5 shadow-sm border border-gray-100">
                                    <img src={product.image} alt={product.name} className="w-24 h-24 sm:w-32 sm:h-32 object-contain bg-gray-50 rounded-2xl p-3" />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex justify-between gap-3"><div><h2 className="font-bold text-lg sm:text-xl truncate">{product.name}</h2><p className="text-gray-500 mt-1">{money(product.price)} each</p></div><p className="font-bold whitespace-nowrap">{money(product.price * quantity)}</p></div>
                                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                                <button aria-label="Decrease quantity" disabled={quantity === 1 || isPending(product._id)} onClick={() => updateQuantity(product._id, quantity - 1).catch(() => {})} className="w-10 h-10 hover:bg-gray-100 disabled:text-gray-300">−</button>
                                                <span className="w-10 text-center font-semibold">{quantity}</span>
                                                <button aria-label="Increase quantity" disabled={quantity >= product.stock || isPending(product._id)} onClick={() => updateQuantity(product._id, quantity + 1).catch(() => {})} className="w-10 h-10 hover:bg-gray-100 disabled:text-gray-300">+</button>
                                            </div>
                                            <button disabled={isPending(product._id)} onClick={() => removeFromCart(product._id).catch(() => {})} className="text-red-600 font-semibold text-sm hover:text-red-800 disabled:opacity-50">{isPending(product._id) ? "Updating..." : "Remove"}</button>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-3">{product.stock} available</p>
                                    </div>
                                </article>
                            ))}
                        </section>
                        <aside className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 lg:sticky lg:top-6">
                            <h2 className="text-xl font-bold">Order Summary</h2>
                            <div className="mt-6 space-y-3 text-gray-600"><div className="flex justify-between"><span>Items</span><span>{itemCount}</span></div><div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-100"><span>Subtotal</span><span>{money(subtotal)}</span></div></div>
                            <p className="text-xs text-gray-400 mt-4">Shipping and taxes will be confirmed at checkout.</p>
                            <button onClick={() => navigate("/checkout")} className="w-full mt-6 bg-black text-white rounded-xl py-4 font-semibold hover:bg-gray-800">Proceed to Checkout</button>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Cart;
