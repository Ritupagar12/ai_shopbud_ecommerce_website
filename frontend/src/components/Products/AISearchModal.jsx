import React, { useState } from "react";
import { X, Search, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductWithAI } from "../../store/slices/productSlice";
import { toggleAIModal } from "../../store/slices/popupSlice";

const AISearchModal = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const dispatch = useDispatch();
  const { aiSearching } = useSelector((state) => state.product);
  const { isAIPopupOpen } = useSelector((state) => state.popup);

  if (!isAIPopupOpen) return null;

  const exampleText = [
    "List running shoes and sports gear in Sports & Outdoor",
    "Show me all leather jackets and shoes in Fashion",
    "Search for wireless headphones with good bass and noise cancellation",
    "Show popular fiction and non-fiction books",
    "Find skincare and makeup products in Beauty",
    "Show toys and baby clothes in Kids & Baby",
    "List car accessories and automotive tools",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (userPrompt.trim()) {
      dispatch(fetchProductWithAI(userPrompt));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              AI Product Search
            </h2>
          </div>
          <button
            onClick={() => dispatch(toggleAIModal())}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Describe what you're looking for and our AI will find the perfect products for you.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="e.g., 'A wireless headphone for gaming with good bass'"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={aiSearching || !userPrompt.trim()}
            className={`w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${
              aiSearching && "animate-pulse"
            }`}
          >
            {aiSearching ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AI doing magic in the background...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Search with AI</span>
              </>
            )}
          </button>
        </form>

        {/* Example Queries */}
        <div className="mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleText.map((example) => (
              <button
                key={example}
                onClick={() => setUserPrompt(example)}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-indigo-500 hover:text-white transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISearchModal;