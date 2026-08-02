import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./movieDetail.css";
import { AppContainer, PageContainer } from "./layout/Layout";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const apiKey = "bfbc42cc51a737715f9ab554c951d6ad";

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits`);
        const movieData = await movieResponse.json();
        setMovie(movieData);
        setCast(movieData.credits?.cast || []);
        setCrew(movieData.credits?.crew || []);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) return <p className="detail-panel">Loading movie details...</p>;

  const directors = crew.filter((person) => person.job === "Director");
  const releaseYear = movie.release_date?.split("-")[0] || "—";

  return (
    <AppContainer>
      <PageContainer>
        <div className="movie-detail">
          <section className="detail-hero glass-panel">
            <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.title} />
            <div className="detail-hero-content">
              <p className="eyebrow">Now streaming</p>
              <h1>{movie.title}</h1>
              <div className="detail-meta">
                <span>{releaseYear}</span>
                <span>{movie.runtime} min</span>
                <span>{movie.vote_average?.toFixed(1)}/10 rating</span>
              </div>
              <p>{movie.overview}</p>
              <div className="hero-actions">
                <Link className="link" to={`/watch/${id}`}>
                  <button className="btn btn-primary">▶ Play now</button>
                </Link>
              </div>
            </div>
          </section>

          <div className="detail-content-grid">
            <div className="detail-panel">
              <h2>Synopsis</h2>
              <p>{movie.overview || "A cinematic experience awaits in this premium release."}</p>
              <div className="detail-stats">
                <span>Genres: {movie.genres?.slice(0, 3).map((genre) => genre.name).join(", ") || "—"}</span>
                <span>Original language: {movie.original_language?.toUpperCase()}</span>
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
                  <h3>Director</h3>
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
        </div>
      </PageContainer>
    </AppContainer>
  );
};

export default MovieDetailPage;