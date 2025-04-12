import React, { useState } from 'react';

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState('M');

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="flex flex-col lg:flex-row gap-10 p-6 lg:p-16 bg-white">
      {/* Left Images */}
      <div className="flex flex-col items-center gap-4">
        {Array(4)
          .fill('')
          .map((_, i) => (
            <img
              key={i}
              src="/bag8Img.png"
              alt={`bag-thumb-${i}`}
              className="w-16 h-16 object-contain border rounded"
            />
          ))}
      </div>

      {/* Main Image */}
      <div className="flex justify-center items-center flex-1">
        <img
          src="/bag8Img.png"
          alt="main bag"
          className="w-[350px] md:w-[450px] lg:w-[500px] object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 gap-4">
        <h1 className="text-3xl font-bold">Bag 3</h1>

        {/* Rating */}
        <div className="flex items-center gap-1 text-red-500">
          <span className="text-xl">★★★★☆</span>
          <span className="text-gray-600 text-sm">(125)</span>
        </div>

        {/* Price */}
        <div className="text-xl font-semibold">
          <span className="line-through text-gray-400 mr-2">₹120.5</span>
          <span className="text-black">₹85</span>
        </div>

        {/* Description */}
        <p className="text-gray-700">Men Slim Fit Casual Jacket</p>

        {/* Size Selector */}
        <div>
          <p className="font-semibold mb-2">Select size</p>
          <div className="flex gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded ${
                  selectedSize === size
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-black'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart */}
        <button className="bg-red-500 text-white px-6 py-3 mt-4 rounded hover:bg-red-600 transition">
          Add to Cart
        </button>

        {/* Categories & Tags */}
        <div className="mt-4 text-gray-700 text-sm">
          <p>
            <strong>Category:</strong> Women, T-Shirt, Crop Top
          </p>
          <p>
            <strong>Tags:</strong> Women, Modern, Latest
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
