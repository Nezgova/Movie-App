import React, { useEffect, useRef, useState } from "react";
import "./ContentCard.css";
import { useFavorites } from "./FavoritesContext";

const ContentCard = ({ id, title, image, mediaType, onClick, isProfilePage, onRemoveFavorite }) => {
  const cardRef = useRef(null);
  const { favoriteContent, addToFavorites, removeFromFavorites } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--y", `${y}px`);
    };

    card.addEventListener("mousemove", handleMouseMove);
    return () => card.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      if (isProfilePage) {
        await removeFromFavorites(id);
        onRemoveFavorite?.(id);
      } else {
        const isAlreadyFavorite = favoriteContent.some((item) => item.id === id);
        if (!isAlreadyFavorite) {
          await addToFavorites({
            id,
            title,
            image,
            mediaType: mediaType || "movie"
          });
        }
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
      // You might want to add some error notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="content-card-container" onClick={() => onClick(id, mediaType)}>
      <div id={`card-${id}`} className="content-card" ref={cardRef}>
        <div className="card-poster">
          <img
            src={image || "https://via.placeholder.com/500x750?text=No+Image"}
            alt={title}
          />
          <button 
            className={`fav-btn ${isProfilePage ? 'remove-btn' : ''} ${isLoading ? 'loading' : ''}`}
            onClick={handleFavoriteClick}
            disabled={isLoading}
          >
            {isLoading ? '...' : isProfilePage ? '−' : '+'}
          </button>
        </div>
      </div>
      <h3 className="card-title">{title}</h3>
    </div>
  );
};

export default ContentCard;