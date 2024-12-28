import React from "react";
import { useFavorites } from "./FavoritesContext";
import { useNavigate } from "react-router-dom";
import ContentGrid from "./ContentGrid";
import "./Profile.css";

const ProfilePage = () => {
  const { favoriteContent } = useFavorites();
  const navigate = useNavigate();

  const favoriteMovies = favoriteContent.filter((item) => item.mediaType === "movie");
  const favoriteSeries = favoriteContent.filter((item) => item.mediaType === "tv");

  const handleContentClick = (id, mediaType) => {
    // Use the mediaType from the content item to determine the route
    const route = mediaType === "tv" ? `/seriedetail/${id}` : `/movie/${id}`;
    navigate(route);
  };

  return (
    <div className="profile-page">
      <h1>Your Favorites</h1>

      <div className="favorites-section">
        <h2>Favorite Movies</h2>
        {favoriteMovies.length > 0 ? (
          <ContentGrid
            content={favoriteMovies.map((item) => ({
              ...item,
              poster_path: item.image.replace("https://image.tmdb.org/t/p/w500", ""),
              media_type: "movie"  // Explicitly set media_type to match API format
            }))}
            onClick={handleContentClick}
          />
        ) : (
          <p>No favorite movies yet!</p>
        )}
      </div>

      <div className="favorites-section">
        <h2>Favorite Series</h2>
        {favoriteSeries.length > 0 ? (
          <ContentGrid
            content={favoriteSeries.map((item) => ({
              ...item,
              poster_path: item.image.replace("https://image.tmdb.org/t/p/w500", ""),
              media_type: "tv"  // Explicitly set media_type to match API format
            }))}
            onClick={handleContentClick}
          />
        ) : (
          <p>No favorite series yet!</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;