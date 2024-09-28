import { Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import config from "./config";
/* global chrome */

function NotionAuth() {
    const location = useLocation();
    const { progress } = location.state || {};
    const [authProgress, setAuthProgress] = useState(progress);
    const [startPolling, setStartPolling] = useState(false);
    console.log("Auth progress: ", location.state)

    const authTabCloseListener = (message, sender, sendResponse) => {
        if (message.action === "auth_tab_closed") {
            setAuthProgress(401);
            setStartPolling(false);
        }
    }

    const handleClick = async ()=>{

        const notionGetAuthState = async () => {
            const response = await fetch(config.baseUrl+'/api/notion/auth/state');
            console.log(response)
            const data = await response.json(); 
            return data["notion-auth-state-set"];
        }


        const authStateSet = await notionGetAuthState();
        console.log(authStateSet)
        if (authStateSet !== undefined && authStateSet !== null) {
            console.log("Auth state is set")
            setAuthProgress(201);
            setStartPolling(true);
            chrome.storage.local.set({'auth_tab_closed':false})
            chrome.runtime.onMessage.addListener(authTabCloseListener);
            chrome.runtime.sendMessage({ action: "open_new_tab", url: config.notionRedirectUri+ authStateSet});
            
        }
        else {
            console.log("Auth state is not set")
        }

    }

    useEffect(() => {
            const intervalId = setInterval(async () => {
                const response = await fetch(config.baseUrl+'/api/notion/auth/in');
                if (response.status === 200 || response.status === 401) {
                    clearInterval(intervalId);
                    setAuthProgress(response.status);
                    setStartPolling(false);
                }else {
                    chrome.storage.local.get('auth_tab_closed', function(result) {
                        if (result.auth_tab_closed) {
                            clearInterval(intervalId);
                            setAuthProgress(401);
                            setStartPolling(false);
                        }
                    });
                }
            }, 2000);
            return () => clearInterval(intervalId); 
    }, [startPolling])

    const buttonStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        backgroundColor: '#1E90FF', // Primary Color for background
        color: 'black',
        border: '1px solid #D3D3D3', // Neutral Color for border
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    }
    const containerStyle = {
        height: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    };
    const textStyle = {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        color: 'black',
        margin: '10px'
    }

    

    return (
        <div style = {containerStyle}>
            {authProgress!==201 && <Typography style = {textStyle}>Authenticate with:</Typography>} 
            {authProgress!==201 && <Button variant="contained" style = {buttonStyle} onClick={handleClick} >Notion</Button>}
            {authProgress===201 && <CircularProgress />}
        </div>
    )
}

export default NotionAuth;