import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./movies.css";
import HeroSection from "./HeroSection";
import SearchBar from "./SearchBar";
import ContentGrid from "./ContentGrid";

const MoviePage = () => {
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [genres, setGenres] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
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

        // Fetch movies by genre
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
      let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`;
      if (selectedGenre) {
        searchUrl += `&with_genres=${selectedGenre}`;
      }
      const response = await fetch(searchUrl);
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  const filteredGenres = selectedGenre 
    ? genres.filter(genre => genre.id === parseInt(selectedGenre))
    : genres;

  return (
    <div className="moviespage">
      <HeroSection
        heroContent={popularMovies}
        onContentClick={handleMovieClick}
        mediaType="movie"
      />

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        genres={genres}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
      />

      {searchResults.length > 0 ? (
        <div className="search-results">
          <h2>Search Results</h2>
          <ContentGrid content={searchResults} onClick={handleMovieClick} />
        </div>
      ) : (
        filteredGenres.map((genre) => (
          <div key={genre.id} className="genre-section">
            <h2>{genre.name} Movies</h2>
            <ContentGrid
              content={moviesByGenre[genre.name] || []}
              onClick={handleMovieClick}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default MoviePage;