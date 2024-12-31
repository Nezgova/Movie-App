import React, { useEffect, useState, useCallback } from "react";
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
  const [selectedGenreName, setSelectedGenreName] = useState(""); // Add this state for genre name
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

  const handleSearch = useCallback(async () => {
    try {
      let endpoint;
      let url;

      if (searchQuery.trim() === "" && selectedGenre) {
        endpoint = "discover/tv";
        url = `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&with_genres=${selectedGenre}&include_adult=false`;
      } else if (searchQuery.trim() !== "") {
        endpoint = "search/tv";
        url = `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}&include_adult=false`;
        if (selectedGenre) {
          url += `&with_genres=${selectedGenre}`;
        }
      } else {
        setSearchResults([]);
        return;
      }

      const response = await fetch(url);
      const data = await response.json();

      const formattedResults = data.results.map(item => ({
        ...item,
        media_type: "tv"
      }));

      setSearchResults(formattedResults);

    } catch (error) {
      console.error("Error searching series:", error);
      setSearchResults([]);
    }
  }, [searchQuery, selectedGenre, apiKey]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedGenre, handleSearch]);

  const handleGenreChange = (newGenre) => {
    setSelectedGenre(newGenre);
    // Find and set the genre name when genre is selected
    if (newGenre) {
      const selectedGenreObj = genres.find(genre => genre.id.toString() === newGenre.toString());
      setSelectedGenreName(selectedGenreObj ? selectedGenreObj.name : '');
    } else {
      setSelectedGenreName('');
    }
  };

  const getResultsTitle = () => {
    if (searchQuery && selectedGenreName) {
      return `Search Results for "${searchQuery}" in ${selectedGenreName}`;
    } else if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    } else if (selectedGenreName) {
      return `${selectedGenreName} Series`;
    } else {
      return "Search Results";
    }
  };

  return (
    <div className="seriespage">
      <HeroSection 
        heroContent={trendingSeries} 
        onContentClick={handleSeriesClick} 
        mediaType="tv" 
      />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        genres={genres}
        selectedGenre={selectedGenre}
        setSelectedGenre={handleGenreChange}
      />

      {searchResults.length > 0 ? (
        <div className="search-results">
          <h2>{getResultsTitle()}</h2>
          <ContentGrid 
            content={searchResults} 
            onClick={handleSeriesClick} 
          />
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