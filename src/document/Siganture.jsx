import './doc.css'
import React from 'react';
import  { useState } from 'react';
import { FaCode } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";



import Documentation from './Documentation';
import ApiRef from './apiRef';
const Signature = () => {
  // Move scripts to public/index.html or use proper React imports
  React.useEffect(() => {
    if (window.location.pathname === '/docs') {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white'; // Optional

      return () => {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
      };
    }
  }, []);

  const [activeMenu, setActiveMenu] = useState('documentation'); // Tracks which menu is active

  const renderMenu = () => {
    switch (activeMenu) {
      case 'documentation':
        return (
          <ul>
            <li><a href="#Authentication" className="">Authentication</a></li>
            <li><a href="#CompanyOnboarding" className="">Company Onboarding</a></li>
            <li><a href="#EmployeeOnboarding">Employee Onboarding</a></li>
            <li><a href="#EmployerPortal">Employer Portal</a></li>
            <li><a href="#Garnishment ">Payroll </a></li>
          </ul>
        );
      case 'api':
        return (
          <ul>
             <li> <a href="#createBusiness" className="">createBusiness <span className="post">Post</span> </a></li>
            <li><a href="#companyRegistration">companyRegistration <span className="post">Post</span>  </a></li>
            <li><a href="#Password Reset">userRegistration <span className="post">Post</span> </a></li>
            <li><a href="#Forget Password Confirm">initiatePayroll <span className="put">Put</span>  </a></li>
          </ul>
        );
      default:
        return (
          <ul>
             <li><a href="#Authentication" className="">Authentication</a></li>
          <li><a href="#CompanyOnboarding" className="">Company Onboarding</a></li>
            <li><a href="#EmployeeOnboarding">Employee Onboarding</a></li>
            <li><a href="#EmployerPortal">Employer Portal</a></li>
            <li><a href="#Garnishment ">Payroll </a></li>
          </ul>
        );
    }
  };

  // Content rendering based on activeMenu
  const renderContent = () => {
    switch (activeMenu) {
      case 'documentation':
        return (
          <div>
            <Documentation />
          </div>
        );
      case 'api':
        return (
          <div>
            <ApiRef/>
          </div>
        );
      default:
        return (
          <div>
            <Documentation />
          </div>
        );
    }
  };

  return (
    <>
    <body className="docs bg-black">    
    <div className="doc_sidebar">
    <h2><img src="https://garnishment-react-main.vercel.app/assets/Logo%20(1)-vJni-coq.png" width="250px"/></h2>
    <p className="text-center">Version: 1.0</p>
    <p className="text-center mb-10">Last Updated: 29th Dec, 2024</p>
    <hr></hr>
    <div className="mt-6">
    <li className={`mb-2 ${activeMenu === 'documentation' ? 'active_cls' : ''}`}> <a href="#Register-Employer" onClick={() => setActiveMenu('documentation')}><HiOutlineDocumentText /> Documentation</a>
    </li>
    <li className={`mb-2 ${activeMenu === 'api' ? 'active_cls' : ''}`}> <a href="#Login-Employer" onClick={() => setActiveMenu('api')}>  <FaCode /> API References</a>
   </li>
    </div>
    <hr></hr>
    <div className="mt-6">
    {renderMenu()}
</div>
</div>
<div className="doc_content">
      {renderContent()}
    </div>

    </body> 
    </>
  );
};


export default Signature;
