import React from "react";
import "./Profile.css";
import ContentGrid from "./ContentGrid";
import { useFavorites } from "./FavoritesContext";

const ProfilePage = () => {
  const { favoriteContent } = useFavorites();

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Your Favorites</h1>
      </div>

      {favoriteContent.length > 0 ? (
        <ContentGrid content={favoriteContent} onClick={(id, mediaType) => {/* navigate to details */}} />
      ) : (
        <div className="empty-placeholder">
          <p>Your favorites list is empty!</p>
          <p>Start adding your favorite movies and series to see them here.</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
