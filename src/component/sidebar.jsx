/**
 * Sidebar component that renders a navigation drawer with menu items and submenus.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered Sidebar component.
 * 
 * @description
 * This component uses Material-UI's Drawer and List components to create a sidebar
 * navigation menu. It includes expandable submenus and active state styling for navigation links.
 * 
 * @example
 * <Sidebar />
 * 
 * @dependencies
 * - React hooks: `useState`
 * - React Router: `NavLink`
 * - Material-UI components: `Drawer`, `List`, `ListItem`, `ListItemText`, `ListItemIcon`, `Divider`, `Box`, `Collapse`
 * - Icons: `react-icons` (e.g., `FaDashcube`, `FaUserTie`, etc.)
 * 
 * @state
 * - `openMenu` (object): Tracks the open/close state of expandable menu items.
 * 
 * @functions
 * - `handleMenuClick(menu: string): void`:
 *   Toggles the open/close state of a specific menu item.
 * 
 * - `renderSubMenu(submenu: Array<{ text: string, icon: JSX.Element, path: string }>): JSX.Element`:
 *   Renders a list of submenu items.
 * 
 * - `renderMenuItems`: Maps through the `menuItems` array to render the main menu items and their submenus.
 * 
 * @constants
 * - `menuItems` (array): Defines the structure of the menu, including text, icons, paths, and submenus.
 * - `drawerContent` (JSX.Element): The content of the sidebar drawer, including the logo, menu, and logout button.
 */
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../utils/image/Logo_g.png';
import '../utils/css/batch.css';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  Collapse,
} from '@mui/material';
import {
  FaDashcube,
  FaUserTie,
  FaBalanceScaleRight,
} from 'react-icons/fa';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { CgReadme } from 'react-icons/cg';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import Logout from '../pages/Logout';
import { LiaFirstOrderAlt } from "react-icons/lia";
import { FcProcess } from "react-icons/fc";
import { LuLoader } from "react-icons/lu";
import { CiCalculator2 } from "react-icons/ci";


const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState({});

  const handleMenuClick = (menu) => {
    setOpenMenu((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const menuItems = [
    { text: 'Dashboard', icon: <FaDashcube />, path: '/dashboard' },
    { text: 'Employees', icon: <FaUserTie />, path: '/employee' },
    { text: 'Garnishment Orders', icon: <LiaFirstOrderAlt />, path: '/orders' },
    // { text: 'Fees Rules', icon: <GiTakeMyMoney />, path: '/GarnishFee' },
    // { text: 'Rules List', icon: <GiTakeMyMoney />, path: '/ruleslist' },
    { text: 'IWO', icon: <CgReadme />, path: '/iwo' },
    { text: 'Employee Calculator', icon: <CiCalculator2 />, path: '/garnishment-pro' },
    {
      text: 'Garnishment Runs',
      class: 'newsubmenu', // Custom class for Processing menu
      icon: <FaBalanceScaleRight />,
      isExpandable: true,
      submenu: [
        { text: 'JSON Batch Run', icon: <FcProcess />, path: '/batchcalculation' },
        { text: 'Excel Batch Run', icon: <LuLoader />, path: '/xmlProcessor' },
      ],
    },
    {
      text: 'Rule Management',
      class: 'newsubmenu', // Custom class for Processing menu
      icon: <FaBalanceScaleRight />,
      isExpandable: true,
      submenu: [
        { text: 'Child Support Rules', icon: <FcProcess />, path: '/ruleslist' },
        { text: 'State Tax Levy Rules', icon: <LuLoader />, path: '/ruleslist' },
        { text: 'Creditor Debt Rules', icon: <FcProcess />, path: '/ruleslist' },
        { text: 'Fees Rules', icon: <LuLoader />, path: '/GarnishFee' },
      ],
    },
    { text: 'Help!', icon: <HiChatBubbleLeftRight />, path: '/help' },
  ];

  const renderSubMenu = (submenu) => (
    <List component="div" disablePadding>
      {submenu.map(({ text, icon, path }) => (
        <ListItem button key={text} sx={{ pl: 4 }}>
          <NavLink
            to={path || '#'}
            style={({ isActive }) => ({
              textDecoration: 'none',
              textTransform: 'uppercase',
              fontSize: '12px',
              color: 'inherit',
              backgroundColor: isActive ? '#3f51b5' : 'inherit',
              fontWeight: isActive ? '600' : '200',
              padding: '10px 20px',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
            })}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
              <ListItemText
                primary={text}
                sx={{
                  color: 'inherit',
                  fontSize: '12px !important',
                  fontFamily: 'Poppins, sans-serif',
                }}
              />
            </Box>
          </NavLink>
        </ListItem>
      ))}
    </List>
  );

  const renderMenuItems = menuItems.map(({ text, icon, path, isExpandable, submenu, class: customClass }) => (
    <div key={text} className={customClass || ''}>
      {isExpandable ? (
        <ListItem button onClick={() => handleMenuClick(text)}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
            <ListItemText
              primary={text}
              sx={{
                color: 'inherit',
                fontSize: '12px !important',
                fontFamily: 'Poppins, sans-serif',
              }}
            />
            <Box sx={{ marginLeft: 'auto' }}>
              {openMenu[text] ? <ArrowDropUp /> : <ArrowDropDown />}
            </Box>
          </Box>
        </ListItem>
      ) : (
        <ListItem button>
          <NavLink
            to={path}
            style={({ isActive }) => ({
              textDecoration: 'none',
              textTransform: 'uppercase',
              fontSize: '12px',
              color: 'inherit',
              backgroundColor: isActive ? '#3f51b5' : 'inherit',
              fontWeight: isActive ? '600' : '200',
              padding: '10px 20px',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            })}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
              <ListItemText
                primary={text}
                sx={{
                  color: 'inherit',
                  fontSize: '12px !important',
                  fontFamily: 'Poppins, sans-serif',
                }}
              />
            </Box>
          </NavLink>
        </ListItem>
      )}

      {isExpandable && submenu && (
        <Collapse in={openMenu[text]} timeout="auto" unmountOnExit>
          {renderSubMenu(submenu)}
        </Collapse>
      )}
    </div>
  ));

  
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <img className="mx-auto h-10 w-auto logo-cls" src={logo} alt="Your Company" />
      </Box>
      <Divider />
      <List className="menu_cls">{renderMenuItems}</List>
      <Divider />
      <Box sx={{ mt: 'auto' }}>
        <ListItem>
          <Logout />
        </ListItem>
      </Box>
      
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box' },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
