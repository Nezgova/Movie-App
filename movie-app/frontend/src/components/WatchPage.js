import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./watchPage.css";

const WatchPage = () => {
  const { id } = useParams(); // Get the movie ID from the URL
  const [movie, setMovie] = useState(null); // Movie data state

  const apiKey = "bfbc42cc51a737715f9ab554c951d6ad"; // TMDB API key

  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
        );
        const movieData = await movieResponse.json();
        setMovie(movieData);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Generate video URL for the movie
  const generateVideoUrl = () => {
    return `https://vidsrc.sbs/embed/movie/${id}`;
  };

  if (!movie) return <p>Loading movie details...</p>;

  return (
    <div className="watch-page">
      {/* Movie Info */}
      <div className="media-description">
        <h1>{movie.title}</h1>
        <div className="movie-rating">
          <strong>Rating:</strong> {movie.vote_average} / 10
        </div>
        <p>{movie.overview}</p>
      </div>

      {/* Video Player */}
      <div className="video-player">
        <h2>Now Watching: {movie.title}</h2>
        <iframe
          src={generateVideoUrl()}
          title="Movie Player"
          width="100%"
          height="600"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default WatchPage;
