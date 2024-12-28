import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./series.css";
import HeroSection from "./HeroSection";
import SearchBar from "./SearchBar";
import ContentGrid from "./ContentGrid";

const SeriesPage = () => {
  const [seriesByGenre, setSeriesByGenre] = useState({});
  const [genres, setGenres] = useState([]);
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const apiKey = "bfbc42cc51a737715f9ab554c951d6ad";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const genreResponse = await fetch(
          `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}`
        );
        const genreData = await genreResponse.json();
        setGenres(genreData.genres);

        const trendingResponse = await fetch(
          `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&include_adult=false`
        );
        const trendingData = await trendingResponse.json();
        setTrendingSeries(trendingData.results);

        const genreSeries = {};
        for (const genre of genreData.genres) {
          const genreSeriesResponse = await fetch(
            `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${genre.id}&include_adult=false`
          );
          const genreSeriesData = await genreSeriesResponse.json();
          genreSeries[genre.name] = genreSeriesData.results.map((item) => ({
            ...item,
            media_type: "tv",
          }));
        }
        setSeriesByGenre(genreSeries);
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };

    fetchSeries();
  }, []);

  const handleSeriesClick = (id) => {
    navigate(`/seriedetail/${id}`);
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;

    try {
      let searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${searchQuery}&include_adult=false`;
      if (selectedGenre) {
        searchUrl += `&with_genres=${selectedGenre}`;
      }
      const response = await fetch(searchUrl);
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching series:", error);
    }
  };

  return (
    <div className="seriespage">
      <HeroSection heroContent={trendingSeries} onContentClick={handleSeriesClick} mediaType="tv" />
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
          <ContentGrid content={searchResults.map((item) => ({ ...item, media_type: "tv" }))} onClick={handleSeriesClick} />
        </div>
      ) : (
        genres.map((genre) => (
          <div key={genre.id} className="genre-section">
            <h2>{genre.name} Series</h2>
            <ContentGrid
              content={seriesByGenre[genre.name] || []}
              onClick={handleSeriesClick}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default SeriesPage;
