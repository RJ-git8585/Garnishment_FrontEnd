import './doc.css';
import  { useState, useEffect } from 'react';
import { FaCode } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";


import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

import Documentation from './Documentation';
import ApiRef from './apiRef';

const Signature = () => {
  useEffect(() => {
    if (window.location.pathname === '/docs') {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white'; 

      return () => {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
      };
    }
  }, []);

  const [activeMenu, setActiveMenu] = useState('documentation'); // Tracks which menu is active
  const [submenuOpen, setSubmenuOpen] = useState({}); // Tracks submenu visibility

  // Toggle submenu visibility
  const toggleSubmenu = (menu) => {
    setSubmenuOpen((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const renderMenu = () => {
    switch (activeMenu) {
      case 'documentation':
        return (
          <ul>
            <li className="sub">
              <a href="#Authentication" onClick={() => toggleSubmenu('authentication')}>
                <p>Authentication {submenuOpen['authentication'] ? <IoIosArrowUp/> : <IoIosArrowDown/>}</p>
              </a>
              {submenuOpen['authentication'] && (
                <ul className="submenu">
                  <li><a href="#AuthLogin">Login</a></li>
                  <li><a href="#AuthRegister">Register</a></li>
                </ul>
              )}
            </li>
            <li className="sub">
              <a href="#CompanyOnboarding" onClick={() => toggleSubmenu('companyOnboarding')}>
              <p> Company Onboarding {submenuOpen['companyOnboarding'] ? <IoIosArrowUp/> : <IoIosArrowDown/>}</p>
              </a>
              {submenuOpen['companyOnboarding'] && (
                <ul className="submenu">
                  <li><a href="#OnboardStep1">Step 1</a></li>
                  <li><a href="#OnboardStep2">Step 2</a></li>
                </ul>
              )}
            </li>
            <li><a href="#EmployeeOnboarding">Employee Onboarding</a></li>
            <li><a href="#EmployerPortal">Employer Portal</a></li>
            <li><a href="#Garnishment">Garnishment</a></li>
          </ul>
        );
      case 'api':
        return (
          <ul>
            <li className="sub">
              <a href="#Authentication" onClick={() => toggleSubmenu('authentication')}>
                <p>Authentication {submenuOpen['authentication'] ? <IoIosArrowUp/> : <IoIosArrowDown/>}</p>
              </a>
              {submenuOpen['authentication'] && (
                <ul className="submenu">
                  <li><a href="#AuthLogin">Login<span className="post">Post</span></a></li>
                  <li><a href="#AuthRegister">Register<span className="post">Post</span></a></li>
                </ul>
              )}
            </li>
            <li className="sub">
              <a href="#createBusiness" onClick={() => toggleSubmenu('createBusiness')}>
                <p>Company Onboading    {submenuOpen['createBusiness'] ? <IoIosArrowUp/> : <IoIosArrowDown/>}</p>
              </a>
              {submenuOpen['createBusiness'] && (
                <ul className="submenu">
                  <li><a href="#CreateStep1">CompanyRegistertion<span className="post">Post</span></a></li>
                  <li><a href="#CreateStep2">CompanyDetailsUpdate<span className="put">Put</span></a></li>    
                </ul>
              )}
            </li>
            <li className="sub">
              <a href="#userRegistration" onClick={() => toggleSubmenu('userRegistration')}>
                <p>User Onboading    {submenuOpen['userRegistration'] ? <IoIosArrowUp/> : <IoIosArrowDown/>}</p>
              </a>
              {submenuOpen['userRegistration'] && (
                <ul className="submenu">
                  <li><a href="#CreateStep1">UserRegistertion<span className="post">Post</span></a></li>
                  <li><a href="#CreateStep2">UserDetailsUpdate<span className="put">Put</span></a></li>    
                </ul>
              )}
            </li>
            <li><a href="#GarnishmentCalculation">GarnishmentCalculation <span className="post">Post</span></a></li>
            <li><a href="#UserRemove">UserRemove <span className="delete">Delete</span></a></li>
            <li><a href="#CompanyRemove">CompanyRemove <span className="delete">Delete</span></a></li>
            {/* <li><a href="#initiateGarnishment">initiateGarnishment <span className="put">Put</span></a></li> */}
          </ul>
        );
      default:
        return (
          <ul>
            <li><a href="#Authentication">Authentication</a></li>
            <li><a href="#CompanyOnboarding">Company Onboarding</a></li>
            <li><a href="#EmployeeOnboarding">Employee Onboarding</a></li>
            <li><a href="#EmployerPortal">Employer Portal</a></li>
            <li><a href="#Garnishment">Garnishment</a></li>
          </ul>
        );
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'documentation':
        return (
          <div>
            <div className="mb-20">
              <Documentation />
            </div>
            <hr />
            <footer className='mt-10'>Powered by <a href="https://orangedatatech.com"><b>OrangeDataTech</b></a></footer>
          </div>
        );
      case 'api':
        return (
          <div>
            <div className="mb-20">
              <ApiRef />
            </div>
            <hr />
            <footer className='mt-10'>Powered by <a href="https://orangedatatech.com"><b>OrangeDataTech</b></a></footer>
          </div>
        );
      default:
        return (
          <div>
            <div className="mb-20">
              <Documentation />
            </div>
            <hr />
            <footer className='mt-10'>Powered by <a href="https://orangedatatech.com"><b>OrangeDataTech</b></a></footer>
          </div>
        );
    }
  };

  return (
    <>
      <body className="docs bg-black">
        <div className="doc_sidebar">
          <h2>
            <img src="https://garnishment-react-main.vercel.app/assets/Logo%20(1)-vJni-coq.png" width="250px" />
          </h2>
          <p className="text-center">Version: 1.0</p>
          <p className="text-center mb-10">Last Updated: 29th Dec, 2024</p>
          <hr />
          <div className="mt-6">
            <li className={`mb-2 ${activeMenu === 'documentation' ? 'active_cls' : ''}`}>
              <a href="#Register-Employer" onClick={() => setActiveMenu('documentation')}>
                <HiOutlineDocumentText /> Documentation
              </a>
            </li>
            <li className={`mb-2 ${activeMenu === 'api' ? 'active_cls' : ''}`}>
              <a href="#Login-Employer" onClick={() => setActiveMenu('api')}>
                <FaCode /> API References
              </a>
            </li>
          </div>
          <hr />
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
