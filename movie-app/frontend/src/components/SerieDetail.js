import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./serieDetail.css";
import { AppContainer, PageContainer } from "./layout/Layout";

const SerieDetailPage = () => {
  const { id } = useParams();
  const [serie, setSerie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const apiKey = "bfbc42cc51a737715f9ab554c951d6ad";

  useEffect(() => {
    const fetchSerieDetails = async () => {
      try {
        const serieResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=credits,seasons`);
        const serieData = await serieResponse.json();
        setSerie(serieData);
        setCast(serieData.credits?.cast || []);
        setCrew(serieData.credits?.crew || []);
        setSeasons(serieData.seasons || []);
      } catch (error) {
        console.error("Error fetching series details:", error);
      }
    };

    fetchSerieDetails();
  }, [id]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const seasonResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${apiKey}`);
        const seasonData = await seasonResponse.json();
        setEpisodes(seasonData.episodes || []);
        setSelectedEpisode(1);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      }
    };

    if (selectedSeason && serie) {
      fetchEpisodes();
    }
  }, [selectedSeason, id, serie]);

  if (!serie) return <p className="detail-panel">Loading series details...</p>;

  const directors = crew.filter((person) => person.known_for_department === "Directing");
  const releaseYear = serie.first_air_date?.split("-")[0] || "—";

  return (
    <AppContainer>
      <PageContainer>
        <div className="serie-detail">
          <section className="detail-hero glass-panel">
            <img src={`https://image.tmdb.org/t/p/original${serie.backdrop_path}`} alt={serie.name} />
            <div className="detail-hero-content">
              <p className="eyebrow">Featured series</p>
              <h1>{serie.name}</h1>
              <div className="detail-meta">
                <span>{releaseYear}</span>
                <span>{serie.number_of_seasons} seasons</span>
                <span>{serie.vote_average?.toFixed(1)}/10 rating</span>
              </div>
              <p>{serie.overview}</p>
              <div className="hero-actions">
                <Link className="link" to={`/watchserie/${id}/${selectedSeason}/${selectedEpisode}`}>
                  <button className="btn btn-primary">▶ Watch now</button>
                </Link>
              </div>
            </div>
          </section>

          <div className="detail-content-grid">
            <div className="detail-panel">
              <h2>Overview</h2>
              <p>{serie.overview || "A premium streaming experience designed for binge-worthy evenings."}</p>
              <div className="detail-stats">
                <span>Genres: {serie.genres?.slice(0, 3).map((genre) => genre.name).join(", ") || "—"}</span>
                <span>Status: {serie.status}</span>
              </div>
            </div>
            <div className="detail-panel">
              <h3>Featured cast</h3>
              <div className="cast-list">
                {cast.slice(0, 6).map((actor) => (
                  <div className="cast-member" key={actor.id}>
                    <img src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : "https://via.placeholder.com/120"} alt={actor.name} className="actor-photo" />
                    <p>{actor.name}</p>
                    <p>{actor.character}</p>
                  </div>
                ))}
              </div>
              {directors.length > 0 && (
                <div className="director-block">
                  <h3>Directors</h3>
                  {directors.map((director) => (
                    <div key={director.id} className="director-info">
                      <img src={director.profile_path ? `https://image.tmdb.org/t/p/w500${director.profile_path}` : "https://via.placeholder.com/120"} alt={director.name} className="director-photo" />
                      <p>{director.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="detail-panel">
            <h3>Season and episode</h3>
            <div className="chip-row">
              <select className="season-select" value={selectedSeason} onChange={(e) => setSelectedSeason(parseInt(e.target.value, 10))}>
                {seasons.map((season) => <option key={season.season_number} value={season.season_number}>Season {season.season_number}</option>)}
              </select>
              <select className="episode-select" value={selectedEpisode} onChange={(e) => setSelectedEpisode(parseInt(e.target.value, 10))}>
                {episodes.length > 0 ? episodes.map((episode) => <option key={episode.id} value={episode.episode_number}>Episode {episode.episode_number} - {episode.name}</option>) : <option>No episodes available</option>}
              </select>
            </div>
          </div>
        </div>
      </PageContainer>
    </AppContainer>
  );
};

export default SerieDetailPage;