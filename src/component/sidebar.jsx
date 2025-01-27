import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Box,
  Collapse,
} from '@mui/material';
import {
  FaDashcube,
  FaUserTie,
  FaBalanceScaleRight,
} from 'react-icons/fa';
// import { BsFillClipboard2DataFill } from 'react-icons/bs';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { CgReadme } from 'react-icons/cg';
import Logout from '../pages/Logout';
import { IoIosPeople } from 'react-icons/io';

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);
  const [openEmployee, setOpenEmployee] = useState(false);

  const toggleMobileDrawer = () => setIsMobileOpen((prev) => !prev);
  const toggleCompanyMenu = () => setOpenCompany((prev) => !prev);
  const toggleEmployeeMenu = () => setOpenEmployee((prev) => !prev);

  const menuItems = [
    { text: 'Dashboard', icon: <FaDashcube />, path: '/dashboard' },
    {
      text: 'Company',
      icon: <IoIosPeople />,
      isExpandable: true,
      isOpen: openCompany,
      path: '/company',
      onClick: toggleCompanyMenu,
      submenu: [
        {
          text: 'Employee',
          icon: <FaUserTie />,
          isExpandable: true,
          isOpen: openEmployee,
          path: '/employee',
          onClick: toggleEmployeeMenu,
          
        },
        { text: 'Orders', icon: <FaUserTie />, path: '/orders' },
      ],
    },
    { text: 'IWO', icon: <CgReadme />, path: '/iwo' },
    { text: 'Calculator', icon: <FaBalanceScaleRight />, path: '/garnishment' },
    // { text: 'Results', icon: <BsFillClipboard2DataFill />, path: '/results' },
    { text: 'Garnihment Processor', icon: <FaBalanceScaleRight />, path: '/batchcalculation' },
    { text: 'Help!', icon: <HiChatBubbleLeftRight />, path: '/help' },
  ];

  const renderSubMenu = (submenu) => (
    <List component="div" disablePadding>
      {submenu.map(({ text, icon, path, isExpandable, isOpen, onClick, submenu: nestedSubmenu }) => (
        <div key={text}>
          <ListItem button onClick={onClick || (() => {})} sx={{ pl: 4 }}>
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
                <ListItemText primary={text} sx={{ color: 'inherit', fontSize: '12px !important' }} />
              </Box>
            </NavLink>
          </ListItem>

          {isExpandable && nestedSubmenu && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              {renderSubMenu(nestedSubmenu)}
            </Collapse>
          )}
        </div>
      ))}
    </List>
  );

  const renderMenuItems = menuItems.map(({ text, icon, path, isExpandable, isOpen, onClick, submenu }) => (
    <div key={text}>
      <ListItem button onClick={onClick || (() => {})}>
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
            <ListItemText primary={text} sx={{ color: 'inherit', fontSize: '12px !important' }} />
          </Box>
        </NavLink>
      </ListItem>

      {isExpandable && submenu && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          {renderSubMenu(submenu)}
        </Collapse>
      )}
    </div>
  ));

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <h2 className="Logo">GarnishEdge</h2>
      </Box>
      <Divider />
      <List className='menu_cls'>{renderMenuItems}</List>
      <Divider />
      <Box sx={{ mt: 'auto' }}>
        <ListItem>
          <Logout />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>

      <IconButton sx={{ display: { xs: 'block', md: 'none' }, p: 2 }} onClick={toggleMobileDrawer}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </IconButton>
      <Drawer
        variant="temporary"
        open={isMobileOpen}
        onClose={toggleMobileDrawer}
        sx={{ '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' } }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
