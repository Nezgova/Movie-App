import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

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

  // Combine movies and series for the hero section
  const heroContent = [...trendingMovies, ...trendingSeries];

  // Handle navigation to detail pages
  const handleContentClick = (id, type) => {
    const route = type === "movie" ? `/movie/${id}` : `/seriedetail/${id}`;
    navigate(route);
  };

  // Handle search functionality
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
      {/* Hero Section */}
      {heroContent.length > 0 && (
        <div className="hero-section">
          <div className="hero-wrapper">
            {heroContent.map((content, index) => (
              <div className="hero-slide"
              key={index}
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${content.backdrop_path})`,
              }}
            >
              <div className="hero-content">
                <h1>{content.title || content.name}</h1>
                <p>{content.overview}</p>
                <button
                  onClick={() =>
                    handleContentClick(content.id, content.media_type || "movie")
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
          <div className="content-grid">
            {searchResults.map((content) => (
              <div
                className="content-card"
                key={content.id}
                onClick={() =>
                  handleContentClick(content.id, content.media_type || "movie")
                }
              >
                <div
                  className="card-poster"
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/w500${content.poster_path})`,
                  }}
                ></div>
                <h3>{content.title || content.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Movies */}
      <h2>Trending Movies</h2>
      {trendingMovies.length > 0 && (
        <div className="content-grid">
          {trendingMovies.slice(0, 12).map((movie) => (
            <div
              className="content-card"
              key={movie.id}
              onClick={() => handleContentClick(movie.id, "movie")}
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
      )}
      <button onClick={() => navigate("/movies")} className="view-more-btn">
        View More
      </button>

      {/* Trending Series */}
      <h2>Trending Series</h2>
      {trendingSeries.length > 0 && (
        <div className="content-grid">
          {trendingSeries.slice(0, 12).map((series) => (
            <div
              className="content-card"
              key={series.id}
              onClick={() => handleContentClick(series.id, "tv")}
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
      )}
      <button onClick={() => navigate("/series")} className="view-more-btn">
        View More
      </button>
    </div>
  );
};

export default HomePage;
