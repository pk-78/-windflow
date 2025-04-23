import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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

import AdminHomePage from "./Admin/pages/AdminOrderPage";
import ViewOrder from "./Admin/pages/ViewOrder";
import AddProduct from "./Admin/pages/AddProduct";
import AllProduct from "./Admin/pages/AllProduct";
import EditProduct from "./Admin/pages/EditProduct";
import MyOrder from "./User/Page/MyOrder";
import AdminOrderPage from "./Admin/pages/AdminOrderPage";
import ProtectedRoute from "./Admin/pages/ProtectedRoute";
import PrivateRoute from "./Admin/pages/PrivateRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const token = localStorage.getItem("token");
  console.log(role);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Toaster />
      <Routes>
        {/* Public User Routes */}
        <Route
          path="/userLogin"
          element={
            token && role !== "admin" ? <Navigate to="/" /> : <UserLogin />
          }
        />
        <Route
          path="/userSignup"
          element={
            token && role !== "admin" ? <Navigate to="/" /> : <UserSignupPage />
          }
        />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          {/* <Route path="/" element={<UserHomePage />} /> */}
          <Route path="/userReset" element={<UserReset />} />
          <Route path="/home/:id" element={<UserHomePage />} />
          {/* <Route
            path="/productDetail/:id"
            element={<ProductDetail isLoggedIn={isLoggedIn} />}
          /> */}
          <Route path="/orderHistory/:id" element={<MyOrder />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
        <Route
          path="/productDetail/:id"
          element={<ProductDetail isLoggedIn={isLoggedIn} />}
        />
        <Route path="/" element={<UserHomePage />} />
      </Routes>

      <Routes>
        {/* Public Admin Routes */}
        <Route
          path="/adminLogin"
          element={
            token && role === "admin" ? (
              <Navigate to="/adminHome" />
            ) : (
              <AdminLogin />
            )
          }
        />
        <Route
          path="/adminSignup"
          element={
            token && role === "admin" ? (
              <Navigate to="/adminHome" />
            ) : (
              <AdminSignupPage />
            )
          }
        />

        {/* Protected Admin Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/adminReset" element={<AdminReset />} />
          <Route path="/adminHome" element={<AllProduct />} />
          <Route path="/viewOrder/:id" element={<ViewOrder />} />
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/allProduct" element={<AdminOrderPage />} />
          <Route path="/editProduct/:id" element={<EditProduct />} />
        </Route>
        {/* <Route path="*" element={<UserHomePage />} /> */}
        {/* <Route path="/" element={<AdminLogin />} />  */}
      </Routes>
    </>
  );
}

export default App;
