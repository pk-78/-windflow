import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BadgePercent, CheckCircle2, XCircle } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { setAllProduct } from "../../redux/productSlice";
import axios from "axios";
import toast from "react-hot-toast";
import url from "../../url/url";
import useGetAllProduct from "../../hooks/useGetAllProduct";
import { FaShoppingBag, FaClock, FaThLarge } from "react-icons/fa";

export default function Home() {
  const allProduct = useSelector((state) => state.product.allProduct);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useGetAllProduct();

  // useEffect(() => {
  //   if (!allProduct || allProduct.length === 0) {
  //     useGetAllProduct(dispatch);
  //   }
  // }, [allProduct, dispatch]);
  return (
    <div>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Filter by Category
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              {
                label: "All",
                value: "all",
                icon: <FaThLarge className="mr-2" />,
              },
              {
                label: "Bag",
                value: "bag",
                icon: <FaShoppingBag className="mr-2" />,
              },
              {
                label: "Watch",
                value: "watch",
                icon: <FaClock className="mr-2" />,
              },
            ].map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center px-4 py-2 rounded-full border text-sm font-medium shadow-sm transition-all duration-200 ${
                  selectedCategory === category.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                }`}
              >
                {category.icon}
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProduct &&
          allProduct.filter((product) =>
            selectedCategory === "all"
              ? true
              : product.category.toLowerCase() === selectedCategory
          ).length === 0 ? (
            <div className="col-span-full text-center text-gray-500 text-lg">
              No products found in "{selectedCategory}" category.
            </div>
          ) : (
            allProduct
              ?.filter((product) =>
                selectedCategory === "all"
                  ? true
                  : product.category.toLowerCase() === selectedCategory
              )
              .map((product) => (
                <div
                  onClick={() => navigate(`/productDetail/${product?._id}`)}
                  key={product._id}
                >
                  <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all min-h-[520px] flex flex-col cursor-pointer">
                    <img
                      src={product?.mainImage?.url}
                      alt={product.name||"Product Image"}
                      className="w-full h-[400px] object-cover rounded-md mb-1"
                    />
                    <h2 className="text-xl font-semibold mb-1">
                      {product?.name}
                    </h2>
                    <p className="text-lg text-green-600 font-medium mb-1">
                      <span className="mr-1">Rs</span>
                      {product?.originalPrice}
                    </p>
                    <p>Category: {product?.category}</p>
                    <div className="flex items-center text-sm mt-auto">
                      {product.stock < 1 ? (
                        <span className="flex items-center text-red-500">
                          <XCircle className="h-4 w-4 mr-1" /> Out of Stock
                        </span>
                      ) : (
                        <span className="flex items-center text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" /> In Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
