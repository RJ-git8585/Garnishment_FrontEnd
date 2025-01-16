// eslint-disable-next-line no-unused-vars
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Dashboard from './pages/dashboard';
import Employee from './pages/employee';
import EmployeeProfile from './pages/EmployeeProfile';
import EmpImport from './pages/EmpImport';
import Forgot from './pages/forgot';
import Garnishment from './pages/Garnishment';
import Help from './pages/Help';
import Iwo from './pages/Iwo';
import Location from './pages/Location';
import Notfound from './pages/Notfound';
import Order from './pages/Order';
import PasswordResetConfirm from './pages/PasswordResetConfirm';
import Products from './pages/Tax';
import Profile from './pages/Profile';
import Results from './pages/Results';
import Setting from './pages/Setting';
import Signup from './pages/Signup';
import Tax from './pages/Tax';
import AddDepartment from './component/AddDepartment';
import AddEmployee from './component/AddEmployee';
import AddLocation from './component/AddLocation';
import AddTax from './component/AddTax';
import Department from './pages/department';
import Form from './component/form';
import Logout from './pages/Logout';


// Components
import PrivateRoute from './component/PrivateRoute';
import PublicRoute from './component/PublicRoute';
import Signature from './document/Siganture';

function App() {
  const publicRoutes = [
    { path: '/', element: <Form />, restricted: true },
    { path: '/signup', element: <Signup />, restricted: true },
    { path: '/forgot', element: <Forgot />, restricted: true },
    { path: '/reset-password/:token', element: <PasswordResetConfirm />, restricted: true },
  ];

  const privateRoutes = [
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/logout', element: <Logout /> },
    { path: '/products', element: <Products /> },
    { path: '/profile', element: <Profile /> },
    { path: '/setting', element: <Setting /> },
    { path: '/help', element: <Help /> },
    { path: '/tax', element: <Tax /> },
    { path: '/garnishment', element: <Garnishment /> },
    { path: '/employee', element: <Employee /> },
    { path: '/order', element: <Order /> },
    { path: '/addemployee', element: <AddEmployee /> },
    { path: '/adddepartment', element: <AddDepartment /> },
    { path: '/addlocation', element: <AddLocation /> },
    { path: '/department', element: <Department /> },
    { path: '/location', element: <Location /> },
    { path: '/iwo', element: <Iwo /> },
    { path: '/results', element: <Results /> },
    { path: '/addtax', element: <AddTax /> },
    { path: '/employee/:id/:employeeId', element: <EmployeeProfile /> },
    { path: '/EmpImport', element: <EmpImport /> },
  ];

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(({ path, element, restricted }) => (
          <Route
            key={path}
            path={path}
            element={<PublicRoute restricted={restricted}>{element}</PublicRoute>}
          />
        ))}

        {/* Private Routes */}
        {privateRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={<PrivateRoute>{element}</PrivateRoute>} />
        ))}

        {/* Other Routes */}
        <Route path="/docs" element={<Signature />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;