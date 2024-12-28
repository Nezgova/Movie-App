import React, { useState, useEffect } from "react";
import "./heroSection.css";

const HeroSection = ({ heroContent, onContentClick, mediaType = "movie" }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === heroContent.length - 1 ? 0 : prev + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroContent.length]);

  // Handle manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="hero-section">
      <div 
        className="hero-wrapper"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {heroContent.map((content, index) => (
          <div
            key={index}
            className="hero-slide"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(https://image.tmdb.org/t/p/original${content.backdrop_path})`
            }}
          >
            <div className="hero-content">
              <div className="hero-content-inner">
                <h1>{content.title || content.name}</h1>
                <p>{content.overview}</p>
                <button 
                  onClick={() => onContentClick(content.id, content.media_type || mediaType)}
                >
                  Watch Now
                </button>
                {/* Navigation dots moved inside content area */}
                <div className="hero-dots">
                  {heroContent.map((_, index) => (
                    <div
                      key={index}
                      className={`hero-dot ${currentSlide === index ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;