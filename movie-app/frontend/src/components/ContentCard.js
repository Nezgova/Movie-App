import React, { useEffect } from "react";
import "./ContentCard.css";

const ContentCard = ({ id, title, image, mediaType, onClick }) => {
  useEffect(() => {
    const card = document.querySelector(`#card-${id}`);

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--y", `${y}px`);
    };

    // Add the mousemove event listener
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [id]);

  return (
    <div className="content-card-container" onClick={() => onClick(id, mediaType)}>
      <div id={`card-${id}`} className="content-card">
        <div className="card-poster">
          <img src={image} alt={title} />
        </div>
      </div>
      <h3 className="card-title">{title}</h3>
    </div>
  );
};

export default ContentCard;
