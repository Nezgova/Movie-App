import React from "react";
import "./ContentGrid.css";
import ContentCard from "./ContentCard";

const ContentGrid = ({ content, onClick }) => {
  return (
    <div className="content-grid">
      {content.map((item) => (
        <ContentCard
          key={item.id}
          id={item.id}
          title={item.title || item.name}
          image={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
          mediaType={item.media_type || "movie"} // Determine the media type (movie or tv)
          onClick={onClick}
        />
      ))}
    </div>
  );
};

export default ContentGrid;
