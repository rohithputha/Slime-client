import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import config from './config';


function Login ({updateUserSession, ...props}) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleLogin = async () => {
    console.log('Logging in with:', username )
    const url = config.baseUrl+'/api/user/login';
    const passwordhash = password 
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, passwordhash })
    };

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        if (data.error) {
            setLoginError(true);
            return
        }
        console.log('Login successful:', data);
        updateUserSession();

        // Handle success, e.g., storing auth tokens, redirecting, etc.
        
    } catch (error) {
        // Handle errors, e.g., showing an error message to the user
        console.error('Login failed:', error);
    }
        
  };

  const loginStyle = {
    width: `300px`, 
    height: `100%`, 
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  };

  const contentStyle = {
    margin: '10px',
    border: 'none'
  }

  return (
    <div className="App" style={loginStyle}>
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
          }} />
        <Button onClick={handleLogin} style={contentStyle} >Login</Button>
        {loginError && <Typography label="Error" color="error" value={"There was an error logging you in!"} style={contentStyle} >There was an error logging you in!</Typography>}
        <Link to="/signup">Don't have your account with us? Sign up here!</Link>
    </div>
  );
}

export default Login;