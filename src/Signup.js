import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import config from './config';

function Signup(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [signupError, setSignupError] = useState(false);

  const handleSignup = async () => {
    console.log('Signing up with:', username);
    const url = config.baseUrl+'/api/user/signup';
    const passwordhash = password;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, passwordhash, name })
    };
    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.error) {
        setSignupError(true);
        return;
      }
      console.log('Signup successful:', data);
      props.updateUserSession();
    } catch (error) {
      // Handle errors, e.g., showing an error message to the user
      console.error('Signup failed:', error);
    }
  };

  const signupStyle = {
    width: '300px', // Keep the width as is
    minHeight: '100vh', // Use the entire viewport height
    flexDirection: 'column',
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    display: 'flex',
  };

  const contentStyle = {
    margin: '10px',
    border: 'none'
  };

  return (
    <div className="App" style={signupStyle}>
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={contentStyle} 
        sx={{
            '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: 'none', // Remove border for outlined variant
            },
            },
        }} />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={contentStyle} 
        sx={{
            '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: 'none', // Remove border for outlined variant
            },
            },
        }}/>
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} style={contentStyle} 
        sx={{
            '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: 'none', // Remove border for outlined variant
            },
            },
        }}/>
      <Button onClick={handleSignup} style={contentStyle}>Sign Up</Button>
      {signupError && <Typography color="error" style={contentStyle}>There was an error signing you up!</Typography>}
      <Link to="/login">Already have an account? Log in here!</Link>
    </div>
  );
}

export default Signup;
