import React, { useEffect, useRef } from "react";
import "./ContentCard.css";

const ContentCard = ({ id, title, image, mediaType, onClick }) => {
  const cardRef = useRef(null);

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

  return (
    <div className="content-card-container" onClick={() => onClick(id, mediaType)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onClick(id, mediaType)}>
      <div id={`card-${id}`} className="content-card" ref={cardRef}>
        <div className="card-poster">
          <img src={image || "https://via.placeholder.com/500x750?text=No+Image"} alt={title} />
          <div className="content-card-overlay">
            <div className="card-meta">
              <span className="card-chip">{mediaType === "tv" ? "Series" : "Movie"}</span>
              <span className="card-chip">4K</span>
            </div>
            <h3 className="card-title">{title}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
