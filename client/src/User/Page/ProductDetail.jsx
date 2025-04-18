import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import url from "../../url/url";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState("M");
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const [inCart, setInCart] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");

  const sizes = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/product/getproduct/${id}`
        );
        setProduct(response?.data?.product);
        console.log(response);
        toast.success("Detail Fetch Successfully");
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong please try again");
      }
    };

    const getUserDetail = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/user/getCart/${userId}`
        );
        console.log(response.data);
        const cartItem = response?.data?.cartItem;

        setInCart(cartItem.some((item) => item.productId === id));
        
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
    getUserDetail();
  }, []);

  const addToCart = async () => {
    try {
      const response = await axios.post(
        `${url}/api/v1/user/addToCart/${userId}`,
        {
          productId: id,
        }
      );

      console.log(response?.data?.message);
      setInCart(true);
      toast.success("Item added to cart" || response?.data?.message);
    } catch (error) {
      console.log(error);
      toast.error("something went wrong ");
    }
  };
  // console.log(id);
  // console.log(userId);
  console.log(inCart);

  return (
    <div className="flex flex-col lg:flex-row gap-10 p-6 lg:p-16 bg-gray-50">
      {/* Left Images */}
      <div className="flex flex-col items-center gap-4">
        {product?.images?.map((img, i) => (
          <img
            key={img._id || i}
            src={img.url}
            alt={`product-thumb-${i}`}
            className="w-16 h-16 object-contain border rounded"
          />
        ))}
      </div>

      {/* Main Image */}
      <div className="flex justify-center items-center flex-1">
        <img
          src={product?.mainImage?.url}
          alt="main bag"
          className="w-[350px] md:w-[450px] lg:w-[500px] object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 gap-4">
        <h1 className="text-3xl font-bold"> {product?.name}</h1>

        {/* Rating */}
        <div className="flex items-center gap-1 text-red-500">
          <span className="text-xl">★★★★☆</span>
          <span className="text-gray-600 text-sm">(125)</span>
        </div>

        {/* Price */}
        <div className="text-xl font-semibold">
          <span className="line-through text-gray-400 mr-2">
            <span>Rs</span> {product?.originalPrice}
          </span>
          <span className="text-black">₹85</span>
        </div>

        <p>
          <strong>Category:</strong> {product?.category}
        </p>

        {/* Add to Cart */}
        {inCart ? (
          <div
            onClick={() => {
              navigate("/cart");
            }}
            className="bg-red-500 cursor-pointer text-white text-center px-6 py-3 mt-4 rounded hover:bg-red-600 transition"
          >
            Already In Cart
          </div>
        ) : (
          <button
            onClick={() => {
              addToCart();
            }}
            className="bg-red-500 cursor-pointer text-white px-6 py-3 mt-4 rounded hover:bg-red-600 transition"
          >
            Add to Cart
          </button>
        )}

        {/* Categories & Tags */}
        <div className="mt-4 text-gray-700 text-sm"></div>
      </div>
    </div>
  );
};

export default ProductDetail;
