import React, { useEffect, useState } from "react";
import { FaCartPlus, FaBars, FaTimes } from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const id = localStorage.getItem("id");

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close menu on navigation
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false); // Close menu on logout
    window.location.href = "/";
  };

  const renderLinks = () => {
    if (role === "admin" && isLoggedIn) {
      return (
        <>
          <li
            onClick={() => handleNavigate("/adminHome")}
            className="hover:text-red-500 cursor-pointer"
          >
            Home
          </li>
          <li
            onClick={() => handleNavigate("/addProduct")}
            className="hover:text-red-500 cursor-pointer"
          >
            Add Product
          </li>
          <li
            onClick={() => handleNavigate("/allProduct")}
            className="hover:text-red-500 cursor-pointer"
          >
            Orders
          </li>
          <li
            onClick={() => handleNavigate("/adminReset")}
            className="hover:text-red-500 cursor-pointer"
          >
            Setting
          </li>
        </>
      );
    } else if (isLoggedIn) {
      return (
        <>
          <li
            onClick={() => handleNavigate(`/home/${id}`)}
            className="hover:text-red-500 cursor-pointer"
          >
            Home
          </li>
          <li
            onClick={() => handleNavigate(`/orderHistory/${id}`)}
            className="hover:text-red-500 cursor-pointer"
          >
            My Order
          </li>
          <li
            onClick={() => handleNavigate("/userReset")}
            className="hover:text-red-500 cursor-pointer"
          >
            Setting
          </li>
        </>
      );
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative z-50">
      <div className="text-2xl font-bold text-red-600">Wind Flow</div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 text-gray-700 font-large">
        {renderLinks()}
      </ul>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? (
            <FaTimes className="w-6 h-6 text-red-600" />
          ) : (
            <FaBars className="w-6 h-6 text-red-600" />
          )}
        </button>
      </div>

      {/* Desktop Right Icons */}
      <div className="hidden md:flex items-center space-x-4">
        {isLoggedIn && role !== "admin" && (
          <Link to="/cart" className="relative">
            <FaCartPlus className="w-6 h-6 text-red-600 hover:text-red-500" />
          </Link>
        )}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 cursor-pointer bg-red-600 text-white px-4 py-1.5 rounded-xl hover:bg-red-500 transition"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        ) : (
          <button
            onClick={() => handleNavigate("/userLogin")}
            className="flex items-center space-x-1 cursor-pointer bg-red-600 text-white px-4 py-1.5 rounded-xl hover:bg-red-500 transition"
          >
            <FiLogIn className="w-4 h-4" />
            <span>Login</span>
          </button>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t border-red-200 flex flex-col items-start px-6 py-4 space-y-4 md:hidden shadow-md">
          <ul className="flex flex-col space-y-3 text-gray-700 w-full">
            {renderLinks()}
          </ul>
          <div className="flex flex-col space-y-3 w-full">
            {isLoggedIn && role !== "admin" && (
              <div
                onClick={() => handleNavigate("/cart")}
                className="flex items-center  text-red-600 hover:text-red-500 cursor-pointer"
              >
                <FaCartPlus className="mr-2" />
                <span>Cart</span>
              </div>
            )}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center cursor-pointer space-x-1 bg-red-600 text-white px-4 py-1.5 rounded-xl hover:bg-red-500 transition"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavigate("/userLogin")}
                className="flex items-center space-x-1 cursor-pointer bg-red-600 text-white px-4 py-1.5 rounded-xl hover:bg-red-500 transition"
              >
                <FiLogIn />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
