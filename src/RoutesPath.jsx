/* eslint-disable react/jsx-no-undef */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicRoute from './component/PublicRoute';
import PrivateRoute from './component/PrivateRoute';
import Notfound from './pages/Notfound';
import Sidebar from './component/sidebar';
import Headertop from './component/Headertop';

// Pages
import Form from './component/form';
import Signup from './pages/signup';
import Forgot from './pages/forgot';
import PasswordResetConfirm from './pages/PasswordResetConfirm';
import Dashboard from './pages/dashboard';
import Logout from './pages/Logout';
import Profile from './pages/profile';
// import Setting from './pages/setting';
import Help from './pages/Help';
import Tax from './pages/Tax';
import Garnishment from './pages/Garnishment';
import Garnishment2 from './pages/Garnishment2';
import Employee from './pages/employee';
import EmployeeEditForm from './pages/EmployeeEditForm';
import EmployeeProfile from './pages/EmployeeProfile';
import CaseRegister from './pages/CaseRegister';
import Department from './pages/department';
import Location from './pages/location';
import Iwo from './pages/iwo';
import Results from './pages/results';
import GarnishFee from './pages/GarnishFee';
import Orders from './pages/Orders';
import EmpImport from './pages/EmpImport';
import ComImport from './pages/ComImport';
import OrdImport from './pages/OrdImport';
import Rules from './pages/Rules';

// Components
import AddEmployee from './component/AddEmployee';
import AddDepartment from './component/AddDepartment';
import AddTax from './component/AddTax';
import AddLocation from './component/AddLocation';

// Documents
import Siganture from './document/Siganture';
import BatchCalculation from './document/BatchCalculation';
import XmlProcessor from './document/xmlProcessor';


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