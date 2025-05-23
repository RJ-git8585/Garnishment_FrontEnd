
/**
 * Entry point of the React application.
 * 
 * This file is responsible for rendering the root React component (`App`) 
 * into the DOM element with the ID `root`. It uses React's StrictMode 
 * to highlight potential problems in the application during development.
 * 
 * Imports:
 * - React: The core library for building user interfaces.
 * - ReactDOM: Provides methods for rendering React components to the DOM.
 * - App: The main application component.
 * - index.css: Global CSS styles for the application.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './utils/main-css/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>,
  
)
