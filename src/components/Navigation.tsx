"use client"

import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar } from '@mui/material';
import { Logout } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/navigation';

const Navigation: React.FC = () => {
  const router = useRouter();
  // Get user data from localStorage
  const [userName, setUserName] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // Check if we're on client side before accessing localStorage
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserName(parsedUser.name || '');
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    // Redirect to login page
    router.push('/');
    router.refresh();
  };

  const handleSignIn = () => {
    router.push('/Login');
  };

  // Get first letter of the name, or default to '' if no name
  const avatarLetter = userName ? userName.charAt(0).toUpperCase() : '';

  return (
    <AppBar position="static" sx={{ color: 'black', boxShadow: 'none', backgroundColor: 'transparent'}}>
      <Toolbar sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
        <IconButton
          aria-label="Home"
          onClick={() => {
            if (typeof window !== 'undefined') {
              const user = localStorage.getItem('user');
              router.push(user ? '/Home' : '/');
              
            }
          }}
        >
          <HomeIcon sx={{ color: "white", scale: 1.4 }} />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ color: "white", flexGrow: 1, marginLeft: 2 }}>
          HealthMate
        </Typography>
        <Box sx={{ display: "flex", gap: '20px', alignItems: 'center'}}>
          {isLoggedIn && (
            
            <IconButton aria-label="Profile" href="Home/Profile">
              <Avatar sx={{ bgcolor: 'transparent', border: '2px solid white' }}>{avatarLetter}</Avatar>
            </IconButton>
          
          )}
          {isLoggedIn ? (
            <Button
              variant="contained"
              startIcon={<Logout />}
              sx={{ backgroundColor: 'primary.main', height: '37px' }}
              onClick={handleLogout}
            >
              LOG OUT
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ backgroundColor: 'primary.main' }}
              onClick={handleSignIn}
            >
              SIGN IN
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;