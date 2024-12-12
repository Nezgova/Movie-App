// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client' in React 18+
import App from './App';
import './index.css';  // Optional CSS file

const root = ReactDOM.createRoot(document.getElementById('root'));  // Create root
root.render(<App />);  // Render the App component
