import { useState } from "react";
import { Mail, Send } from "lucide-react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto text-center p-10 sm:p-16 bg-white dark:bg-gray-800 rounded-3xl shadow-md dark:shadow-lg">
        {/* Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white">
          <Mail className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
          Stay in the Loop
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-10">
          Subscribe to our newsletter and be the first to hear about exclusive offers, new arrivals, and special deals.
        </p>

        {/* Form */}
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300" />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 font-semibold flex items-center justify-center space-x-2 shadow-md dark:shadow-lg"
          >
            <Send className="w-5 h-5" />
            <span>Subscribe</span>
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;