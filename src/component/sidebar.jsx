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
} from '@mui/material';
import {
  FaDashcube,
  FaUserTie,
  FaBalanceScaleRight,
} from 'react-icons/fa';
import { BsFillClipboard2DataFill } from 'react-icons/bs';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { CgReadme } from 'react-icons/cg';
import Logout from '../pages/Logout';
import logo_b from '../Logo_black.png';
import { IoIosPeople } from 'react-icons/io';

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileDrawer = () => setIsMobileOpen((prev) => !prev);

  const menuItems = [
    { text: 'Dashboard', icon: <FaDashcube />, path: '/dashboard' },
    { text: 'Employee', icon: <FaUserTie />, path: '/employee' },
    { text: 'Company', icon: <IoIosPeople />, path: '/company' },
    { text: 'Orders', icon: <FaUserTie />, path: '/orders' },
    { text: 'IWO', icon: <CgReadme />, path: '/iwo' },
    { text: 'Calculator', icon: <FaBalanceScaleRight />, path: '/garnishment' },
    { text: 'Results', icon: <BsFillClipboard2DataFill />, path: '/results' },
    { text: 'Batch Processor', icon: <FaBalanceScaleRight />, path: '/batchcalculation' },
    { text: 'Help!', icon: <HiChatBubbleLeftRight />, path: '/help' },
  ];

  const renderMenuItems = menuItems.map(({ text, icon, path }) => (
    <ListItem  button key={text}>
      <NavLink
        to={path}
        style={({ isActive }) => ({
          textDecoration: 'none',
          textTransform: 'uppercase',
          fontStyle:'italic',
          fontSize: '12px',
          color: 'inherit',
          backgroundColor: isActive ? '#3f51b5' : 'inherit', // Active background color
          fontWeight: isActive ? '600' : '200', // Bold font for active
          padding: '10px 20px', // Padding for better button-like appearance
          borderRadius: '5px', // Rounded corners
          display: 'flex', // Flex display for horizontal alignment
          alignItems: 'center', // Align items vertically centered
        })}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            {icon}
          </ListItemIcon>
          <ListItemText className="MenuSpacial" primary={text} sx={{ color: 'inherit',fontSize: '12px !important', }} />
        </Box>
      </NavLink>
    </ListItem>
  ));

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <img src={logo_b} alt="Logo" style={{ width: '100%' }} />
      </Box>
      <Divider />
      <List>{renderMenuItems}</List>
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
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: 260, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer */}
      <IconButton
        sx={{ display: { xs: 'block', md: 'none' }, p: 2 }}
        onClick={toggleMobileDrawer}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </IconButton>
      <Drawer
        variant="temporary"
        open={isMobileOpen}
        onClose={toggleMobileDrawer}
        sx={{
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;