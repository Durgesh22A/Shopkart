import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Products from "./pages/Product";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
