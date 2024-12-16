import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import './home.css';

// Typewriting Effect
const TypewriterEffect = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index += 1;
      if (index === text.length) clearInterval(interval);
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

const HomePage = () => {
  // Floating animation for the logo
  const logoAnimation = useSpring({
    from: { transform: 'translateY(0)' },
    to: { transform: 'translateY(-15px)' },
    config: { tension: 150, friction: 14 },
    loop: { reverse: true }, // The logo will float up and down
  });

  return (
    <div className="homepage">
      {/* Logo Section */}
      <animated.div style={logoAnimation} className="logo-container">
        <img src="/LOGO.png" alt="App Logo" className="app-logo" />
      </animated.div>

      {/* Introduction Section */}
      <div className="intro-section">
        <h1>
          <TypewriterEffect text="Welcome to MovieVerse" />
        </h1>
        <p>
          <TypewriterEffect 
            text="Explore a world of cinematic experiences, discover trending movies, and find your next binge-worthy series. Dive into stories that captivate, entertain, and inspire." 
            speed={50}
          />
        </p>
      </div>

      {/* CTA Button */}
      <animated.div>
        <button className="cta-button">
          Start Exploring
        </button>
      </animated.div>

      {/* Credits Section */}
      <div className="credits-section">
        <p>
          Made with ❤️ by <span>Mohamed Nezhari</span>, <span>Adil Bouhoum</span>,{' '}
          <span>Ilias Ait Berhil</span>, and <span>Achraf Abourazik</span>.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
