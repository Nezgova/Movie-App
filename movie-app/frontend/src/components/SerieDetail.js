import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './serieDetail.css';

const SerieDetailPage = () => {
  const { id } = useParams();  // Get the series ID from the URL
  const [serie, setSerie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1); // Set default season to 1
  const [selectedEpisode, setSelectedEpisode] = useState(1); // Set default episode to 1
  const apiKey = 'bfbc42cc51a737715f9ab554c951d6ad'; // TMDB API key

  // Fetch series details by ID
  useEffect(() => {
    const fetchSerieDetails = async () => {
      try {
        // Fetch series details
        const serieResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=credits`);
        const serieData = await serieResponse.json();
        setSerie(serieData);  // Set the series details in state

        // Set cast and crew
        setCast(serieData.credits?.cast || []);
        setCrew(serieData.credits?.crew || []);
      } catch (error) {
        console.error('Error fetching series details:', error);
      }
    };

    fetchSerieDetails();
  }, [id]);

  // Ensure the data is available before rendering
  if (!serie) return <p>Loading series details...</p>;

  const serieRating = serie.vote_average;

  // Handle season change
  const handleSeasonChange = (e) => {
    setSelectedSeason(parseInt(e.target.value)); // Update selected season
  };

  // Handle episode change
  const handleEpisodeChange = (e) => {
    setSelectedEpisode(parseInt(e.target.value)); // Update selected episode
  };

  return (
    <div className="serie-detail">
      <h1>{serie.name}</h1>
      <div className="serie-info">
        <img
          src={`https://image.tmdb.org/t/p/w500${serie.poster_path}`}
          alt={serie.name}
          className="serie-poster"
        />
        <div className="serie-description">
          <p>{serie.overview}</p>
          <div className="serie-rating">
            <strong>Rating:</strong> {serieRating} / 10
          </div>
        </div>
      </div>

      {/* Actors Section */}
      <div className="serie-cast">
        <h2>Cast</h2>
        <div className="cast-list">
          {cast.length > 0 ? cast.slice(0, 6).map((actor) => (
            <div className="cast-member" key={actor.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                alt={actor.name}
                className="actor-photo"
              />
              <p>{actor.name}</p>
              <p>{actor.character}</p>
            </div>
          )) : <p>No cast information available.</p>}
        </div>
      </div>

      {/* Director Section */}
      <div className="serie-director">
        <h2>Director</h2>
        {crew.length > 0 ? crew.filter((person) => person.job === 'Director').map((director) => (
          <div key={director.id} className="director-info">
            <img
              src={`https://image.tmdb.org/t/p/w500${director.profile_path}`}
              alt={director.name}
              className="director-photo"
            />
            <p>{director.name}</p>
          </div>
        )) : <p>No director information available.</p>}
      </div>

      {/* Season and Episode Selection */}
      <div className="season-episode-selector">
        <h3>Select Season:</h3>
        <select value={selectedSeason} onChange={handleSeasonChange}>
          {[...Array(serie.number_of_seasons)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              Season {index + 1}
            </option>
          ))}
        </select>

        <h3>Select Episode:</h3>
        <select value={selectedEpisode} onChange={handleEpisodeChange}>
          {[...Array(serie.number_of_episodes)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              Episode {index + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Watch Now Button */}
      <Link to={`/watchserie/${id}/${selectedSeason}/${selectedEpisode}`}>
        <button className="watch-button">Watch Now</button>
      </Link>
    </div>
  );
};

export default SerieDetailPage;
