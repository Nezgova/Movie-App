import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./heroSection.css";

const HeroSection = ({ heroContent, onContentClick, mediaType = "movie" }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!heroContent.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroContent.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [heroContent.length]);

  const currentContent = heroContent[currentSlide] || heroContent[0];

  if (!currentContent) {
    return null;
  }

  const handleWatch = () => onContentClick(currentContent.id, currentContent.media_type || mediaType);

  return (
    <motion.section
      className="hero-section glass-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div
        className="hero-backdrop"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.45) 50%, rgba(2,6,23,0.2) 100%), url(https://image.tmdb.org/t/p/original${currentContent.backdrop_path})`
        }}
      />
      <div className="hero-content-shell">
        <div className="hero-copy">
          <p className="eyebrow">Featured {mediaType === "movie" ? "Movie" : mediaType === "tv" ? "Series" : "Pick"}</p>
          <h1>{currentContent.title || currentContent.name}</h1>
          <p className="hero-overview">{currentContent.overview || "Discover the latest cinematic highlights and award-winning storytelling."}</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={handleWatch}>▶ Watch now</button>
            <button className="btn btn-secondary" onClick={() => setCurrentSlide((prev) => (prev + 1) % heroContent.length)}>Next spotlight</button>
          </div>
          <div className="hero-dots" aria-label="Hero content navigation">
            {heroContent.slice(0, 6).map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${currentSlide === index ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Show spotlight ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;