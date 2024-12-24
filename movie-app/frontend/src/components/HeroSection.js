import React from "react";
import "./heroSection.css";

const HeroSection = ({ heroContent, onContentClick, mediaType = "movie" }) => {
  return (
    <div className="hero-section">
      <div className="hero-wrapper">
        {heroContent.map((content, index) => (
          <div
            key={index}
            className="hero-slide"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${content.backdrop_path})`,
            }}
          >
            <div className="hero-content">
              <h1>{content.title || content.name}</h1>
              <p>{content.overview}</p>
              <button onClick={() => onContentClick(content.id, content.media_type || mediaType)}>
                Watch Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
