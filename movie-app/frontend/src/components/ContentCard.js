import React from "react";
import "./ContentCard.css";
import { useFavorites } from "./FavoritesContext";

const ContentCard = ({ id, title, image, mediaType, onClick }) => {
  const { favoriteContent, setFavoriteContent } = useFavorites();

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent triggering the card's onClick
    const isAlreadyFavorite = favoriteContent.some((item) => item.id === id);
    if (!isAlreadyFavorite) {
      setFavoriteContent([...favoriteContent, { id, title, image, mediaType }]);
    }
  };

  return (
    <div className="content-card-container" onClick={() => onClick(id, mediaType)}>
      <div id={`card-${id}`} className="content-card">
        <div className="card-poster">
          <img src={image} alt={title} />
          <button className="fav-btn" onClick={handleFavoriteClick}>
            +
          </button>
        </div>
      </div>
      <h3 className="card-title">{title}</h3>
    </div>
  );
};

export default ContentCard;
