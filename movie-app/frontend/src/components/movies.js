import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './movies.css';

const MoviePage = () => {
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [genres, setGenres] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const apiKey = 'bfbc42cc51a737715f9ab554c951d6ad';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch all genres
        const genreResponse = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
        );
        const genreData = await genreResponse.json();
        setGenres(genreData.genres);

        // Fetch popular movies
        const popularResponse = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
        );
        const popularData = await popularResponse.json();
        setPopularMovies(popularData.results);

        // Fetch movies for each genre
        const genreMovies = {};
        for (const genre of genreData.genres) {
          const genreMoviesResponse = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre.id}`
          );
          const genreMoviesData = await genreMoviesResponse.json();
          genreMovies[genre.name] = genreMoviesData.results;
        }
        setMoviesByGenre(genreMovies);
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
    setFeaturedIndex((prevIndex) => (prevIndex + 1) % popularMovies.length);
  };

  const prevFeaturedMovie = () => {
    setFeaturedIndex((prevIndex) =>
      prevIndex === 0 ? popularMovies.length - 1 : prevIndex - 1
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

  // Handle glowing effect on cards
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  };

  const featuredMovie = popularMovies[featuredIndex];

  return (
    <div className="homepage">
     {/* Hero Section */}
{popularMovies.length > 0 && (
  <div className="hero-section">
    <div className="hero-wrapper">
      {popularMovies.map((movie, index) => (
        <div
          className="hero-slide"
          key={index}
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        >
          <div className="hero-content">
            <h1>{movie.title || movie.name}</h1>
            <p>{movie.overview}</p>
            <button
              onClick={() =>
                handleMovieClick(movie.id)
              }
            >
              Watch Now
            </button>
          </div>
        </div>
      ))}
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
                onMouseMove={handleMouseMove}
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

      {/* Genre-Based Sections (only show if no search results) */}
      {searchResults.length === 0 && genres.length > 0 && (
        <>
          {genres.map((genre) => (
            <div className="movie-grid" key={genre.id}>
              <h2>{genre.name} Movies</h2>
              {moviesByGenre[genre.name]?.map((movie) => (
                <div
                  className="movie-card"
                  key={movie.id}
                  onMouseMove={handleMouseMove}
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
          ))}
        </>
      )}
    </div>
  );
};

export default MoviePage;
