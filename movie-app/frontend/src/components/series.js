import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./series.css";

const SeriesPage = () => {
  const [seriesByGenre, setSeriesByGenre] = useState({});
  const [genres, setGenres] = useState([]);
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const apiKey = "bfbc42cc51a737715f9ab554c951d6ad";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        // Fetch all TV genres
        const genreResponse = await fetch(
          `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}`
        );
        const genreData = await genreResponse.json();
        setGenres(genreData.genres);

        // Fetch trending TV series, excluding adult content
        const trendingResponse = await fetch(
          `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&include_adult=false`
        );
        const trendingData = await trendingResponse.json();
        setTrendingSeries(trendingData.results);

        // Fetch TV series for each genre, excluding adult content
        const genreSeries = {};
        for (const genre of genreData.genres) {
          const genreSeriesResponse = await fetch(
            `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${genre.id}&include_adult=false`
          );
          const genreSeriesData = await genreSeriesResponse.json();
          genreSeries[genre.name] = genreSeriesData.results;
        }
        setSeriesByGenre(genreSeries);
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };

    fetchSeries();
  }, []);

  // Handle series click
  const handleSeriesClick = (id) => {
    navigate(`/seriedetail/${id}`);
  };

  // Handle navigation in the hero section
  const nextFeaturedSeries = () => {
    setFeaturedIndex((prevIndex) => (prevIndex + 1) % trendingSeries.length);
  };

  const prevFeaturedSeries = () => {
    setFeaturedIndex((prevIndex) =>
      prevIndex === 0 ? trendingSeries.length - 1 : prevIndex - 1
    );
  };

  // Handle search
  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${searchQuery}&include_adult=false`
      );
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching series:", error);
    }
  };

  // Handle glowing effect on cards
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  };

  const featuredSeries = trendingSeries[featuredIndex];

  return (
    <div className="homepage">
      {/* Hero Section */}
      {featuredSeries && (
        <div
          className="hero-section"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredSeries.backdrop_path})`,
          }}
        >
          <div className="hero-content">
            <h1>{featuredSeries.name}</h1>
            <div className="hero-description">
              <p>{featuredSeries.overview}</p>
            </div>
            <button onClick={() => handleSeriesClick(featuredSeries.id)}>
              Watch Now
            </button>
            <div className="hero-navigation">
              <button onClick={prevFeaturedSeries}>
                <i className="fas fa-chevron-left"></i> {/* Left Arrow Icon */}
              </button>
              <button onClick={nextFeaturedSeries}>
                <i className="fas fa-chevron-right"></i>{" "}
                {/* Right Arrow Icon */}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for series..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <div className="series-grid">
            {searchResults.map((series) => (
              <div
                className="series-card"
                key={series.id}
                onMouseMove={handleMouseMove}
                onClick={() => handleSeriesClick(series.id)}
              >
                <div
                  className="card-poster"
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/w500${series.poster_path})`,
                  }}
                ></div>
                <h3>{series.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Genre-Based Sections (only show if no search results) */}
      {searchResults.length === 0 && genres.length > 0 && (
        <>
          {genres.map((genre) => (
            <div className="series-grid" key={genre.id}>
              <h2>{genre.name} Series</h2>
              {seriesByGenre[genre.name]?.map((series) => (
                <div
                  className="series-card"
                  key={series.id}
                  onMouseMove={handleMouseMove}
                  onClick={() => handleSeriesClick(series.id)}
                >
                  <div
                    className="card-poster"
                    style={{
                      backgroundImage: `url(https://image.tmdb.org/t/p/w500${series.poster_path})`,
                    }}
                  ></div>
                  <h3>{series.name}</h3>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SeriesPage;
