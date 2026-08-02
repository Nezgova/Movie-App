import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './WatchPageSerie.css';
import { AppContainer, PageContainer } from './layout/Layout';

const WatchPageSerie = () => {
  const { id, season, episode } = useParams(); // Get series ID, season, and episode from the URL
  const [serie, setSerie] = useState(null);
  const [episodes, setEpisodes] = useState([]); // Episodes for the selected season
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [totalSeasons, setTotalSeasons] = useState(0); // Total number of seasons
  const apiKey = 'bfbc42cc51a737715f9ab554c951d6ad'; // TMDB API key
  const navigate = useNavigate(); // For programmatically navigating to the updated URL

  // Fetch series details and episodes for the selected season
  useEffect(() => {
    const fetchSerieAndEpisodes = async () => {
      try {
        // Fetch series information
        const serieResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`
        );
        const serieData = await serieResponse.json();
        setSerie(serieData);
        setTotalSeasons(serieData.number_of_seasons); // Set total seasons
        console.log('Series Data:', serieData);

        // Fetch episodes for the current season
        const seasonResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${apiKey}`
        );
        const seasonData = await seasonResponse.json();
        console.log('Season Data:', seasonData);

        setEpisodes(seasonData.episodes || []);

        // Set the selected episode based on the URL
        const selectedEp = seasonData.episodes?.find(
          ep => ep.episode_number === parseInt(episode)
        );
        setSelectedEpisode(selectedEp);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSerieAndEpisodes();
  }, [id, season, episode]);

  // Handle season change
  const handleSeasonChange = (e) => {
    const selectedSeason = e.target.value; // Get selected season number
    navigate(`/watchserie/${id}/${selectedSeason}/1`); // Navigate to the first episode of the new season
  };

  // Handle episode selection
  const handleEpisodeClick = (ep) => {
    setSelectedEpisode(ep);
    navigate(`/watchserie/${id}/${ep.season_number}/${ep.episode_number}`);
  };

  // Generate the video URL for the selected episode
  const generateVideoUrl = () => {
    const sNumber = selectedEpisode?.season_number || season || 1;
    const eNumber = selectedEpisode?.episode_number || episode || 1;
    return `https://vidsrc.sbs/embed/tv/${id}/${sNumber}/${eNumber}`;
  };

  if (!serie || !episodes.length) return <p>Loading...</p>;

  return (
    <AppContainer>
      <PageContainer>
        <div className="watch-page-serie">
          <div className="media-description glass-panel">
            <h1>{serie.name}</h1>
            <div className="serie-rating">
              <strong>Rating:</strong> {serie.vote_average} / 10
            </div>
            <p>{serie.overview}</p>
          </div>

          <div className="video-player glass-panel">
            {selectedEpisode ? (
              <>
                <h2>Season {selectedEpisode.season_number}, Episode {selectedEpisode.episode_number}</h2>
                <iframe src={generateVideoUrl()} title="Video Player" frameBorder="0" allowFullScreen />
              </>
            ) : (
              <p>Loading video...</p>
            )}
          </div>

          <div className="controls-panel">
            <div className="season-selector glass-panel">
              <h3>Select Season</h3>
              <select value={season} onChange={handleSeasonChange}>
                {[...Array(totalSeasons)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>Season {index + 1}</option>
                ))}
              </select>
            </div>

            <div className="episode-tabs glass-panel">
              <h3>Episodes</h3>
              <ul className="episode-list">
                {episodes.map((ep) => (
                  <li key={ep.id} className={selectedEpisode?.id === ep.id ? 'selected' : ''} onClick={() => handleEpisodeClick(ep)}>
                    <button>{ep.episode_number}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </PageContainer>
    </AppContainer>
  );
};

export default WatchPageSerie;
