import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";

const ProductSlider = ({ title, products }) => {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const dispatch = useDispatch();
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <section className="py-4 md:py-8 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 sm:mb-0">
          {title}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-indigo-500" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
          >
            <ChevronRight className="w-6 h-6 text-indigo-500" />
          </button>
        </div>
      </div>

      {/* Products Slider */}
      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-4"
      >
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="flex-shrink-0 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-lg hover:shadow-xl transition-shadow duration-300 group"
          >
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-t-2xl">
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-48 sm:h-52 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col space-y-2">
                {new Date() - new Date(product.created_at) < 30 * 24 * 60 * 60 * 1000 && (
                  <span className="px-2 py-1 bg-indigo-500 text-white text-xs font-semibold rounded">
                    NEW
                  </span>
                )}
                {product.ratings >= 4.5 && (
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-rose-500 text-white text-xs font-semibold rounded">
                    TOP RATED
                  </span>
                )}
              </div>
              {/* Quick Add To Cart */}
              <button
                onClick={(e) => handleAddToCart(product, e)}
                className="absolute bottom-3 right-3 p-2 bg-white dark:bg-gray-700 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 text-indigo-500" />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-4 sm:p-5">
              {/* Title */}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-indigo-500 transition-colors">
                {product.name}
              </h3>
              {/* Ratings */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.ratings) ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({product.review_count})
                </span>
              </div>
              {/* Price */}
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg sm:text-xl font-bold text-indigo-500">
                  ${product.price}
                </span>
              </div>
              {/* Availability */}
              <div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    product.stock > 5
                      ? "bg-green-500/20 text-green-600"
                      : product.stock > 0
                      ? "bg-yellow-500/20 text-yellow-600"
                      : "bg-red-500/20 text-red-600"
                  }`}
                >
                  {product.stock > 5
                    ? "In Stock"
                    : product.stock > 0
                    ? "Limited Stock"
                    : "Out of Stock"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductSlider;