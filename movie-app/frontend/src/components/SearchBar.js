// SearchBar.js
import React from "react";
import "./SearchBar.css";

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for movies or series..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
