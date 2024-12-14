import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './movieDetail.css';

const MovieDetailPage = () => {
  const { id } = useParams();  // Get the movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const apiKey = 'bfbc42cc51a737715f9ab554c951d6ad'; // TMDB API key

  // Fetch movie details by ID
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Fetch movie details
        const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits`);
        const movieData = await movieResponse.json();
        setMovie(movieData);  // Set the movie details in state

        // Set cast and crew
        setCast(movieData.credits.cast);
        setCrew(movieData.credits.crew);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movie) return <p>Loading movie details...</p>;

  // Extracting movie rating
  const movieRating = movie.vote_average;

  return (
    <div className="movie-detail">
      <h1>{movie.title}</h1>
      <div className="movie-info">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="movie-poster"
        />
        <div className="movie-description">
          <p>{movie.overview}</p>
          <div className="movie-rating">
            <strong>Rating:</strong> {movieRating} / 10
          </div>
        </div>
      </div>

      {/* Actors Section */}
      <div className="movie-cast">
        <h2>Cast</h2>
        <div className="cast-list">
          {cast.slice(0, 6).map((actor) => (
            <div className="cast-member" key={actor.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                alt={actor.name}
                className="actor-photo"
              />
              <p>{actor.name}</p>
              <p>{actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Director Section */}
      <div className="movie-director">
        <h2>Director</h2>
        {crew.filter((person) => person.job === 'Director').map((director) => (
          <div key={director.id} className="director-info">
            <img
              src={`https://image.tmdb.org/t/p/w500${director.profile_path}`}
              alt={director.name}
              className="director-photo"
            />
            <p>{director.name}</p>
          </div>
        ))}
      </div>

      <Link to={`/watch/${id}`}>
        <button className="watch-button">Watch Now</button>
      </Link>
    </div>
  );
};

export default MovieDetailPage;
