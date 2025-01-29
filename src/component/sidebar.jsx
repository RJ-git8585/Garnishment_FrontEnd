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
      icon: <FaUserTie />,
      path: '/orders',
    },
    { text: 'IWO', icon: <CgReadme />, path: '/iwo' },
    { text: 'Calculator', icon: <FaBalanceScaleRight />, path: '/garnishment' },
    {
      text: 'Processing',
      icon: <FaBalanceScaleRight />,
      isExpandable: true,
      submenu: [
        { text: 'Garnishment Processor', icon: <FaBalanceScaleRight />, path: '/batchcalculation' },
        { text: 'Batch Processor', icon: <FaBalanceScaleRight />, path: '/xmlProcessor' },
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
                  fontFamily: 'Roboto, sans-serif',  // Apply Roboto font here
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
                fontFamily: 'Roboto, sans-serif',  // Apply Roboto font here
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
        <img className="mx-auto h-10 w-auto" src={logo} alt="Your Company" />
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
