import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const HomePage = () => {
  const [movies, setMovies] = useState([]); // State to store movies
  const [searchQuery, setSearchQuery] = useState(''); // State to store search query
  const apiKey = 'bfbc42cc51a737715f9ab554c951d6ad'; // TMDB API key
  const navigate = useNavigate();  // Navigate function from react-router-dom

  // Fetch popular movies when the component mounts
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
        const data = await response.json();
        setMovies(data.results); // Set the movies in state
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  // Handle movie click
  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`); // Navigate to the movie detail page
  };

  // Handle search
  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;

    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`);
      const data = await response.json();
      setMovies(data.results); // Update movie list with search results
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  return (
    <div className="homepage">
      {/* Featured Banner */}
      <div className="featured-banner">
        <h1>Welcome to MovieApp</h1>
        <p>Explore our collection of amazing movies!</p>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Movies Grid */}
      <div className="movies-grid">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              className="movie-card"
              key={movie.id}
              onClick={() => handleMovieClick(movie.id)} // Trigger video player on click
            >
              <div
                className="card-poster"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
                }}
              ></div>
              <h3>{movie.title}</h3>
            </div>
          ))
        ) : (
          <p>Loading movies...</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
