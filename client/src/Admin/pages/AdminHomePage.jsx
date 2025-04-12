import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import url from "../../url/url";

const statusOptions = ["pending", "shipped", "cancelled", "delivered"];

const statusColors = {
  pending: "bg-yellow-100 border-yellow-400 text-yellow-700",
  shipped: "bg-blue-100 border-blue-400 text-blue-700",
  cancelled: "bg-red-100 border-red-400 text-red-700",
  delivered: "bg-green-100 border-green-400 text-green-700",
};
export default function AdminHomePage() {
  const [orders, setOrders] = useState({
    pending: [],
    shipped: [],
    cancelled: [],
    delivered: [],
  });

  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const getOrders = async () => {
      console.log(`${url}/api/v1/admin/orders/${status}Orders`);
      try {
        const response = await axios.get(
          `${url}/api/v1/admin/orders/${status}Orders`
        );
        console.log(response?.data?.orders);

        // Dynamically update the specific status array
        setOrders((prevOrders) => ({
          ...prevOrders,
          [status]: response?.data?.orders,
        }));
      } catch (error) {
        console.log(error);
      }
    };

    getOrders();
  }, [status]);

  const fetchOrders = async () => {
    try {
      for (const stat of statusOptions) {
        const { data } = await axios.get(`/api/orders/${stat}`);
        setOrders((prev) => ({
          ...prev,
          [stat]: data.orders || [],
        }));
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const selectedOrders = orders[status] || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8">
        Admin Dashboard
      </h1>

      <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
        {statusOptions.map((stat) => (
          <button
            key={stat}
            onClick={() => setStatus(stat)}
            className={`capitalize px-4 py-2 text-sm sm:text-base rounded-full border font-medium ${
              status === stat
                ? `${statusColors[stat]}`
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {stat}
          </button>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 capitalize">
          {status} Orders
        </h2>

        {orders[status]?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders[status].map((order) => (
              <ProductCard key={order._id} order={order} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No {status} orders found.</p>
        )}
      </div>
    </div>
  );
}
