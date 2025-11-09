import { Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { authUser } = useSelector((state) => state.auth);

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateCartQuantity({ id, quantity }));
    }
  };

  let total = 0;
  if (cart) {
    total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  let cartItemsCount = 0;
  if (cart) {
    cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md dark:shadow-lg text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your cart is empty</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Looks like you haven’t added any items to your cart yet.
          </p>
          <Link
            to={"/products"}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:scale-[1.02] transition-transform duration-300"
          >
            <span>Continue Shopping</span> <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Shopping Cart</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {cartItemsCount} item{cartItemsCount !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md dark:shadow-lg flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6"
              >
                <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                  <img
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-xl hover:scale-105 transition-transform"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.product.id}`}
                    className="block hover:text-indigo-500 dark:hover:text-purple-400 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                    Category: {item.product.category}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-indigo-500 dark:text-purple-400">
                      ${item.product.price}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={item.quantity === 1}
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-700 dark:text-gray-100" />
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-900 dark:text-gray-100 text-lg">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-gray-700 dark:text-gray-100" />
                    </button>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.product.id))}
                    className="p-2 bg-red-100 dark:bg-red-700 rounded-lg hover:bg-red-200 dark:hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-700 dark:text-red-100" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md dark:shadow-lg sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal ({cartItemsCount} items)</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                  <span className="font-semibold text-green-500">{total >= 50 ? "Free" : "$2"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Tax</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">${(total * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Total</span>
                    <span className="text-lg font-bold text-indigo-500 dark:text-purple-400">
                      ${(total + total * 0.18).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {authUser && (
                <Link
                  to={"/payment"}
                  className="w-full block text-center py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:scale-[1.02] transition-transform duration-300 mb-4"
                >
                  Proceed to Checkout
                </Link>
              )}

              <Link
                to={"/products"}
                className="w-full block text-center py-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;