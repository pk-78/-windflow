import React, { useEffect, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";

import { Link } from "react-router-dom"; // <-- Import this

import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const id = localStorage.getItem("id");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log(isLoggedIn);
  console.log(role);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    window.location.href = "/userLogin";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold text-red-600">Wind Flow</div>

      {/* Navigation Links */}

      {role === "admin" ? (
        <ul className="hidden md:flex space-x-6 text-gray-700 font-large">
          <li
            onClick={() => {
              navigate("/adminHome");
            }}
            className="hover:text-red-500 cursor-pointer"
          >
            Home
          </li>
          <li
            onClick={() => {
              navigate("/addProduct");
            }}
            className="hover:text-red-500 cursor-pointer"
          >
            Add Product
          </li>
          <li
            onClick={() => {
              navigate("/allProduct");
            }}
            className="hover:text-red-500 cursor-pointer"
          >
            All Product
          </li>
          <li
            onClick={() => {
              navigate("/adminReset");
            }}
            className="hover:text-red-500 cursor-pointer"
          >
            Setting
          </li>
        </ul>
      ) : (
        <ul className="hidden md:flex space-x-6 text-gray-700 font-large">
          <li
            onClick={() => {
              navigate(`/home/${id}`);
            }}
            className="hover:text-red-500 cursor-pointer"
          >
            Home
          </li>
          
          <li
            onClick={() => {
              navigate(`/orderHistory/${id}`);
            }}
            className="hover:text-red-500 cursor-pointer"
          >
            My order
          </li>
          <li
            onClick={() => {
              navigate("/userReset");
            }}
            className="hover:text-red-500 cursor-pointer"
          >
            Setting
          </li>
        </ul>
      )}

      {/* Right Side Icons */}
      <div className="flex items-center space-x-4">
        {/* Save to Cart Icon */}
        {role === "admin" ? null : (
          <Link to="/cart" className="relative">
            <FaCartPlus className="w-6 h-6 text-red-600 hover:text-red-500" />
          </Link>
        )}

        {/* Login Button */}
        {isLoggedIn ? (
          <button
            onClick={() => handleLogout()}
            className="flex items-center cursor-pointer space-x-1 bg-red-600 text-white px-4 py-1.5 rounded-xl hover:bg-red-500 transition"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        ) : (
          <button className="flex items-center cursor-pointer space-x-1 bg-red-600 text-white px-4 py-1.5 rounded-xl hover:bg-red-500 transition">
            <FiLogIn className="w-4 h-4" />
            <span>Login</span>
          </button>
        )}

        {/* Admin Login Button */}
        {/* <button className="flex items-center space-x-1 bg-gray-800 text-white px-4 py-1.5 rounded-xl hover:bg-gray-700 transition">
          <MdAdminPanelSettings className="w-4 h-4" />
          <span>Admin</span>
        </button> */}
      </div>
    </nav>
  );
};

export default Navbar;
