/**
 * RoutesPath Component
 * 
 * This component defines the routing structure for the application using `react-router-dom`.
 * It separates public and private routes, applies appropriate route guards, and includes
 * layout components like `Sidebar` and `Headertop` for private routes.
 * 
 * Public routes are accessible without authentication, while private routes require authentication.
 * A `Notfound` component is rendered for undefined routes.
 * 
 * @component
 * @returns {JSX.Element} The routing structure of the application.
 * 
 * Public Routes:
 * - "/" (Form, restricted)
 * - "/signup" (Signup, restricted)
 * - "/forgot" (Forgot, restricted)
 * - "/reset-password/:token" (PasswordResetConfirm, restricted)
 * 
 * Private Routes:
 * - "/dashboard" (Dashboard)
 * - "/logout" (Logout)
 * - "/profile" (Profile)
 * - "/case" (CaseRegister)
 * - "/help" (Help)
 * - "/tax" (Tax)
 * - "/garnishment" (Garnishment)
 * - "/garnishment-pro" (Garnishment2)
 * - "/employee" (Employee)
 * - "/employee/edit/:case_id/:ee_id" (EmployeeEditForm)
 * - "/employee/:id/:employeeId" (EmployeeProfile)
 * - "/addemployee" (AddEmployee)
 * - "/adddepartment" (AddDepartment)
 * - "/addlocation" (AddLocation)
 * - "/department" (Department)
 * - "/location" (Location)
 * - "/iwo" (Iwo)
 * - "/results" (Results)
 * - "/addtax" (AddTax)
 * - "/GarnishFee" (GarnishFee)
 * - "/Orders" (Orders)
 * - "/EmpImport" (EmpImport)
 * - "/ComImport" (ComImport)
 * - "/OrdImport" (OrdImport)
 * - "/BatchCalculation" (BatchCalculation)
 * - "/xmlProcessor" (XmlProcessor)
 * - "/rules" (Rules)
 * - "/ruleslist" (Ruleslist)
 * 
 * Additional Routes:
 * - "*" (Notfound)
 * - "/docs" (Siganture)
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import Notfound from '../pages/Notfound';
import Sidebar from './Sidebar';
import Headertop from './Headertop';

// Pages
import Form from './fsorm';
import Signup from '../pages/Signup';
import Forgot from '../pages/Forgot';
import PasswordResetConfirm from '../pages/PasswordResetConfirm';
import Dashboard from '../pages/Dashboard';
import Logout from '../pages/Logout';
import Profile from '../pages/Profile';

// import Setting from './pages/setting';
import Help from '../pages/Help';
import Tax from '../pages/Tax';
import Garnishment from '../pages/Garnishment';
import Garnishment2 from '../pages/Garnishment2';
// import Employee from '../pages/employee';
import EmployeeEditForm from '../pages/EmployeeEditForm';
import EmployeeProfile from '../pages/EmployeeProfile';
import CaseRegister from '../pages/CaseRegister';
import Department from '../pages/Department';
import Location from '../pages/Location';
import Iwo from '../pages/Iwo';
import Results from '../pages/Results';
import GarnishFee from '../pages/GarnishFee';
import Orders from '../pages/Orders';
import EmpImport from '../pages/EmpImport';
import ComImport from '../pages/ComImport';
import OrdImport from '../pages/OrdImport';
import Rules from '../pages/Rules';
import Ruleslist from '../pages/Ruleslist';

// Components
import AddEmployee from './AddEmployee';
import AddDepartment from './AddDepartment';
import AddTax from './AddTax';
import AddLocation from './AddLocation';

// Documents
import Siganture from '../document/Siganture';
import BatchCalculation from '../document/BatchCalculation';
import XmlProcessor from '../document/XmlProcessor';
import Employee from '../pages/Employee';

const publicRoutes = [
  { path: "/", element: <Form />, restricted: true },
  { path: "/signup", element: <Signup />, restricted: true },
  { path: "/forgot", element: <Forgot />, restricted: true },
  { path: "/reset-password/:token", element: <PasswordResetConfirm />, restricted: true },
];

const privateRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/logout", element: <Logout /> },
  { path: "/profile", element: <Profile /> },
  { path: "/case", element: <CaseRegister /> },
  // { path: "/setting", element: <Setting /> },
  { path: "/help", element: <Help /> },
  { path: "/tax", element: <Tax /> },
  { path: "/garnishment", element: <Garnishment /> },
  { path: "/garnishment-pro", element: <Garnishment2 /> },
  { path: "/employee", element: <Employee /> },
  { path: "/employee/edit/:case_id/:ee_id", element: <EmployeeEditForm /> },
  { path: "/employee/:id/:employeeId", element: <EmployeeProfile /> },
  { path: "/addemployee", element: <AddEmployee /> },
  { path: "/adddepartment", element: <AddDepartment /> },
  { path: "/addlocation", element: <AddLocation /> },
  { path: "/department", element: <Department /> },
  { path: "/location", element: <Location /> },
  { path: "/iwo", element: <Iwo /> },
  { path: "/results", element: <Results /> },
  { path: "/addtax", element: <AddTax /> },
  { path: "/GarnishFee", element: <GarnishFee /> },
  { path: "/Orders", element: <Orders /> },
  { path: "/EmpImport", element: <EmpImport /> },
  { path: "/ComImport", element: <ComImport /> },
  { path: "/OrdImport", element: <OrdImport /> },
  { path: "/BatchCalculation", element: <BatchCalculation /> },
  { path: "/xmlProcessor", element: <XmlProcessor /> },
  { path: "/rules", element: <Rules /> },
  { path: "/ruleslist", element: <Ruleslist /> },
];


function RoutesPath() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {publicRoutes.map(({ path, element, restricted }) => (
            <Route
              key={path}
              path={path}
              element={<PublicRoute restricted={restricted}>{element}</PublicRoute>}
            />
          ))}
          {privateRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                <div className="min-h-full">
                  <div className="container main ml-auto">
                    <div className="sidebar hidden lg:block">
                      <Sidebar />
                    </div>
                    <div className="content ml-auto">
                      <Headertop />
                      <PrivateRoute>{element}</PrivateRoute>
                    </div>
                  </div>
                </div>
              }
            />
          ))}
          <Route path="*" element={<Notfound />} />
          <Route path="/docs" element={<Siganture />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default RoutesPath;