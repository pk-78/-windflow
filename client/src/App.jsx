import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLogin from "./Admin/pages/AdminLogin";
import AdminReset from "./Admin/pages/AdminReset";
import AdminSignupPage from "./Admin/pages/AdminSignUp";
import Navbar from "./Admin/pages/Navbar";
import UserLogin from "./User/Page/UserLogin";
import UserReset from "./User/Page/UserReset";
import UserSignupPage from "./User/Page/UserSignUp";
import UserHomePage from "./User/Page/UserHomePage";
import { Toaster } from "react-hot-toast";
import ProductDetail from "./User/Page/ProductDetail";
import Cart from "./User/Page/Cart"; // <-- Make sure to import your Cart page

function App() {
  return (
    <div>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/adminSignup" element={<AdminSignupPage />} />
        <Route path="/userSignup" element={<UserSignupPage />} />
        <Route path="/adminReset" element={<AdminReset />} />
        <Route path="/userReset" element={<UserReset />} />
        <Route path="/" element={<UserHomePage />} />
        <Route path="/productDetail" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} /> 
      </Routes>
    </div>
  );
}

export default App;
