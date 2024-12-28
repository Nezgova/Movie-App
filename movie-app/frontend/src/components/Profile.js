import React from "react";
import { useFavorites } from "./FavoritesContext"; // Assuming FavoritesContext is used to store favorite content
import { useNavigate } from "react-router-dom";
import ContentGrid from "./ContentGrid";
import "./Profile.css";

const ProfilePage = () => {
  const { favoriteContent } = useFavorites();  // Retrieve favorite content from context
  const navigate = useNavigate();

  // Separate movies and series (optional but makes it cleaner)
  const favoriteMovies = favoriteContent.filter((item) => item.mediaType === "movie");
  const favoriteSeries = favoriteContent.filter((item) => item.mediaType === "tv");

  // Handle content click for navigation
  const handleContentClick = (id, mediaType) => {
    // Navigate based on media type (movie or series)
    const route = mediaType === "movie" ? `/movie/${id}` : `/seriedetail/${id}`;
    navigate(route);  // Navigate to the correct detail page
  };

  return (
    <div className="profile-page">
      <h1>Your Favorites</h1>

      {/* Favorite Movies Section */}
      <div className="favorites-section">
        <h2>Favorite Movies</h2>
        {favoriteMovies.length > 0 ? (
          <ContentGrid
            content={favoriteMovies.map((item) => ({
              ...item,
              poster_path: item.image.replace("https://image.tmdb.org/t/p/w500", ""),
            }))}
            onClick={handleContentClick} // Pass the click handler here
          />
        ) : (
          <p>No favorite movies yet!</p>
        )}
      </div>

      {/* Favorite Series Section */}
      <div className="favorites-section">
        <h2>Favorite Series</h2>
        {favoriteSeries.length > 0 ? (
          <ContentGrid
            content={favoriteSeries.map((item) => ({
              ...item,
              poster_path: item.image.replace("https://image.tmdb.org/t/p/w500", ""),
            }))}
            onClick={handleContentClick} // Pass the click handler here
          />
        ) : (
          <p>No favorite series yet!</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
