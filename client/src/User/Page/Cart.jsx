import axios from "axios";
import React, { useEffect, useState } from "react";
import url from "../../url/url";
import toast from "react-hot-toast";

const Cart = () => {
  const id = localStorage.getItem("id");
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/user/getCart/${id}`);
        const cartItems = response?.data?.cartItem || [];

        const productDetailRequests = cartItems.map((item) =>
          axios.get(`${url}/api/v1/product/getProduct/${item.productId}`)
        );

        const productResponses = await Promise.all(productDetailRequests);
        const detailedProducts = productResponses.map((res, i) => ({
          ...res.data, // includes product and its details
          quantity: cartItems[i].quantity, // add quantity from cart
          cartItemId: cartItems[i]._id, // optional: if you want to remove from server later
        }));

        setCartProducts(detailedProducts);
      } catch (error) {
        console.error("Error fetching cart items or product details:", error);
      }
    };

    getCart();
  }, []);

  const updateQuantity = (productId, newQty) => {
    setCartProducts((prev) =>
      prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: Math.max(1, newQty) }
          : item
      )
    );
  };

  const deleteItem = async (productId) => {
    try {
      const response = await axios.post(`${url}/api/v1/user/addToCart/${id}`, {
        productId,
      });
      console.log(response);
      if (response?.data?.success === true) {
        setCartProducts((prev) =>
          prev.filter((item) => item.product._id !== productId)
        );
        toast.success("Item Removed Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const totalPrice = cartProducts.reduce(
    (acc, item) => acc + item.product.originalPrice * item.quantity,
    0
  );

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-pink-50 to-purple-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-10 drop-shadow">
        🛍️ Your Shopping Cart
      </h1>

      <div className="mb-6 text-lg text-center font-medium text-pink-700">
        Items in Cart: <span className="font-bold">{cartProducts.length}</span>
      </div>

      {cartProducts.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          Your cart is currently empty.
        </p>
      ) : (
        <div className="space-y-6">
          {cartProducts.map((item) => (
            <div
              key={item.product._id}
              className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-purple-200"
            >
              <div className="flex items-center gap-6 w-full md:w-3/4">
                <img
                  src={item?.product?.mainImage?.url}
                  alt={item?.product?.name}
                  className="w-24 h-24 object-cover rounded-lg shadow-md border border-pink-300"
                />
                <div>
                  <h2 className="text-2xl font-bold text-purple-800">
                    {item?.product?.name}
                  </h2>
                  <p className="text-gray-600 font-medium">
                    Price: ₹{item?.product?.originalPrice}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      className="px-3 py-1 bg-pink-200 cursor-pointer hover:bg-pink-300 text-pink-800 font-bold rounded-full transition"
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold text-purple-700">
                      {item.quantity}
                    </span>
                    <button
                      className="px-3 py-1 bg-purple-200 cursor-pointer hover:bg-purple-300 text-purple-800 font-bold rounded-full transition"
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      onClick={() => deleteItem(item.product._id)}
                      className="ml-4 px-3 py-1 cursor-pointer bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-full text-sm transition"
                    >
                      ❌ Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-xl font-extrabold text-pink-700">
                ₹{item.product.originalPrice * item.quantity}
              </div>
            </div>
          ))}

          <div className="text-right mt-10">
            <h2 className="text-4xl font-extrabold text-purple-800">
              Total: <span className="text-pink-600">₹{totalPrice}</span>
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
