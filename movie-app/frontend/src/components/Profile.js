import React, { useEffect, useState } from "react";
import { useFavorites } from "./FavoritesContext";
import { useNavigate } from "react-router-dom";
import ContentGrid from "./ContentGrid";
import "./Profile.css";

const ProfilePage = () => {
  const { favoriteContent, loading } = useFavorites();
  const [enrichedContent, setEnrichedContent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        const enrichedResults = await Promise.all(
          favoriteContent.map(async (item) => {
            const type = item.mediaType;
            const url = `https://api.themoviedb.org/3/${type}/${item.id}?api_key=bfbc42cc51a737715f9ab554c951d6ad`;
            
            const response = await fetch(url);
            const data = await response.json();

            // Get the image from poster_path or backdrop_path
            const image = data.poster_path
              ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
              : data.backdrop_path
              ? `https://image.tmdb.org/t/p/w500${data.backdrop_path}`
              : '/LOGO.png'; // Fallback to logo image

            return {
              ...item,
              title: type === 'tv' ? data.name : data.title,
              image: image,
            };
          })
        );
        
        setEnrichedContent(enrichedResults);
      } catch (error) {
        console.error('Error fetching content details:', error);
      }
    };

    if (favoriteContent.length > 0) {
      fetchContentDetails();
    }
  }, [favoriteContent]);

  const handleContentClick = (id, mediaType) => {
    const route = mediaType === "tv" ? `/seriedetail/${id}` : `/movie/${id}`;
    navigate(route);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <h1>Your Favorites</h1>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  const favoriteMovies = enrichedContent.filter((item) => item.mediaType === "movie");
  const favoriteSeries = enrichedContent.filter((item) => item.mediaType === "tv");

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
              media_type: "movie"
            }))}
            onClick={handleContentClick}
            isProfilePage={true}
          />
        ) : (
          <p className="no-favorites">No favorite movies yet!</p>
        )}
      </div>

      <div className="favorites-section">
        <h2>Favorite Series</h2>
        {favoriteSeries.length > 0 ? (
          <ContentGrid
            content={favoriteSeries.map((item) => ({
              ...item,
              poster_path: item.image.replace("https://image.tmdb.org/t/p/w500", ""),
              media_type: "tv"
            }))}
            onClick={handleContentClick}
            isProfilePage={true}
          />
        ) : (
          <p className="no-favorites">No favorite series yet!</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
