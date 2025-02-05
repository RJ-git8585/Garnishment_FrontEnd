// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './App.css'

import Products from './pages/Tax'
import Signup from './pages/signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Form from './component/form'  
import Dashboard from './pages/dashboard';
import Logout from './pages/Logout';
import Profile from './pages/profile';
import Forgot from './pages/forgot';
import Setting from './pages/setting';
import Help from './pages/Help';
import Tax from './pages/Tax';
import Garnishment from './pages/Garnishment';
import PrivateRoute from './component/PrivateRoute';
import Employee from './pages/employee';
import Notfound from './pages/Notfound';
import AddEmployee from './component/AddEmployee';
import AddDepartment from './component/AddDepartment';
import AddTax from './component/AddTax';
import AddLocation from './component/AddLocation';
import Department from './pages/department';
import Location from './pages/location';
import Iwo from './pages/iwo';
import PasswordResetConfirm from './pages/PasswordResetConfirm';
// import Order from './pages/Order';
import Results from './pages/results';
import PublicRoute from './component/PublicRoute';
import Siganture from './document/Siganture';
import EmployeeProfile from './pages/EmployeeProfile';
import EmpImport from './pages/EmpImport';
import GarnishFee from './pages/GarnishFee';
import BatchCalculation from './document/BatchCalculation';
import Orders from './pages/Orders';
import EmployeeEditForm from './pages/EmployeeEditForm';
import ComImport from './pages/ComImport';
import OrdImport from './pages/OrdImport';
import XmlProcessor from './document/xmlProcessor';

function App() {
  return (
    <>
    
      <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<PublicRoute restricted={true}><Form /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute restricted={true}><Signup /></PublicRoute>} />
        <Route path="/forgot" element={<PublicRoute restricted={true}><Forgot /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute restricted={true}><PasswordResetConfirm /></PublicRoute>} />
        {/* PRIVATE PAGE */}
        <Route path="/employee/edit/:cid/:ee_id" element={<EmployeeEditForm />} /> {/* New route for editing */}
        <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/setting" element={<PrivateRoute><Setting /></PrivateRoute>} />
        <Route path="/help" element={<PrivateRoute><Help /></PrivateRoute>} />
        <Route path="/tax" element={<PrivateRoute><Tax /></PrivateRoute>} />
        <Route path="/garnishment" element={<PrivateRoute><Garnishment /></PrivateRoute>} />
        {/* <Route path="/privacy" element={<Privacy />} /> */}
        <Route path="/employee" element={<PrivateRoute><Employee /></PrivateRoute>} />
        {/* <Route path="/order" element={<PrivateRoute><Order /></PrivateRoute>} /> */}
        <Route path="/addemployee" element={<PrivateRoute><AddEmployee /></PrivateRoute>} />
        <Route path="/adddepartment" element={<PrivateRoute><AddDepartment /></PrivateRoute>} />
        <Route path="/addlocation" element={<PrivateRoute><AddLocation /></PrivateRoute>} />
        <Route path="/department" element={<PrivateRoute><Department /></PrivateRoute>} />
        <Route path="/location" element={<PrivateRoute><Location /></PrivateRoute>} />
        <Route path="/iwo" element={<PrivateRoute><Iwo /></PrivateRoute>} />
        <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
        <Route path="/addtax" element={<PrivateRoute><AddTax /></PrivateRoute>} />
        <Route path="/employee/:id/:employeeId" element={<PrivateRoute><EmployeeProfile /></PrivateRoute>} />
        <Route path="/GarnishFee" element={<PrivateRoute><GarnishFee /></PrivateRoute>} />
        <Route path="*" element={<Notfound />} />
        <Route path="/docs" element={<Siganture />} />
        <Route path="/EmpImport" element={<PrivateRoute><EmpImport /></PrivateRoute> } />
        <Route path="/ComImport" element={<PrivateRoute><ComImport /></PrivateRoute> } />
        <Route path="/OrdImport" element={<PrivateRoute><OrdImport /></PrivateRoute> } />
        <Route path="/BatchCalculation" element={<PrivateRoute><BatchCalculation /></PrivateRoute> } />
        <Route path="/xmlProcessor" element={<PrivateRoute><XmlProcessor /></PrivateRoute>} />
        <Route path="/Orders" element={<PrivateRoute><Orders /></PrivateRoute> } />
      </Routes>
    </BrowserRouter>
       
    </>
  )
}

export default App
