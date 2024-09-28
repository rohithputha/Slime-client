import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NotionAuth from "./NotionAuth";
import config from "./config";

async function checkNotionSession(){
    const response = await fetch(config.baseUrl+'/api/notion/auth/in');
    return response.status
}

function Home() {
  const [notionSession, setNotionSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      const status = await checkNotionSession();
      console.log("Notion session status: ", status)
      if (status === 200) {
        navigate('/notion');
      }else{
        navigate('/auth/notion', { state: { progress: status } });
      }
      setNotionSession(status);
    };
    verifySession();
    
  }, [])
}

export default Home;