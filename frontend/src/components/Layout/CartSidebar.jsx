import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../../store/slices/cartSlice";
import { toggleCart } from "../../store/slices/popupSlice";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { isCartOpen } = useSelector((state) => state.popup);
  const { cart } = useSelector((state) => state.cart);

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

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => dispatch(toggleCart())}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 z-50 bg-white dark:bg-gray-800 rounded-l-3xl shadow-lg dark:shadow-xl animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-indigo-500 dark:text-indigo-400">Shopping Cart</h2>
          <button
            onClick={() => dispatch(toggleCart())}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="w-5 h-5 text-indigo-500" />
          </button>
        </div>

        <div className="p-6">
          {cart && cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Your cart is empty.</p>
              <Link
                to={"/products"}
                onClick={() => dispatch(toggleCart())}
                className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 font-semibold"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart &&
                  cart.map((item) => (
                    <div key={item.product.id} className="bg-white dark:bg-gray-700 rounded-2xl shadow-md dark:shadow-lg p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{item.product.name}</h3>
                          <p className="text-indigo-500 font-semibold">${item.product.price}</p>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2 mt-3">
                            <button
                              className="p-1 rounded bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity === 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              className="p-1 rounded bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 rounded bg-red-100 dark:bg-red-600 hover:bg-red-200 dark:hover:bg-red-500 text-red-500 dark:text-red-100 transition-colors ml-2"
                              onClick={() => dispatch(removeFromCart(item.product.id))}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Total:</span>
                  <span className="text-xl font-bold text-indigo-500">${total.toFixed(2)}</span>
                </div>
                <Link
                  to={"/cart"}
                  onClick={() => dispatch(toggleCart())}
                  className="w-full py-3 block text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 font-semibold"
                >
                  View Cart & Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;