import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleOrder } from "../store/slices/orderSlice";
import {
  Calendar,
  Truck,
  CheckCircle,
  Package,
  MapPin,
  Phone,
  XCircle,
} from "lucide-react";
import Confetti from "react-confetti";

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { singleOrder, fetchingSingleOrder, error } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (orderId) dispatch(fetchSingleOrder(orderId));
  }, [dispatch, orderId]);

  if (fetchingSingleOrder)
    return <p className="mt-20 text-center text-gray-500 dark:text-gray-300">Loading...</p>;
  if (error)
    return (
      <p className="mt-20 text-center text-red-500 dark:text-red-400">{error}</p>
    );
  if (!singleOrder)
    return (
      <p className="mt-20 text-center text-gray-500 dark:text-gray-300">
        Order not found.
      </p>
    );

  const steps = [
    { label: "Processing", icon: Package },
    { label: "Shipped", icon: Truck },
    { label: "On the Way", icon: Truck },
    { label: "Delivered", icon: CheckCircle },
  ];

  let currentStep = 0;
  if (singleOrder.order_status === "Processing") currentStep = 0;
  else if (singleOrder.order_status === "Shipped") currentStep = 2;
  else if (singleOrder.order_status === "Delivered") currentStep = 3;
  else if (singleOrder.order_status === "Cancelled") currentStep = -1;

  const getEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 5);
    return deliveryDate.toLocaleDateString("en-NZ", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      {singleOrder.order_status === "Delivered" && <Confetti />}

      {/* Banner */}
      <div className="sticky top-4 z-20 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg p-4 mb-6 text-center font-semibold shadow-md flex justify-center items-center space-x-2 animate-fade-in">
        <span className="text-2xl">🎉</span>
        <span>Thank you for your purchase! Here’s your order summary ✨</span>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Order summary */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 lg:col-span-2 relative overflow-hidden">
          {singleOrder.order_status === "Cancelled" && (
            <div className="absolute inset-0 bg-red-100 dark:bg-red-900 bg-opacity-70 dark:bg-opacity-50 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-xl">
              <XCircle className="w-12 h-12 text-red-600 dark:text-red-400 mb-2" />
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-300">
                Order Cancelled
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                We’re sorry this didn’t work out 💔
              </p>
            </div>
          )}

          <div
            className={`${singleOrder.order_status === "Cancelled" ? "opacity-40" : ""}`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">
                  Order #{singleOrder.id}
                </h1>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Total:{" "}
                  <span className="font-semibold">${singleOrder.total_price}</span>
                </p>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm">
                    Estimated Delivery:{" "}
                    <span className="font-semibold">
                      {getEstimatedDelivery(singleOrder.created_at)}
                    </span>
                  </span>
                </div>
              </div>

              <span
                className={`px-4 py-2 rounded-full font-semibold text-white shadow-md flex items-center gap-2 ${
                  singleOrder.order_status === "Delivered"
                    ? "bg-green-500 animate-bounce-slow"
                    : singleOrder.order_status === "Shipped"
                    ? "bg-yellow-500 animate-pulse"
                    : singleOrder.order_status === "Cancelled"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              >
                {singleOrder.order_status === "Delivered" && (
                  <CheckCircle className="w-5 h-5 text-white animate-ping-once" />
                )}
                {singleOrder.order_status === "Shipped"
                  ? "Your order is on the way 🚚"
                  : singleOrder.order_status === "Delivered"
                  ? "Delivered Successfully ✅"
                  : singleOrder.order_status}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-6 relative">
              <div className="absolute top-3 left-0 w-full h-1 bg-gray-200 dark:bg-gray-600 rounded-full z-0"></div>
              {currentStep >= 0 && (
                <div
                  className="absolute top-3 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-400 rounded-full z-0"
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>
              )}
              <div className="flex justify-between relative z-10 flex-wrap">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = currentStep >= i;
                  return (
                    <div key={i} className="flex flex-col items-center relative mb-4 sm:mb-0">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          isActive
                            ? "bg-blue-500 text-white shadow-md"
                            : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`mt-2 text-xs font-semibold ${
                          isActive ? "text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-300"
                        } text-center`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Shipping info */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-gray-900 dark:text-gray-100">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Shipping Information</span>
          </h2>
          <div className="space-y-1 text-gray-700 dark:text-gray-300">
            <p className="font-semibold">{singleOrder.shipping_info.full_name}</p>
            <p>{singleOrder.shipping_info.address}</p>
            <p>
              {singleOrder.shipping_info.city},{" "}
              {singleOrder.shipping_info.state}
            </p>
            <p>
              {singleOrder.shipping_info.country} -{" "}
              {singleOrder.shipping_info.pincode}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p>{singleOrder.shipping_info.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items list */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 relative">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-gray-900 dark:text-gray-100">
          <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Ordered Items</span>
        </h2>

        <div className="space-y-6">
          {singleOrder.order_items.map((item) => (
            <div
              key={item.order_item_id}
              className="flex flex-col md:flex-row items-start md:items-center border-b pb-4 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all rounded-lg p-3"
            >
              <div className="w-full md:w-36 mb-3 md:mb-0 md:mr-6 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-36 object-cover rounded-lg shadow-sm"
                />
              </div>
              <div className="flex-1 text-gray-700 dark:text-gray-300">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
                <p className="font-bold mt-1">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {singleOrder.order_status === "Cancelled" && (
          <div className="absolute inset-0 bg-red-50 dark:bg-red-900 bg-opacity-80 dark:bg-opacity-50 backdrop-blur-sm flex flex-col justify-center items-center rounded-xl">
            <XCircle className="w-12 h-12 text-red-500 dark:text-red-400 mb-2" />
            <h2 className="text-xl font-bold text-red-600 dark:text-red-300">
              Order Cancelled
            </h2>
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        @keyframes ping-once {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-ping-once {
          animation: ping-once 1s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default OrderDetails;