import { Link } from "react-router-dom";
import { categories } from "../../data/products";

const CategoryGrid = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      {/* Heading */}
      <div className="text-center mb-16 px-4">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
          Shop by Category
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore our thoughtfully curated categories and discover products that match your lifestyle and taste.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${category.name}`}
            className="group relative rounded-2xl overflow-hidden shadow-md dark:shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-400 bg-white dark:bg-gray-800"
          >
            {/* Image */}
            <div className="relative w-full h-36 sm:h-44 md:h-52 lg:h-56">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60 dark:from-black/40 dark:to-transparent group-hover:opacity-50 transition-opacity duration-500" />
            </div>

            {/* Name */}
            <div className="p-5 sm:p-6 text-center">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;