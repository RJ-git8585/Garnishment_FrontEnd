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
  const [open, setOpen] = useState(false); // State to control mobile drawer

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* Main Drawer for Desktop */}
      <Drawer
        sx={{
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ p: 2 }}>
          <img
            className="h-6 logo-inner mb-6 ml-2 w-auto custom_logo_side"
            src={logo_b}
            alt="Logo"
            style={{ width: '100%' }}
          />
        </Box>
        <Divider />
        <List sx={{ flexGrow: 1 }}>
  <ListItem 
    button 
    component={Link} 
    to="/dashboard" 
    sx={{ 
      mb: 2, 
      '& .MuiListItemIcon-root': { 
        minWidth: '40px', 
      }, 
      '& .MuiListItemText-root': { 
        maxWidth: '150px', 
        fontSize: '0.8rem', 
      } 
    }}
  >
    <ListItemIcon>
      <FaDashcube />
    </ListItemIcon>
    <ListItemText primary="Dashboard" />
  </ListItem>
  <ListItem 
    button 
    component={Link} 
    to="/employee" 
    sx={{ 
      mb: 2, 
      '& .MuiListItemIcon-root': { 
        minWidth: '40px', 
      }, 
      '& .MuiListItemText-root': { 
        maxWidth: '150px', 
        fontSize: '0.8rem', 
      } 
    }}
  >
    <ListItemIcon>
      <FaUserTie />
    </ListItemIcon>
    <ListItemText primary="Employee" />
  </ListItem>
  <ListItem 
    button 
    component={Link} 
    to="/iwo" 
    sx={{ 
      mb: 2, 
      '& .MuiListItemIcon-root': { 
        minWidth: '40px', 
      }, 
      '& .MuiListItemText-root': { 
        maxWidth: '150px', 
        fontSize: '0.8rem', 
      } 
    }}
  >
    <ListItemIcon>
      <CgReadme />
    </ListItemIcon>
    <ListItemText primary="IWO" />
  </ListItem>
  <ListItem 
    button 
    component={Link} 
    to="/garnishment" 
    sx={{ 
      mb: 2, 
      '& .MuiListItemIcon-root': { 
        minWidth: '40px', 
      }, 
      '& .MuiListItemText-root': { 
        maxWidth: '150px', 
        fontSize: '0.8rem', 
      } 
    }}
  >
    <ListItemIcon>
      <FaBalanceScaleRight />
    </ListItemIcon>
    <ListItemText primary="Garnishment Calculator" />
  </ListItem>
  <ListItem 
    button 
    component={Link} 
    to="/results" 
    sx={{ 
      mb: 2, 
      '& .MuiListItemIcon-root': { 
        minWidth: '40px', 
      }, 
      '& .MuiListItemText-root': { 
        maxWidth: '150px', 
        fontSize: '0.8rem', 
      } 
    }}
  >
    <ListItemIcon>
      <BsFillClipboard2DataFill />
    </ListItemIcon>
    <ListItemText primary="Results" />
  </ListItem>
  <ListItem 
    button 
    component={Link} 
    to="/setting" 
    sx={{ 
      mb: 2, 
      '& .MuiListItemIcon-root': { 
        minWidth: '40px', 
      }, 
      '& .MuiListItemText-root': { 
        maxWidth: '150px', 
        fontSize: '0.8rem', 
      } 
    }}
  >
    <ListItemIcon>
      <FaTools />
    </ListItemIcon>
    <ListItemText primary="Settings" />
  </ListItem>
  <ListItem 
    button 
    component={Link} 
    to="/help" 
    sx={{ 
      mb: 2, 
      '& .MuiListItemIcon-root': { 
        minWidth: '40px', 
      }, 
      '& .MuiListItemText-root': { 
        maxWidth: '150px', 
        fontSize: '0.8rem', 
      } 
    }}
  >
    <ListItemIcon>
      <HiChatBubbleLeftRight />
    </ListItemIcon>
    <ListItemText primary="Help!" />
  </ListItem>
</List>

        <Divider />
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <ListItem>
            <Logout />
          </ListItem>
        </Box>
      </Drawer>

      {/* Mobile Drawer */}
      <IconButton sx={{ display: { xs: 'block', md: 'none' } }} onClick={toggleDrawer}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className="h-6 w-6">
          <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
        </svg>
      </IconButton>

      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        variant="temporary"
        anchor="left"
        open={open}
        onClose={toggleDrawer}
      >
        <Box sx={{ p: 2 }}>
          <img
            className="h-6 logo-inner mb-6 ml-2 w-auto custom_logo_side"
            src={logo_b}
            alt="Logo"
            style={{ width: '100%' }}
          />
        </Box>
        <Divider />
        <List sx={{ flexGrow: 1 }}>
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
              <FaDashcube />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/employee">
            <ListItemIcon>
              <FaUserTie />
            </ListItemIcon>
            <ListItemText primary="Employee" />
          </ListItem>
          <ListItem button component={Link} to="/iwo">
            <ListItemIcon>
              <CgReadme />
            </ListItemIcon>
            <ListItemText primary="IWO" />
          </ListItem>
          <ListItem button component={Link} to="/garnishment">
            <ListItemIcon>
              <FaBalanceScaleRight />
            </ListItemIcon>
            <ListItemText primary="Garnishment Calculator" />
          </ListItem>
          <ListItem button component={Link} to="/results">
            <ListItemIcon>
              <BsFillClipboard2DataFill />
            </ListItemIcon>
            <ListItemText primary="Results" />
          </ListItem>
          <ListItem button component={Link} to="/setting">
            <ListItemIcon>
              <FaTools />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button component={Link} to="/help">
            <ListItemIcon>
              <HiChatBubbleLeftRight />
            </ListItemIcon>
            <ListItemText primary="Help!" />
          </ListItem>
        </List>
        <Divider />
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <ListItem>
            <Logout />
          </ListItem>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
