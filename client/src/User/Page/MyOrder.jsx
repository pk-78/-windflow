import axios from "axios";
import React, { useEffect, useState } from "react";
import url from "../../url/url";
import {
  FaBoxOpen,
  FaRupeeSign,
  FaTags,
  FaTruck,
  FaClock,
  FaHashtag,
} from "react-icons/fa";

export default function MyOrder() {
  const id = localStorage.getItem("id");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrderHistory = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/user/getOrdersHistory/${id}`
        );

        const orderItems = response.data.orderHistory || [];
        const orderDetailsRequest = orderItems.map((item) =>
          axios.get(`${url}/api/v1/user/getOrderDetail/${item}`)
        );
        const orderResponses = await Promise.all(orderDetailsRequest);

        const detailedOrders = orderResponses.map((res) => {
          const { order, product } = res.data;
          return { order, product };
        });

        setOrders(detailedOrders);
      } catch (error) {
        console.log(error);
      }
    };

    getOrderHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600";
      case "shipped":
        return "text-blue-600";
      case "pending":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-purple-800 mb-10 text-center drop-shadow-md">
          <FaBoxOpen className="inline mb-1 mr-2" />
          My Order History
        </h1>

        {orders?.length<1?<div className="text-xl text-center">No Order History</div>:orders.map((order, key) => {
          const orderTime = new Date(order.order.createdAt).toLocaleString(
            "en-IN",
            {
              dateStyle: "medium",
              timeStyle: "short",
            }
          );

          return (
            <div
              key={key}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row items-center gap-6 border border-purple-200 mb-6"
            >
              <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden border border-pink-300 shadow-sm">
                <img
                  src={order?.product?.mainImage?.url}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-2 text-gray-700 w-full">
                <p className="text-xl font-semibold text-purple-700">
                  <FaBoxOpen className="inline mb-1 mr-1" />
                  Order Name:{" "}
                  <span className="font-medium">{order?.product?.name}</span>
                </p>
                <p>
                  <FaRupeeSign className="inline mb-1 mr-1" />
                  Price:{" "}
                  <span className="font-medium">
                    ₹{order?.product?.originalPrice}
                  </span>
                </p>
                <p>
                  <FaTags className="inline mb-1 mr-1" />
                  Category:{" "}
                  <span className="font-medium">
                    {order?.product?.category}
                  </span>
                </p>
                <p>
                  <FaTruck className="inline mb-1 mr-1" />
                  Status:{" "}
                  <span
                    className={`font-medium ${getStatusColor(
                      order?.order?.orderStatus
                    )}`}
                  >
                    {order?.order?.orderStatus}
                  </span>
                </p>
                <p>
                  <FaClock className="inline mb-1 mr-1" />
                  Order Time: <span className="font-medium">{orderTime}</span>
                </p>
                <p>
                  <FaHashtag className="inline mb-1 mr-1" />
                  Quantity:{" "}
                  <span className="font-medium">{order?.order?.quantity}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
