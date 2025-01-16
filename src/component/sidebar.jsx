import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton, Divider, Box } from '@mui/material';
import { FaDashcube, FaUserTie, FaTools, FaBalanceScaleRight } from 'react-icons/fa';
import { BsFillClipboard2DataFill } from 'react-icons/bs';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { CgReadme } from 'react-icons/cg';
import Logout from '../pages/Logout';
import logo_b from '../Logo_black.png';

const Sidebar = () => {
  const [open, setOpen] = useState(false); // Mobile drawer state

  const toggleDrawer = () => setOpen(!open);

  const menuItems = [
    { text: 'Dashboard', icon: <FaDashcube />, path: '/dashboard' },
    { text: 'Employee', icon: <FaUserTie />, path: '/employee' },
    { text: 'Company', icon: <FaUserTie />, path: '/employee' },
    { text: 'IWO', icon: <CgReadme />, path: '/iwo' },
    { text: 'Garnishment Calculator', icon: <FaBalanceScaleRight />, path: '/garnishment' },
    { text: 'Results', icon: <BsFillClipboard2DataFill />, path: '/results' },
    { text: 'Settings', icon: <FaTools />, path: '/setting' },
    { text: 'BatchProccsor', icon: <FaBalanceScaleRight />, path: '/BatchCalculation' },
    { text: 'Help!', icon: <HiChatBubbleLeftRight />, path: '/help' },
  ];

  const renderMenuItems = () =>
    menuItems.map((item) => (
      <ListItem button component={Link} to={item.path} key={item.text}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItem>
    ));

  const drawerContent = (
    <Box>
      <Box sx={{ p: 2 }}>
        <img src={logo_b} alt="Logo" style={{ width: '100%' }} />
      </Box>
      <Divider />
      <List>{renderMenuItems()}</List>
      <Divider />
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
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
      <IconButton sx={{ display: { xs: 'block', md: 'none' }, p: 2 }} onClick={toggleDrawer}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </IconButton>
      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
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