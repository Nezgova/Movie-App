import React from "react";
import "./ContentGrid.css";
import ContentCard from "./ContentCard";

const ContentGrid = ({ content, onClick, isProfilePage, onRemoveFavorite }) => {
  return (
    <div className="content-grid">
      {content.map((item) => {
        const posterUrl = item.poster_path
          ? (item.poster_path.startsWith('http') ? item.poster_path : `https://image.tmdb.org/t/p/w500${item.poster_path}`)
          : item.image || "../../public/LOGO.png";

        return (
          <ContentCard
            key={item.id}
            id={item.id}
            title={item.title || item.name}
            image={posterUrl}
            mediaType={item.media_type || item.mediaType || "movie"}
            onClick={onClick}
            isProfilePage={isProfilePage}
            onRemoveFavorite={onRemoveFavorite}
          />
        );
      })}
    </div>
  );
};

export default ContentGrid;
