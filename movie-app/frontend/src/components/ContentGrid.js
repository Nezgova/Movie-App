import React from "react";
import "./ContentGrid.css";
import ContentCard from "./ContentCard";

const ContentGrid = ({ content, onClick, isProfilePage, onRemoveFavorite }) => {
  return (
    <div className="content-grid">
      {content.map((item) => (
        <ContentCard
          key={item.id}
          id={item.id}
          title={item.title || item.name} // Use name for TV shows and title for movies
          image={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '../../public/LOGO.png'}  // Dynamically load the poster from TMDB or fallback to a default
          mediaType={item.media_type || "movie"}
          onClick={onClick}
          isProfilePage={isProfilePage}
          onRemoveFavorite={onRemoveFavorite}
        />
      ))}
    </div>
  );
};

export default ContentGrid;
