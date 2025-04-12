import axios from "axios";
import React, { useEffect, useState } from "react";
import url from "../../url/url";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function ViewOrder() {
  const [viewOrder, setViewOrder] = useState(null);

  const { id } = useParams();
  console.log(id);

  const [status, setStatus] = useState("");

  useEffect(() => {
    const getorderDetail = async () => {
      try {
        const response = await axios.get(
          `${url}/api/v1/admin/orders/getOrder/${id}`
        );
        console.log(response?.data);
        setViewOrder(response?.data);
        toast.success("Orders Fetched Successfully");
        setStatus(response?.data?.order?.orderStatus || "loading..."); // ✅ Set status here
      } catch (error) {
        console.log(error);
        toast.error("Error in fetching orders");
      }
    };

    getorderDetail();
  }, []);
  const handleStatusChange = async () => {
    try {
      const response = await axios.post(
        `${url}/api/v1/admin/orders/orderStatus`,
        {
          orderId: id,
          status: status,
        }
      );
      console.log(response);

      // ✅ update local state after success
      setViewOrder((prev) => ({
        ...prev,
        order: {
          ...prev.order,
          orderStatus: status,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mb-0 md:mb-0 sm:mb-0 p-4 sm:p-6 md:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
        Order Details
      </h1>

      {/* Product Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
          Product
        </h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <div className=" sm:w-28 md:w-28 w-32 h-28 bg-gray-200 rounded overflow-hidden">
            <img
              src={viewOrder?.product?.mainImage?.url}
              alt="Product"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-1">
            <p className="text-base sm:text-lg font-medium text-gray-800">
              {viewOrder?.product?.name}
            </p>
            <p className="text-gray-600">
              Price: ₹{viewOrder?.product?.originalPrice}
            </p>
            <p className="text-gray-600">
              Category: {viewOrder?.product?.category}
            </p>
          </div>
        </div>
      </div>

      {/* Order Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
          Order
        </h2>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-1">
            <span className="text-gray-700">
              Quantity: {viewOrder?.order?.quantity}
            </span>
            <span className="text-gray-700">
              Status: {viewOrder?.order?.orderStatus}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="cancelled">Cancelled</option>
              <option value="delivered">Delivered</option>
            </select>

            <button
              onClick={handleStatusChange}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>

      {/* Customer Details Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
          Customer Details
        </h2>
        <div className="space-y-2 text-sm sm:text-base">
          <p className="text-gray-800 font-medium">
            Name: {viewOrder?.customer?.name}
          </p>
          <p className="text-gray-700">Email: {viewOrder?.customer?.email}</p>
          <p className="text-gray-700">Phone: {viewOrder?.customer?.phone}</p>
          <div className="text-gray-700 space-y-1">
            <div>Landmark: {viewOrder?.customer?.address?.landmark}</div>
            <div>City: {viewOrder?.customer?.address?.city}</div>
            <div>State: {viewOrder?.customer?.address?.state}</div>
            <div>Country: {viewOrder?.customer?.address?.country}</div>
            <div>Pincode: {viewOrder?.customer?.address?.pincode}</div>
            <div>Full Address: {viewOrder?.customer?.address?.fullAddress}</div>
            <div>Name: {viewOrder?.customer?.address?.name}</div>
            <div>
              Mobile Number: {viewOrder?.customer?.address?.mobileNumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
