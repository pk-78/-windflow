import axios from "axios";
import React, { useEffect, useState } from "react";
import url from "../../url/url";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const id = localStorage.getItem("id");
  const [cartProducts, setCartProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  console.log(id);

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

    const getUserData = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/user/getUserAddress/${id}`
        );
        console.log(response?.data?.address);
        setAddress(response?.data?.address);
      } catch (error) {
        console.log(error);
      }
    };

    getCart();
    getUserData();
  }, []);
  // console.log(address);

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

  const handleOrder = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    setLoading(true);

    try {
      // Prepare data for each product in cart
      const orders = cartProducts.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        paymentMethod,
        paymentId:
          paymentMethod === "online" ? "some-online-payment-id" : "COD", // replace as per integration
      }));

      // Make post request for each item
      for (const order of orders) {
        const response = await axios.post(
          `${url}/api/v1/user/orderProduct/${id}`,
          order
        );
        console.log("Order Response:", response.data);
      }

      toast.success("Order placed successfully!");
      const response = await axios.put(`${url}/api/v1/user/emptyCart/${id}`);

      console.log(response);
      // setCartProducts([])
      navigate(`/orderHistory/${id}`); // or wherever you want to go after placing the order
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order");
    }
    setLoading(false);
  };

  return (
    <div className="p-2 max-w-6xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-2xl font-extrabold text-center text-purple-700 mb-10 drop-shadow">
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
          <div className="p-6 mx-auto  rounded-2xl shadow-md bg-gradient-to-br from-blue-50 to-indigo-100 border border-indigo-200">
            <div className="flex justify-between border-b-2 border-indigo-300">
              <h2 className="text-2xl font-bold text-indigo-800 mb-1  pb-1">
                📍 Address Details
              </h2>
              <button
                onClick={() => {
                  navigate("/userReset");
                }}
                className="bg-indigo-800 text-white rounded-md px-1 py-1 cursor-pointer my-1"
              >
                Edit Address
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
              <div>
                <p className="text-indigo-700 font-semibold">Name</p>
                <p className="text-gray-900">{address?.name} </p>
              </div>

              <div>
                <p className="text-indigo-700 font-semibold">Mobile Number</p>
                <p className="text-gray-900">{address?.mobileNumber}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-indigo-700 font-semibold">Full Address</p>
                <p className="text-gray-900">{address?.fullAddress}</p>
              </div>

              <div>
                <p className="text-indigo-700 font-semibold">Landmark</p>
                <p className="text-gray-900">{address?.landmark}</p>
              </div>

              <div>
                <p className="text-indigo-700 font-semibold">City</p>
                <p className="text-gray-900">{address?.city}</p>
              </div>

              <div>
                <p className="text-indigo-700 font-semibold">State</p>
                <p className="text-gray-900">{address?.state}</p>
              </div>

              <div>
                <p className="text-indigo-700 font-semibold">Pincode</p>
                <p className="text-gray-900">{address?.pincode}</p>
              </div>
            </div>
          </div>
          <h4 className="text-red-500 text-lg">
            Please check your Address before Proceed
          </h4>

          <div className="text-right ">
            <h2 className="text-xl font-extrabold text-purple-800">
              Total: <span className="text-pink-600">₹{totalPrice}</span>
            </h2>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">
              Choose Payment Method
            </h4>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash On Delivery (COD)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Online (UPI)
              </label>
            </div>
          </div>

          <div className="text-right ">
            <button
              className="bg-green-500 cursor-pointer text-white rounded-md px-2 py-1"
              onClick={handleOrder}
            >
              {loading ? "Please wait" : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
