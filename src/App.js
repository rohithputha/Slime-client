import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Login from './login';
import Signup from './Signup';
import { Routes, Route, Navigate,useNavigate  } from 'react-router-dom';
import Home from './Home';
import NotionAuth from './NotionAuth';
import NotionPageSelector from './NotionPageSelector';
import config from './config';

async function checkCookie(){
  try{
    const response= await fetch(config.baseUrl+'/api/user/in', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.ok || response.status !== 401 ? true : false;
  }
  catch(e){
    console.error(e)
    return false
  }
  
}

function App() {
  
  const [userSession, setUserSession] = useState(checkCookie());
  const navigate = useNavigate();
  const appStyle = {
    width: `300px`, // Set width
    height: `400px`, // Set height
    overflow: 'auto', // Optional: Add overflow auto to handle content that might exceed the viewport
  };

  useEffect(async () => {
    const verifySession = async () => {
      const isValidSession = await checkCookie();
      if (isValidSession) {
        navigate('/');
      }else{
        navigate('/login');
      }
      setUserSession(isValidSession);
    };
    verifySession();
    
  }, []);

  const updateUserSession = () => {
    setUserSession(true);
    navigate('/');
  }

  // if (userSession) {
  //   console.log("usersession is true")
  //   return (
  //     <div className="App" style={appStyle}>
  //       <h1>Welcome back!</h1>
  //       <Routes>
  //         <Route path="*" element={<Home />} />
  //       </Routes>
  //     </div>
  //   )
  // }
  return (
    <div style={appStyle}>
      <Routes>
        <Route path="/signup" element={
          <div><Signup updateUserSession={updateUserSession}/></div>
          } />
        <Route path="/login" element={<Login updateUserSession={updateUserSession} />} />
        <Route path="/" element={<div><Home /></div>} />
        <Route path="/auth/notion" element={<NotionAuth></NotionAuth>} />
        <Route path="/notion" element={<NotionPageSelector></NotionPageSelector>} />
      </Routes>
    </div>
  );
}

export default App;
