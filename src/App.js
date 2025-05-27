import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeWrapper from './pages/EmployeeWrapper';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/employee" element={<EmployeeWrapper />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* ...other routes */}
      </Routes>
    </Router>
  );
}

export default App;
