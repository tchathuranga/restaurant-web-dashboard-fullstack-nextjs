import React from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

interface SearchBarProps {
  searchValue?: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Search field with a clear button once something is typed
const SearchBar: React.FC<SearchBarProps> = ({ searchValue = "", onSearchChange, placeholder = "Search here", className = "mb-6" }) => {
  return (
    <div className={`relative w-full ${className}`}>
      <SearchRoundedIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
      <input
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="sv-input rounded-full! py-3! pl-12! pr-11! text-base text-ink shadow-sm placeholder-gray-400 [&::-webkit-search-cancel-button]:hidden"
      />
      {searchValue && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-cream text-ink-muted transition hover:bg-saffron hover:text-ivory"
        >
          <CloseRoundedIcon sx={{ fontSize: 16 }} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
