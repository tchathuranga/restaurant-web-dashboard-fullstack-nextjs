import React from "react";

interface SearchBarProps {
  searchValue?: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchValue, onSearchChange, placeholder = "Search here" }) => {
  return (
    <div className="w-full flex justify-end my-4 mb-8 px-4">
      <div className="relative w-full max-w-xl">
        <input
          type="text"
          placeholder={placeholder}
          aria-label={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="sv-input rounded-full! pl-5 pr-11 shadow-sm text-ink placeholder-gray-400 text-base"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2">
          <svg width="20" height="20" fill="none" viewBox="0 0 22 22">
            <circle cx="10" cy="10" r="7" stroke="#c9a227" strokeWidth="2" />
            <path d="M16 16L20 20" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
