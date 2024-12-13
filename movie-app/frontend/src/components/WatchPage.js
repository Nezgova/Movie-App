import React from 'react';
import { useParams } from 'react-router-dom';
import './watchPage.css';

const WatchPage = () => {
  const { id } = useParams(); // Get the movie ID from the URL

  return (
    <div className="watch-page">
      <h1>Now Watching</h1>
      <iframe
        src={`https://vidsrc.icu/embed/movie/${id}`}
        title="Movie Player"
        frameBorder="0"
        allowFullScreen
        className="video-player"
      ></iframe>
    </div>
  );
};

export default WatchPage;
