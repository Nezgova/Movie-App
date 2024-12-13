import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './movieDetail.css';

const MovieDetailPage = () => {
  const { id } = useParams();  // Get the movie ID from the URL
  const [movie, setMovie] = useState(null);
  const apiKey = 'bfbc42cc51a737715f9ab554c951d6ad'; // TMDB API key

  // Fetch movie details by ID
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
        const data = await response.json();
        setMovie(data);  // Set the movie details in state
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) return <p>Loading movie details...</p>;

  return (
    <div className="movie-detail">
      <h1>{movie.title}</h1>
      <div className="movie-info">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="movie-poster"
        />
        <p>{movie.overview}</p>
      </div>
      <div className="movie-trailer">
        {/* Assuming the first trailer is available */}
        {movie.videos && movie.videos.results[0] ? (
          <iframe
            src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
            title="Trailer"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        ) : (
          <p>No trailer available</p>
        )}
      </div>

      <Link to={`/watch/${id}`}>
        <button className="watch-button">Watch Now</button>
      </Link>
    </div>
  );
};

export default MovieDetailPage;
