import {
  X,
  Home,
  Package,
  Info,
  HelpCircle,
  ShoppingCart,
  List,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/slices/popupSlice";

const Sidebar = () => {
  const { authUser } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector(state => state.popup);

  if (!isSidebarOpen) return null;

  const handleLinkClick = (path) => {
    dispatch(toggleSidebar());
    if(location.pathname === path) {
      window.scrollTo({top: 0, behavior: "smooth"});
    }
  };

  const menuItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Products", icon: Package, path: "/products" },
    { name: "About", icon: Info, path: "/about" },
    { name: "FAQ", icon: HelpCircle, path: "/faq" },
    { name: "Contact", icon: Phone, path: "/contact" },
    { name: "Cart", icon: ShoppingCart, path: "/cart" },
    authUser && { name: "My Orders", icon: List, path: "/orders" },
  ].filter(Boolean);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => dispatch(toggleSidebar())}
      />

      {/* Sidebar Panel */}
      <div className="fixed left-0 top-0 h-full w-full sm:w-80 z-50 bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-700 animate-slide-in-left overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Menu</h2>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => handleLinkClick(item.path)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors group"
                >
                  <item.icon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-indigo-500" />
                  <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-500">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;