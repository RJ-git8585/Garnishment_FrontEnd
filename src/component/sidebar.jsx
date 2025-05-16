import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '/src/Logo_g.png';
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
import { GiTakeMyMoney } from "react-icons/gi";

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
    {
      text: 'Employee',
      icon: <FaUserTie />,
      path: '/employee',
    },
    {
      text: 'Orders',
      icon: <LiaFirstOrderAlt />,
      path: '/orders',  
      // isExpandable: true,
      // submenu: [
      //   { text: 'Orders', icon: <FcProcess />, path: '/orders' },
      //   { text: 'Case', icon: <LuLoader />, path: '/Case' },
      // ],
    },
    {
      text: 'Fees Rules',
      icon: <GiTakeMyMoney />,
      path: '/GarnishFee',
    },
    {
      text: 'Rules List',
      icon: <GiTakeMyMoney />,
      path: '/ruleslist',
    },
    { text: 'IWO', icon: <CgReadme />, path: '/iwo' },
    { text: 'Calculator', icon: <CiCalculator2 />, path: '/garnishment-pro' },
    {
      text: 'Processing',
      icon: <FaBalanceScaleRight />,
      isExpandable: true,
      submenu: [
        { text: 'Garnishment Processor', icon: <FcProcess />, path: '/batchcalculation' },
        { text: 'Batch Processor', icon: <LuLoader />, path: '/xmlProcessor' },
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
                  fontFamily: 'Poppins, sans-serif',  // Updated to Poppins font here
                }}
              />
            </Box>
          </NavLink>
        </ListItem>
      ))}
    </List>
  );

  const renderMenuItems = menuItems.map(({ text, icon, path, isExpandable, submenu }) => (
    <div key={text}>
      <ListItem button onClick={() => isExpandable && handleMenuClick(text)}>
        <NavLink
          to={path || '#'}
          style={({ isActive }) => {
            const activeStyle = {
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
            };

            // Check if the submenu is open to avoid active style when collapsed
            if (isExpandable && !openMenu[text]) {
              return {
                ...activeStyle,
                backgroundColor: 'inherit', // Remove background when collapsed
                fontWeight: '200', // Remove bold font weight when collapsed
              };
            }
            return activeStyle;
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
            <ListItemText
              primary={text}
              sx={{
                color: 'inherit',
                fontSize: '12px !important',
                fontFamily: 'Poppins, sans-serif',  // Apply Poppins font here
              }}
            />
            {isExpandable && (
              <Box sx={{ marginLeft: 'auto' }}>
                {openMenu[text] ? <ArrowDropUp /> : <ArrowDropDown />}
              </Box>
            )}
          </Box>
        </NavLink>
      </ListItem>

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
