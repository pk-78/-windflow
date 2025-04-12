import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ order }) {
  const navigate = useNavigate();
  console.log(order);
  const date = order?.createdAt.split("T")[0];
  const time = new Date(order?.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex max-w-3xl bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-4">
      {/* Image Section */}

      {/* Info Section */}
      <div className="ml-6 flex flex-col justify-between">
        <div className="space-y-1">
          <p className="text-gray-700 text-sm">
            Customer: <span className="font-medium">{order?.customerId}</span>
          </p>
          <p className="text-gray-700 text-sm">
            Product: <span className="font-medium">{order?.productId}</span>
          </p>
          <p className="text-gray-700 text-sm">
            Quantity: <span className="font-medium">{order?.quantity}</span>
          </p>
          <p className="text-gray-700 text-sm">
            Time: <span className="font-medium">{order?.createdAt}</span>
          </p>
          <p className="text-gray-700 text-sm">
            Date: <span className="font-medium">{date}</span>
          </p>
          <p className="text-gray-700 text-sm">
            Time: <span className="font-medium">{time}</span>
          </p>

          <p>
            Order Status: <span className="">{order.orderStatus}</span>
          </p>
        </div>

        <button
          onClick={() => {
            navigate(`/viewOrder/${order?._id}`);
          }}
          className="mt-4 w-fit px-4 py-2 bg-blue-600 cursor-pointer text-white text-sm rounded-md hover:bg-blue-700 transition"
        >
          View Order
        </button>
      </div>
    </div>
  );
}
