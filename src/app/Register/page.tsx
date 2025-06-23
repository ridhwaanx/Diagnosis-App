'use client';

// Import necessary MUI components and icons
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

// Styled components for layout
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

 // Container styling
const SignUpContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');

  // Validate form inputs
  const validateInputs = () => {

    const password = document.getElementById('password') as HTMLInputElement;
    const passwordValue = password.value;

    if (passwordValue.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 8 characters long');
      return false;
    }

    if (/\s/.test(passwordValue)) {
      setPasswordError(true);
      setPasswordErrorMessage('Password cannot contain whitespace');
      return false;
    }

    if (!/[A-Z]/.test(passwordValue)) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must contain at least one uppercase letter');
      return false;
    }

    if (!/[a-z]/.test(passwordValue)) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must contain at least one lowercase letter');
      return false;
    }

    if (/[^A-Za-z0-9]/.test(passwordValue)) {
      setPasswordError(true);
      setPasswordErrorMessage('Password cannot contain special characters');
      return false;
    }

    setPasswordError(false);
    setPasswordErrorMessage('');
    return true;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateInputs()) {
      return;
    }
    
    const data = new FormData(event.currentTarget);
    const userData = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
    };
    
    // Send signup data to API
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      
      // Handle response
      if (response.ok) {
        // Redirect to login or dashboard on successful signup
        window.location.href = '/Login';
        console.log(data)
      } else {
        // Handle errors
        if (response.status === 409) {
          setEmailError(true);
          setEmailErrorMessage('Email already in use');
        } else {
          alert(result.message || 'Signup failed');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during signup');
    }
  };

  return (
    <Box sx={{ 
      height: '92vh',
      width: '100%',
      backgroundColor: 'transparent'}}
    >
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={
                  passwordError ? 
                  passwordErrorMessage : 
                  'Password must be 8+ characters with uppercase, lowercase, no spaces or special characters'
                }
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive updates via email."
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign up with Facebook
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link
                href="/Login"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </Box>
  );
}
