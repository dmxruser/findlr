import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Import the image
import aklImage from './ALK.jpg';

// Apply the background image to the body
document.body.style.backgroundImage = `url(${aklImage})`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);