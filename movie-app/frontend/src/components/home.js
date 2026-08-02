import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import HeroSection from "./HeroSection";
import SearchBar from "./SearchBar";
import ContentGrid from "./ContentGrid";
import { AppContainer, PageContainer, Section } from "./layout/Layout";

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const apiKey = "bfbc42cc51a737715f9ab554c951d6ad";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const [trendingMoviesResponse, trendingSeriesResponse, popularMoviesResponse, popularSeriesResponse, topRatedMoviesResponse, topRatedSeriesResponse] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`),
          fetch(`https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}`),
          fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`),
          fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`),
          fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`),
          fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}`)
        ]);

        const [trendingMoviesData, trendingSeriesData, popularMoviesData, popularSeriesData, topRatedMoviesData, topRatedSeriesData] = await Promise.all([
          trendingMoviesResponse.json(),
          trendingSeriesResponse.json(),
          popularMoviesResponse.json(),
          popularSeriesResponse.json(),
          topRatedMoviesResponse.json(),
          topRatedSeriesResponse.json()
        ]);

        setTrendingMovies(trendingMoviesData.results || []);
        setTrendingSeries(trendingSeriesData.results || []);
        setPopularMovies(popularMoviesData.results || []);
        setPopularSeries(popularSeriesData.results || []);
        setTopRatedMovies(topRatedMoviesData.results || []);
        setTopRatedSeries(topRatedSeriesData.results || []);
      } catch (error) {
        console.error("Error fetching home content:", error);
      }
    };

    fetchHomeContent();
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

  const featuredHero = [...trendingMovies.slice(0, 6), ...trendingSeries.slice(0, 6)];
  const continueWatching = [...trendingMovies.slice(0, 6), ...trendingSeries.slice(0, 6)];

  return (
    <AppContainer>
      <PageContainer>
        <div className="homepage">
          <HeroSection
            heroContent={featuredHero}
            onContentClick={handleContentClick}
            mediaType="multi"
          />

          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />

          {searchResults.length > 0 && (
            <Section title="Search Results" subtitle="Matched titles, series, and trending picks">
              <ContentGrid content={searchResults.slice(0, 12)} onClick={handleContentClick} />
            </Section>
          )}

          <Section title="Continue Watching" subtitle="Jump back into your next pick" action={<button onClick={() => navigate("/movies")} className="view-more-btn">Explore more</button>}>
            <ContentGrid content={continueWatching.slice(0, 12)} onClick={handleContentClick} />
          </Section>

          <Section title="Trending Movies" subtitle="Popular picks for your next watch" action={<button onClick={() => navigate("/movies")} className="view-more-btn">Browse all</button>}>
            <ContentGrid content={trendingMovies.slice(0, 12)} onClick={handleContentClick} />
          </Section>

          <Section title="Trending Series" subtitle="Binge-worthy stories at a glance" action={<button onClick={() => navigate("/series")} className="view-more-btn">Browse all</button>}>
            <ContentGrid content={trendingSeries.slice(0, 12)} onClick={handleContentClick} />
          </Section>

          <Section title="Popular Movies" subtitle="Audience favorites right now">
            <ContentGrid content={popularMovies.slice(0, 12)} onClick={handleContentClick} />
          </Section>

          <Section title="Popular Series" subtitle="Freshly loved stories and award contenders">
            <ContentGrid content={popularSeries.slice(0, 12)} onClick={handleContentClick} />
          </Section>

          <Section title="Top Rated" subtitle="Critically celebrated releases">
            <ContentGrid content={[...topRatedMovies.slice(0, 6), ...topRatedSeries.slice(0, 6)]} onClick={handleContentClick} />
          </Section>
        </div>
      </PageContainer>
    </AppContainer>
  );
};

export default HomePage;
