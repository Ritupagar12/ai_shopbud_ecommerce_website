import React, { useEffect, useState } from "react";
import { Filter, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyOrders } from "../store/slices/orderSlice";
import TrackOrderModal from "../components/orders/TrackOrderModal";

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [trackOrderModal, setTrackOrderModal] = useState(null);
  const { myOrders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const filterOrders = myOrders.filter(
    (order) => statusFilter === "All" || order.order_status === statusFilter
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Package className="w-5 h-5 text-yellow-500" />;
      case "Shipped":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-500/20 text-yellow-500";
      case "Shipped":
        return "bg-blue-500/20 text-blue-500";
      case "Delivered":
        return "bg-green-500/20 text-green-500";
      case "Cancelled":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const statusArray = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  const { authUser } = useSelector((state) => state.auth);
  const navigateTo = useNavigate();
  if (!authUser) navigateTo("/products");

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            Track and manage your order history.
          </p>
        </div>

        {/* Status Filter */}
        <div className="bg-secondary rounded-xl p-4 mb-8">
          <div className="flex items-center space-x-4 flex-wrap">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-primary" />
              <span className="font-medium">Filter by Status:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {statusArray.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${statusFilter === status
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary hover:bg-primary/10 text-foreground"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filterOrders.length === 0 ? (
          <div className="bg-secondary rounded-xl p-8 text-center max-w-md mx-auto">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No Orders Found
            </h2>
            <p className="text-muted-foreground">
              {statusFilter === "All"
                ? "You haven't placed any orders yet."
                : `No orders with status "${statusFilter}" found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filterOrders.map((order) => (
              <div key={order.id} className="bg-secondary rounded-xl p-6 cursor-pointer hover:shadow-md transition">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Order #{order.id}
                    </h3>
                    <p className="text-muted-foreground">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.order_status)}
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium capitalize ${getStatusColor(
                          order.order_status
                        )}`}
                      >
                        {order.order_status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-bold text-primary">${order.total_price}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  {order?.order_items?.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex items-center space-x-4 p-4 bg-background rounded-lg"
                      onClick={() => navigateTo(`/product/${order.order_items[0].product_id}`)}

                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"

                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
                  <button
                    onClick={() => navigateTo(`/order/${order.id}`)}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition font-medium text-sm">
                    View Details
                  </button>
                  <button
                    onClick={() => setTrackOrderModal(order)}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition font-medium text-sm">
                    Track Order
                  </button>
                  {order.order_status === "Delivered" && (
                    <>
                      <button
                        onClick={() => navigateTo(`/product/${order.order_items[0].product_id}`)}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition font-medium text-sm">
                        Write Review
                      </button>
                      <button
                        onClick={() => navigateTo(`/product/${order.order_items[0].product_id}`)}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition font-medium text-sm">
                        Reorder
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {trackOrderModal && (
        <TrackOrderModal
          order={trackOrderModal}
          onClose={() => setTrackOrderModal(null)}
        />
      )}
    </div>
  );
};

export default Orders;