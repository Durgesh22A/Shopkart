import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../axiosCalls/axios";
import { useCart } from "../context/CartContext";

function Navbar() {
    const navigate = useNavigate();
    const { itemCount, clearCartLocally } = useCart();

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/customers/logout");
            clearCartLocally();
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <nav className="flex items-center justify-between bg-black text-white px-8 py-4">

            <h1
                onClick={() => navigate("/home")}
                className="text-2xl font-bold cursor-pointer"
            >
                ShopKart
            </h1>


            <div className="flex items-center gap-6">

                <button
                    onClick={() => navigate("/home")}
                    className="hover:text-gray-400 transition"
                >
                    Home
                </button>


                <button
                    onClick={() => navigate("/products")}
                    className="hover:text-gray-400 transition"
                >
                    Products
                </button>


                <button
                    onClick={() => navigate("/wishlist")}
                    className="hover:text-gray-400 transition flex items-center gap-1"
                >
                    <span className="text-lg">♡</span>
                    Wishlist
                </button>

                <button
                    onClick={() => navigate("/cart")}
                    className="hover:text-gray-400 transition flex items-center gap-1"
                >
                    <span className="text-lg">🛒</span>
                    Cart ({itemCount})
                </button>

                <button
                    onClick={() => navigate("/orders")}
                    className="hover:text-gray-400 transition"
                >
                    Orders
                </button>


                <button
                    onClick={handleLogout}
                    className="bg-white text-black px-5 py-2 rounded-xl hover:bg-gray-200 transition"
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;
