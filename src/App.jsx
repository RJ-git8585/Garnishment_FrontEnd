
/**
 * The main App component serves as the root component of the application.
 * It imports and applies global styles and renders the `RoutesPath` component,
 * which is responsible for managing the application's routing.
 *
 * @component
 * @returns {JSX.Element} The rendered App component.
 */
import React, { useState, useEffect } from 'react';
import './utils/main-css/App.css'
import RoutesPath from './component/RoutesPath';


function App() {
  return (
    <>
   <RoutesPath />
    </>
  )
}

export default App
