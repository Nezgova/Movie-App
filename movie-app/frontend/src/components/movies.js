import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./movies.css";
import HeroSection from "./HeroSection";
import SearchBar from "./SearchBar";
import ContentGrid from "./ContentGrid"; // Import ContentGrid component

const MoviePage = () => {
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [genres, setGenres] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const apiKey = "bfbc42cc51a737715f9ab554c951d6ad";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch genres
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

        // Fetch genre-based movies
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
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`
      );
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  return (
    <div className="moviespage">
      <HeroSection
        heroContent={popularMovies}
        onContentClick={(id) => handleMovieClick(id)}
        mediaType="movie"
      />

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      {/* Search Results */}
      {searchResults.length > 0 ? (
        <div className="search-results">
          <h2>Search Results</h2>
          <ContentGrid content={searchResults} onClick={handleMovieClick} />
        </div>
      ) : (
        // Genre-Based Sections (only show if no search results)
        Object.keys(moviesByGenre).length > 0 ? (
          genres.map((genre) => (
            <div key={genre.id}>
              <h2>{genre.name} Movies</h2>
              <ContentGrid
                content={moviesByGenre[genre.name] || []}
                onClick={handleMovieClick}
              />
            </div>
          ))
        ) : (
          <p>Loading genres...</p>
        )
      )}
    </div>
  );
};

export default MoviePage;
