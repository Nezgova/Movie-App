import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./serieDetail.css";

const SerieDetailPage = () => {
  const { id } = useParams(); // Get the series ID from the URL
  const [serie, setSerie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [seasons, setSeasons] = useState([]); // Store the seasons data
  const [episodes, setEpisodes] = useState([]); // Store episodes for selected season
  const [selectedSeason, setSelectedSeason] = useState(1); // Set default season to 1
  const [selectedEpisode, setSelectedEpisode] = useState(1); // Set default episode to 1
  const apiKey = "bfbc42cc51a737715f9ab554c951d6ad"; // TMDB API key

  // Fetch series details by ID
  useEffect(() => {
    const fetchSerieDetails = async () => {
      try {
        const serieResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=credits,seasons`
        );
        const serieData = await serieResponse.json();
        console.log(serieData); // Log the entire serie data to check the structure
        setSerie(serieData);
        setCast(serieData.credits?.cast || []);
        setCrew(serieData.credits?.crew || []);
        setSeasons(serieData.seasons || []); // Store the season data
      } catch (error) {
        console.error("Error fetching series details:", error);
      }
    };

    fetchSerieDetails();
  }, [id]);

  // Fetch episodes for the selected season
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const seasonResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${apiKey}`
        );
        const seasonData = await seasonResponse.json();
        setEpisodes(seasonData.episodes || []); // Store episodes for the selected season
        setSelectedEpisode(1); // Reset episode to 1 when the season changes
      } catch (error) {
        console.error("Error fetching episodes:", error);
      }
    };

    if (selectedSeason && serie) {
      fetchEpisodes();
    }
  }, [selectedSeason, id, serie]);

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
          {cast.length > 0 ? (
            cast.slice(0, 6).map((actor) => (
              <div className="cast-member" key={actor.id}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                  alt={actor.name}
                  className="actor-photo"
                />
                <p>{actor.name}</p>
                <p>{actor.character}</p>
              </div>
            ))
          ) : (
            <p>No cast information available.</p>
          )}
        </div>
      </div>

      {/* Director Section */}
      <div className="serie-director">
        <h2>Director</h2>
        {crew.filter((person) => person.known_for_department === "Directing")
          .length > 0 ? (
          <div className="director-list">
            {crew
              .filter((person) => person.known_for_department === "Directing")
              .map((director) => (
                <div key={director.id} className="director-info">
                  <img
                    src={
                      director.profile_path
                        ? `https://image.tmdb.org/t/p/w500${director.profile_path}`
                        : "https://via.placeholder.com/150" // Placeholder image if no profile picture
                    }
                    alt={director.name}
                    className="director-photo"
                  />
                  <p>{director.name}</p>
                </div>
              ))}
          </div>
        ) : (
          <p>No director information available.</p>
        )}
      </div>

      {/* Season and Episode Selection */}
      <div className="season-episode-section">
        <h3 className="season-episode-title">Select Season:</h3>
        <select
          className="season-select"
          value={selectedSeason}
          onChange={handleSeasonChange}
        >
          {seasons.map((season) => (
            <option key={season.season_number} value={season.season_number}>
              Season {season.season_number}
            </option>
          ))}
        </select>

        <h3 className="season-episode-title">Select Episode:</h3>
        <select
          className="episode-select"
          value={selectedEpisode}
          onChange={handleEpisodeChange}
        >
          {episodes.length > 0 ? (
            episodes.map((episode) => (
              <option key={episode.id} value={episode.episode_number}>
                Episode {episode.episode_number} - {episode.name}
              </option>
            ))
          ) : (
            <option>No episodes available</option>
          )}
        </select>
      </div>

      {/* Watch Now Button */}
      <Link
        className="link"
        to={`/watchserie/${id}/${selectedSeason}/${selectedEpisode}`}
      >
        <button className="watch-button">Watch Now</button>
      </Link>
    </div>
  );
};

export default SerieDetailPage;
