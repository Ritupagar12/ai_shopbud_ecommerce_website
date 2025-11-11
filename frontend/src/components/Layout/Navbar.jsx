import { Menu, User, ShoppingCart, Sun, Moon, Search, Heart } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAuthPopup,
  toggleCart,
  toggleSearchBar,
  toggleSidebar,
} from "../../store/slices/popupSlice";
import { Link, useNavigate } from "react-router-dom";


const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { cart } = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist?.items || []);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const cartItemsCount = cart
    ? cart.reduce((total, item) => total + item.quantity, 0)
    : 0;

    const wishlistCount = wishlist.length;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-md dark:shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left: Sidebar Menu */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center px-4 sm:px-0">
            <Link to="/">
            <h1
            className="text-xl sm:text-3xl font-extrabold font-calligraphy bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent select-none">
              ShopBud
            </h1>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-0.5 sm:space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-1 sm:ml-0"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Search */}
            <button
              onClick={() => dispatch(toggleSearchBar())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* User */}
            <button
              onClick={() => dispatch(toggleAuthPopup())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo("/wishlist")}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-semibold text-white  flex items-center justify-center bg-red-500">
                  {wishlist.length}
                </span>
              )}
            </button>
            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;