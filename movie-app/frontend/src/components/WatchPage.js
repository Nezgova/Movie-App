import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./watchPage.css";
import { AppContainer, PageContainer } from "./layout/Layout";

const WatchPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const apiKey = "bfbc42cc51a737715f9ab554c951d6ad";

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
        const movieData = await movieResponse.json();
        setMovie(movieData);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const generateVideoUrl = () => `https://vidsrc.sbs/embed/movie/${id}`;

  if (!movie) return <div className="detail-panel">Loading movie details...</div>;

  return (
    <AppContainer>
      <PageContainer>
        <div className="watch-page">
          <div className="watch-player-shell glass-panel">
            <div className="watch-player-header">
              <div>
                <p className="eyebrow">Now watching</p>
                <h1>{movie.title}</h1>
              </div>
              <div className="chip-row">
                <span className="pill">HD</span>
                <span className="pill">{movie.vote_average?.toFixed(1)}/10</span>
              </div>
            </div>
            <div className="video-player">
              <iframe src={generateVideoUrl()} title="Movie Player" allowFullScreen />
            </div>
            <div className="watch-footer">
              <p>{movie.overview}</p>
            </div>
          </div>
        </div>
      </PageContainer>
    </AppContainer>
  );
};

export default WatchPage;
