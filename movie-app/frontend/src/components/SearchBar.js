import React from "react";
import "./SearchBar.css";

const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  genres, 
  selectedGenre, 
  setSelectedGenre 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-container glass-panel">
        <input
          type="text"
          placeholder="Search for movies or series..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {genres && (
          <select 
            value={selectedGenre} 
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="genre-select"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        )}
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default SearchBar;