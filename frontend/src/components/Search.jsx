import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-gray-800 rounded-full shadow-2xl border border-gray-700 focus-within:border-purple-500 transition-all">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for your favorite album..."
            className="flex-1 bg-transparent text-white px-6 py-4 text-lg outline-none placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-full p-4 m-1 transition-all"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Search size={24} />
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          Try searching: "Illmatic", "good kid m.A.A.d city", "The Eminem Show"
        </p>
      </div>
    </div>
  );
};

export default SearchBar;
