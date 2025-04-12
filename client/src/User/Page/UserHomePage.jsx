import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BadgePercent, CheckCircle2, XCircle } from "lucide-react";
import ProductDetail from "./ProductDetail";

const products = [
  {
    name: "Bag1",
    price: "₹120",
    discount: true,
    inStock: true,
    image: "/bag1Img.png",
  },
  {
    name: "Bag2",
    price: "₹120",
    discount: true,
    inStock: true,
    image: "/bag2Img.png",
  },
  {
    name: "Bag3",
    price: "₹120",
    discount: true,
    inStock: true,
    image: "/bag3Img.png",
  },
  {
    name: "Bag4",
    price: "₹120",
    discount: true,
    inStock: true,
    image: "/bag4Img.png",
  },
  {
    name: "Bag6",
    price: "₹120",
    discount: true,
    inStock: true,
    image: "/bag6Img.png",
  },
  {
    name: "Bag7",
    price: "₹120",
    discount: true,
    inStock: true,
    image: "/bag7Img.png",
  },
  {
    name: "Bag8",
    price: "₹120",
    discount: true,
    inStock: true,
    image: "/bag8Img.png",
  },
];

export default function Home() {
  const navigate= useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Home</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div onClick={()=>{navigate("/productDetail")}} key={index}>
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all min-h-[520px] flex flex-col cursor-pointer">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[400px] object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-lg text-green-600 font-medium mb-2">
                {product.price}
              </p>
              {product.discount && (
                <div className="flex items-center text-sm text-red-500 mb-2">
                  <BadgePercent className="h-4 w-4 mr-1" />
                  Discount Available
                </div>
              )}
              <div className="flex items-center text-sm mt-auto">
                {product.inStock ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> In Stock
                  </span>
                ) : (
                  <span className="flex items-center text-red-500">
                    <XCircle className="h-4 w-4 mr-1" /> Out of Stock
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
