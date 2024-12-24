import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import HeroSection from "./HeroSection";
import SearchBar from "./SearchBar";
import ContentGrid from "./ContentGrid";

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const apiKey = "bfbc42cc51a737715f9ab554c951d6ad";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingContent = async () => {
      try {
        const moviesResponse = await fetch(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`
        );
        const moviesData = await moviesResponse.json();
        setTrendingMovies(moviesData.results);

        const seriesResponse = await fetch(
          `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}`
        );
        const seriesData = await seriesResponse.json();
        setTrendingSeries(seriesData.results);
      } catch (error) {
        console.error("Error fetching trending content:", error);
      }
    };

    fetchTrendingContent();
  }, []);

  const handleContentClick = (id, type) => {
    // Check for movie or series type and navigate accordingly
    const route = type === "movie" ? `/movie/${id}` : `/seriedetail/${id}`;
    navigate(route);
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${searchQuery}`
      );
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching content:", error);
    }
  };

  return (
    <div className="homepage">
      <HeroSection
        heroContent={[...trendingMovies, ...trendingSeries]} // Combined movie and series for hero section
        onContentClick={handleContentClick}
        mediaType="multi" // Media type is set to 'multi' to accommodate both movie and series
      />

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <ContentGrid content={searchResults} onClick={handleContentClick} />
        </div>
      )}

      <h2>Trending Movies</h2>
      <ContentGrid content={trendingMovies.slice(0, 12)} onClick={handleContentClick} />
      <button onClick={() => navigate("/movies")} className="view-more-btn">
        View More
      </button>

      <h2>Trending Series</h2>
      <ContentGrid content={trendingSeries.slice(0, 12)} onClick={handleContentClick} />
      <button onClick={() => navigate("/series")} className="view-more-btn">
        View More
      </button>
    </div>
  );
};

export default HomePage;
