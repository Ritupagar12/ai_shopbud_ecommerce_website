import React from "react";
import { XCircle, Package, Truck, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const statusSteps = ["Processing", "Shipped", "Delivered", "Cancelled"];

const statusIcons = {
  Processing: <Package className="w-5 h-5" />,
  Shipped: <Truck className="w-5 h-5" />,
  Delivered: <CheckCircle className="w-5 h-5" />,
  Cancelled: <XCircle className="w-5 h-5" />,
};

const TrackOrderModal = ({ order, onClose }) => {
  const currentIndex = statusSteps.indexOf(order.order_status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-gray-800 shadow-2xl p-6 sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors text-xl font-bold"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Track Order #{order.id}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="relative mb-8 sm:mb-10">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-600 rounded-full" />
          <motion.div
            className="absolute top-1/2 left-0 h-1 bg-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${(currentIndex / (statusSteps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.4 }}
          />
          <div className="flex justify-between relative z-10 flex-wrap">
            {statusSteps.map((status, idx) => {
              const isActive = idx === currentIndex;
              const isCompleted = idx < currentIndex;

              return (
                <div
                  key={status}
                  className="flex flex-col items-center text-center mb-4 sm:mb-0"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      isCompleted
                        ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-400"
                        : isActive
                        ? "border-blue-600 text-white bg-blue-600"
                        : "border-gray-300 text-gray-400 dark:border-gray-500 dark:text-gray-300 dark:bg-gray-700"
                    }`}
                  >
                    {statusIcons[status]}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : isCompleted
                        ? "text-gray-700 dark:text-gray-300"
                        : "text-gray-400 dark:text-gray-300"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Details */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {order.order_status}
          </h3>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            {order.order_status === "Processing" &&
              "Your order is being prepared."}
            {order.order_status === "Shipped" &&
              "Your package has been shipped and is on its way."}
            {order.order_status === "Delivered" &&
              "Your order has been successfully delivered."}
            {order.order_status === "Cancelled" &&
              "This order has been cancelled."}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TrackOrderModal;