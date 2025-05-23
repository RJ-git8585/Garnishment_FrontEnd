
/**
 * Login component for handling user authentication.
 * 
 * This component checks if a token exists in the session storage.
 * If no token is found, it logs 'No' to the console.
 * It also logs the current token value (if any) to the console.
 * 
 * The component renders a `Form` component for user interaction.
 * 
 * @component
 * @returns {JSX.Element} The rendered Login component.
 */
import React, { useState, useEffect } from 'react';

import Form from '../component/form';

function Login() {

  if (sessionStorage.getItem("token") == null) {
    console.log('No')
  }
  console.log('tOkan', sessionStorage.getItem("token"))
  
  return (
  <Form/>
)
}

export default Login;
