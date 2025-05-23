
/**
 * Signature Component
 * 
 * This component renders a documentation and API reference interface with a sidebar menu
 * and content area. It includes functionality for toggling between documentation and API
 * menus, expanding/collapsing submenus, and dynamically rendering content based on the
 * active menu.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered Signature component.
 * 
 * @example
 * <Signature />
 * 
 * @description
 * - The sidebar includes a logo, version information, and a menu for navigation.
 * - The menu supports nested submenus with toggle functionality.
 * - The content area dynamically renders components based on the selected menu.
 * - The background color and text color are adjusted when the pathname is `/docs`.
 * 
 * @state
 * - `activeMenu` (`string`): Tracks the currently active menu (e.g., "documentation" or "api").
 * - `submenuOpen` (`object`): Tracks the open/close state of submenus.
 * 
 * @dependencies
 * - React hooks: `useState`, `useEffect`
 * - Icons: `FaCode`, `HiOutlineDocumentText`, `IoIosArrowUp`, `IoIosArrowDown`
 * - Components: `Documentation`, `ApiRef`
 * - Assets: `Logo` (imported image)
 * 
 * @menuData
 * - `documentation`: Contains links and submenus for documentation topics.
 * - `api`: Contains links and submenus for API references with HTTP methods.
 * 
 * @functions
 * - `toggleSubmenu(menu: string): void`: Toggles the open/close state of a submenu.
 * - `renderMenu(): JSX.Element`: Renders the sidebar menu with nested submenus.
 * - `renderContent(): JSX.Element`: Renders the content area based on the active menu.
 */
import "../utils/css/doc.css";
import { useState, useEffect } from "react";
import { FaCode } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import Documentation from "./Documentation";
import ApiRef from "./ApiRef";
import Logo from '../utils/image/Logo_g.png';

const Footer = () => (
  <footer className="mt-10">
    Powered by <a href="https://orangedatatech.com"><b>OrangeDataTech</b></a>
  </footer>
);

const menuData = {
  documentation: [
    { title: "Introduction", link: "#Introduction" },
    { title: "Login", link: "#PEOLogin" },
    { title: "Company Registration", link: "#CompanyOnboarding" },
    { title: "Employee Registration", link: "#EmployeeOnboarding" },
    {
      title: "Garnishment",
      submenu: [
        { title: "Child Support", link: "#ChildSupport" },
        { title: "Federal", link: "#Federal" },
        { title: "Student Loan", link: "#StudentLoan" },
      ],
    },
  ],
  api: [
    { title: "PEO Login", link: "#PEOLogin" },
    { title: "Login", link: "#AuthLogin", method: "Post" },
    { title: "Register", link: "#AuthRegister", method: "Post" },
    {
      title: "Company Onboarding",
      submenu: [
        { title: "Company Registration", link: "#CreateStep1", method: "Post" },
        { title: "Company Details Update", link: "#CreateStep2", method: "Put" },
      ],
    },
    {
      title: "User Onboarding",
      submenu: [
        { title: "User Registration", link: "#UserRegistration", method: "Post" },
        { title: "User Details Update", link: "#UserDetailsUpdate", method: "Put" },
      ],
    },
    { title: "Garnishment Calculation", link: "#GarnishmentCalculation", method: "Post" },
  ],
};

const Signature = () => {
  const [activeMenu, setActiveMenu] = useState("documentation");
  const [submenuOpen, setSubmenuOpen] = useState({});

  useEffect(() => {
    if (window.location.pathname === "/docs") {
      document.body.style.backgroundColor = "black";
      document.body.style.color = "white";
      return () => {
        document.body.style.backgroundColor = "";
        document.body.style.color = "";
      };
    }
  }, []);

  const toggleSubmenu = (menu) => {
    setSubmenuOpen((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const renderMenu = () => {
    return (
      <ul>
        {menuData[activeMenu]?.map((item, index) => (
          <li key={index} className={item.submenu ? "sub" : ""}>
            <a href={item.link || "#"} onClick={item.submenu ? () => toggleSubmenu(item.title) : undefined}>
              <p>
                {item.title}
                {item.submenu && (
                  <>
                    {submenuOpen[item.title] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </>
                )}
              </p>
            </a>
            {item.submenu && submenuOpen[item.title] && (
              <ul className="submenu">
                {item.submenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <a href={subItem.link}>
                      {subItem.title}
                      {subItem.method && <span className={`badge ${subItem.method}`}>{subItem.method}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "documentation":
        return <Documentation />;
      case "api":
        return <ApiRef />;
      // case "Calculation":
      //   return <BatchCalculation />;
      default:
        return <Documentation />;
    }
  };
  

  return (
    <div className="docs bg-black">
      <div className="doc_sidebar">
       <img className="mx-auto h-10 w-auto" src={Logo} alt="Your Company" /> 
        <p className="text-center">Version: 1.0</p>
        <p className="text-center mb-10">Last Updated: 29th Dec, 2024</p>
        <hr />
        <div className="mt-6">
          {["documentation", "api"].map((menu) => (
            <li key={menu} className={`mb-2 ${activeMenu === menu ? "active_cls" : ""}`}>
              <a href="#" onClick={() => setActiveMenu(menu)}>
                {menu === "documentation" && <HiOutlineDocumentText />}
                {menu === "api" && <FaCode />}
                {/* {menu === "Calculation" && <CiCalculator1 />} */}
                {menu.charAt(0).toUpperCase() + menu.slice(1)}
              </a>
            </li>
          ))}
        </div>
        <hr />
        <div className="mt-6">{renderMenu()}</div>
      </div>
      <div className="doc_content">
        <div className="mb-20">{renderContent()}</div>
        <hr />
        <Footer />
      </div>
    </div>
  );
};

export default Signature;
