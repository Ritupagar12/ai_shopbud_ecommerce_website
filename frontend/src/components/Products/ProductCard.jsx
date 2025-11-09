import React from "react";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { toggleWishlistItem } from "../../store/slices/wishlistSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const isInWishlist = wishlist.find((item) => item.id === product.id);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlistItem(product));
  }

  return (
    <Link
      key={product.id}
      to={`/product/${product.id}`}
      className="group bg-white dark:bg-gray-900 rounded-2xl shadow-md dark:shadow-lg p-4 hover:shadow-xl transition-shadow duration-300"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {new Date() - new Date(product.created_at) < 30 * 24 * 60 * 60 * 1000 && (
            <span className="px-2 py-1 bg-indigo-500 text-white text-xs font-semibold rounded-full">
              NEW
            </span>
          )}
          {product.ratings >= 4.5 && (
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-rose-500 text-white text-xs font-semibold rounded-full">
              TOP RATED
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white dark:bg-gray-800 shadow hover:scale-105 transition-transform"
        >
          <Heart
            className={`w-5 h-5 ${isInWishlist ? "text-red-500 fill-current" : "text-gray-400"
              }`}
          />
        </button>
        {/* Quick Add To Cart */}
        <button
          onClick={(e) => handleAddToCart(product, e)}
          disabled={product.stock === 0}
          className="absolute bottom-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:scale-105 transition-transform duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center"
        >
          <ShoppingCart className="w-5 h-5 text-indigo-500" />
        </button>
      </div>

      {/* Product Info */}
      <div>
        {/* Product Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-indigo-500 transition-colors">
          {product.name}
        </h3>

        {/* Product Ratings */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.ratings) ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">({product.review_count})</span>
        </div>

        {/* Product Price */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-indigo-500">${product.price}</span>
        </div>

        {/* Product Availability */}
        <div className="mt-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${product.stock > 5
                ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                : product.stock > 0
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300"
                  : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
              }`}
          >
            {product.stock > 5 ? "In Stock" : product.stock > 0 ? "Limited Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;