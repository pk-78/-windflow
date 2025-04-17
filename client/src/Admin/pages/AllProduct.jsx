import axios from "axios";
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import useGetAllProduct from "../../hooks/useGetAllProduct";

export default function AllProduct() {
    const dispatch = useDispatch()
  const navigate = useNavigate();
  
  const { allProduct } = useSelector((state) => state.product);


    useGetAllProduct(dispatch);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center sm:text-left">
          All Products
        </h1>

        {allProduct.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {allProduct.map((product) => (
              <div
                key={product?._id}
                className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden flex flex-col"
              >
                <img
                  src={product?.mainImage?.url}
                  alt={product?.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                    {product?.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    {product?.category}
                  </p>
                  <p className="text-blue-600 font-semibold text-sm mb-1">
                    ₹{product?.originalPrice}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Stock: {product?.stock}
                  </p>
                  <button
                    onClick={() => {
                      navigate(`/editProduct/${product?._id}`);
                    }}
                    className="mt-auto inline-block w-full cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                  >
                    View / Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-16 text-lg">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
