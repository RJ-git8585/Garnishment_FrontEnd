
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
