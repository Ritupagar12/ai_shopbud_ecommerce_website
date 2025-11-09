import { Search, Sparkles, Star, Filter, X } from "lucide-react";
import { categories } from "../data/products";
import ProductCard from "../components/Products/ProductCard";
import Pagination from "../components/Products/Pagination";
import AISearchModal from "../components/Products/AISearchModal";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "../store/slices/productSlice";
import { toggleAIModal } from "../store/slices/popupSlice";

const Products = () => {
  const { products, totalProducts } = useSelector((state) => state.product);
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const searchTerm = query.get("search");
  const searchedCategory = query.get("category");

  const [searchQuery, setSearchQuery] = useState(searchTerm || "");
  const [selectedCategory, setSelectedCategory] = useState(searchedCategory || "");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [availability, setAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchAllProducts({
        category: selectedCategory,
        price: `${priceRange[0]}-${priceRange[1]}`,
        search: searchQuery,
        ratings: selectedRating,
        availability: availability,
        page: currentPage,
      })
    );
  }, [dispatch, selectedCategory, priceRange, searchQuery, selectedRating, availability, currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const totalPages = Math.ceil(totalProducts / 12);

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <div>
            {/* Mobile Overlay */}
            {isMobileFilterOpen && (
              <div className="fixed inset-0 z-50 flex">
                <div className="bg-black/50 absolute inset-0" onClick={() => setIsMobileFilterOpen(false)} />
                <div className="relative bg-white dark:bg-gray-800 w-80 h-full p-6 overflow-y-auto shadow-lg rounded-r-lg">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <FiltersContent
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    categories={categories}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    selectedRating={selectedRating}
                    setSelectedRating={setSelectedRating}
                    availability={availability}
                    setAvailability={setAvailability}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              </div>
            )}

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <FiltersContent
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  categories={categories}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedRating={selectedRating}
                  setSelectedRating={setSelectedRating}
                  availability={availability}
                  setAvailability={setAvailability}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">

            {/* Search Bar + AI Button */}
            <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 relative min-w-[150px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300" />
                <input
                  type="text"
                  placeholder="Search Products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400 dark:placeholder-gray-500
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                />
              </div>
              <button
                className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow hover:scale-105 transition-transform"
                onClick={() => dispatch(toggleAIModal())}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                AI Search
              </button>

              {/* Mobile Filter Button */}
              <button
                className="flex items-center justify-center px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg shadow sm:hidden"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <Filter className="w-5 h-5 mr-2" /> Filters
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}

            {/* No Result */}
            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No products found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Search Modal */}
      <AISearchModal />
    </div>
  );
};

export default Products;

// =====================
// FiltersContent Component
// =====================
const FiltersContent = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  priceRange,
  setPriceRange,
  selectedRating,
  setSelectedRating,
  availability,
  setAvailability,
  setCurrentPage
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Filters</h2>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Price Range</h3>
        <input
          type="range"
          min="0"
          max="10000"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

     {/* Rating */}
<div>
  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Rating</h3>
  <div className="flex flex-col space-y-2"> {/* Changed flex-row → flex-col */}
    {[4, 3, 2, 1].map((rating) => (
      <button
        key={rating}
        onClick={() => { setSelectedRating(selectedRating === rating ? 0 : rating); setCurrentPage(1); }}
        className={`flex items-center space-x-2 p-2 rounded ${selectedRating === rating ? "bg-purple-100 dark:bg-purple-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
      >
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-500"}`}
          />
        ))}
        <span className="text-sm text-gray-700 dark:text-gray-300">{rating} & up</span>
      </button>
    ))}
  </div>
</div>

      {/* Availability */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Availability</h3>
        <div className="flex flex-col space-y-2">
          {["in-stock", "limited", "out-of-stock"].map(status => (
            <button
              key={status}
              onClick={() => setAvailability(availability === status ? "" : status)}
              className={`w-full p-2 text-left rounded ${availability === status ? "bg-purple-100 dark:bg-purple-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            >
              {status === "in-stock" ? "In Stock" : status === "limited" ? "Limited Stock" : "Out of Stock"}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Category</h3>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => { setSelectedCategory(""); setCurrentPage(1); window.scrollTo({top:0, behavior:"smooth"}); }}
            className={`w-full p-2 text-left rounded ${!selectedCategory ? "bg-purple-100 dark:bg-purple-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.name); setCurrentPage(1); window.scrollTo({top:0, behavior:"smooth"}); }}
              className={`w-full p-2 text-left rounded ${selectedCategory === cat.name ? "bg-purple-100 dark:bg-purple-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};