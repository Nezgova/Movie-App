import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [featuredIndex, setFeaturedIndex] = useState(0); // Index of the featured movie
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const apiKey = 'bfbc42cc51a737715f9ab554c951d6ad';
  const navigate = useNavigate();

  // Fetch popular movies when the component mounts
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
        );
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  // Handle movie click
  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  // Handle navigation in the hero section
  const nextFeaturedMovie = () => {
    setFeaturedIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const prevFeaturedMovie = () => {
    setFeaturedIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  // Handle search
  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`
      );
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  const featuredMovie = movies[featuredIndex];

  return (
    <div className="homepage">
      {/* Hero Section */}
      {featuredMovie && (
        <div
          className="hero-section"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
          }}
        >
          <div className="hero-content">
            <h1>{featuredMovie.title}</h1>
            <p>{featuredMovie.overview}</p>
            <button onClick={() => handleMovieClick(featuredMovie.id)}>
              Watch Now
            </button>
            <div className="hero-navigation">
              <button onClick={prevFeaturedMovie}>❮ Previous</button>
              <button onClick={nextFeaturedMovie}>Next ❯</button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for movies or series..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <div className="movie-grid">
            {searchResults.map((movie) => (
              <div
                className="movie-card"
                key={movie.id}
                onClick={() => handleMovieClick(movie.id)}
              >
                <div
                  className="card-poster"
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
                  }}
                ></div>
                <h3>{movie.title}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
