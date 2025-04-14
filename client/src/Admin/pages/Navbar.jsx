import React from 'react';
import { FaCartPlus } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";

import { Link } from "react-router-dom"; // <-- Import this

import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold text-red-600">
        Wind Flow
      </div>

      {/* Navigation Links */}

      <ul className="hidden md:flex space-x-6 text-gray-700 font-bold">
        <li className="hover:text-red-500 cursor-pointer">Home</li>
        <li className="hover:text-red-500 cursor-pointer">Bag</li>
        <li className="hover:text-red-500 cursor-pointer">Watch</li>

      <ul className="hidden md:flex space-x-6 text-gray-700 font-large">
        <li onClick={()=>{navigate("/adminHome")}} className="hover:text-red-500 cursor-pointer">Home</li>
        <li onClick={()=>{navigate("/addProduct")}} className="hover:text-red-500 cursor-pointer">Add Product</li>
        <li onClick={()=>{navigate("/allProduct")}} className="hover:text-red-500 cursor-pointer">All Product</li>
        <li onClick={()=>{navigate("/adminReset")}} className="hover:text-red-500 cursor-pointer">Setting</li>

      </ul>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-4">
        {/* Save to Cart Icon */}
        <Link to="/cart" className="relative">
          <FaCartPlus className="w-6 h-6 text-red-600 hover:text-red-500" />
        </Link>

        {/* Login Button */}
        <button className="flex items-center space-x-1 bg-red-600 text-white px-4 py-1.5 rounded-xl hover:bg-red-500 transition">
          <FiLogIn className="w-4 h-4" />
          <span>Login</span>
        </button>

        {/* Admin Login Button */}
        <button className="flex items-center space-x-1 bg-gray-800 text-white px-4 py-1.5 rounded-xl hover:bg-gray-700 transition">
          <MdAdminPanelSettings className="w-4 h-4" />
          <span>Admin</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
