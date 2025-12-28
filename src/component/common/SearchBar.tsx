import React from "react";

interface SearchBarProps {
  searchValue?: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchValue, onSearchChange }) => {
  return (
    <div className="w-full flex justify-end my-4 mb-10 px-4">
      <div className="relative w-full max-w-xl">
        <input
          type="text"
          placeholder="Search here"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="rounded-md w-full pl-4 pr-10 py-2 bg-white text-gray-700 placeholder-gray-400 border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-base"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
            <circle cx="10" cy="10" r="7" stroke="#A0AEC0" strokeWidth="2" />
            <path d="M16 16L20 20" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SearchBar;