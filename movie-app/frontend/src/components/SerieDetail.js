import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './serieDetail.css';

const SerieDetail = () => {
  const { id } = useParams(); // Get the series ID from the URL
  const [series, setSeries] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1); // Default to season 1
  const [selectedEpisode, setSelectedEpisode] = useState(1); // Default to episode 1
  const apiKey = 'bfbc42cc51a737715f9ab554c951d6ad'; // TMDB API key

  // Fetch series details by ID
  useEffect(() => {
    const fetchSerieDetails = async () => {
      try {
        const seriesResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=credits`
        );
        const seriesData = await seriesResponse.json();
        setSeries(seriesData); // Set the series details in state

        setCast(seriesData.credits.cast);
        setCrew(seriesData.credits.crew);
      } catch (error) {
        console.error('Error fetching series details:', error);
      }
    };

    fetchSerieDetails();
  }, [id]);

  if (!series) return <p>Loading series details...</p>;

  // Extracting series rating
  const seriesRating = series.vote_average;

  return (
    <div className="serie-detail">
      <h1>{series.name}</h1>
      <div className="serie-info">
        <img
          src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
          alt={series.name}
          className="serie-poster"
        />
        <div className="serie-description">
          <p>{series.overview}</p>
          <div className="serie-rating">
            <strong>Rating:</strong> {seriesRating} / 10
          </div>
          <div className="serie-episodes">
            <strong>Total Episodes:</strong> {series.number_of_episodes}
          </div>
          <div className="serie-seasons">
            <strong>Total Seasons:</strong> {series.number_of_seasons}
          </div>
        </div>
      </div>

      {/* Season and Episode Selection */}
      <div className="season-episode-selection">
        <label>Season:</label>
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
        >
          {Array.from({ length: series.number_of_seasons }, (_, i) => i + 1).map(
            (season) => (
              <option key={season} value={season}>
                Season {season}
              </option>
            )
          )}
        </select>

        <label>Episode:</label>
        <select
          value={selectedEpisode}
          onChange={(e) => setSelectedEpisode(e.target.value)}
        >
          {Array.from(
            { length: series.seasons[selectedSeason - 1]?.episode_count },
            (_, i) => i + 1
          ).map((episode) => (
            <option key={episode} value={episode}>
              Episode {episode}
            </option>
          ))}
        </select>
      </div>

      {/* Watch Button */}
      <Link to={`/watchserie/${id}/${selectedSeason}/${selectedEpisode}`}>
        <button className="watch-button">Watch Now</button>
      </Link>
    </div>
  );
};

export default SerieDetail;
