import { FormControl, RadioGroup, FormControlLabel, Radio} from "@mui/material";
import { useEffect, useState } from "react";
import config from "./config";
/* global chrome */

function NotionPageSelector() {

   
    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState('');

    const FetchPages = async () => {
        const response = await fetch(config.baseUrl+'/api/notion/public/pages');
        const data = await response.json();
        console.log(data)
        setPages(data);
        
        chrome.storage.local.get('selectedPageId', function(result) {
            if (result.selectedPageId) {
                setSelectedPage(result.selectedPageId);
            }
        });
        
        return data;
    }
    const handleSelect = (event) => {
        setSelectedPage(event.target.value);
    }


    useEffect(FetchPages, [])
    useEffect(() => {
        if(selectedPage === '') return;
        console.log("sending selected page: ", selectedPage)
        chrome.runtime.sendMessage({ action: "page_selected", page: selectedPage});
    }  , [selectedPage])

    const formStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        backgroundColor: '#D3D3D3', // Neutral Color for background
        color: '#1E90FF', // Primary Color for text
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        margin: '10px',
    }

    return (
        <div>
        <FormControl style = {formStyle}>
            <RadioGroup aria-label="notion-pages" name="notion-pages" value={selectedPage} onChange={handleSelect}>
                {pages.map(page => (
                    <FormControlLabel key={page.ID} value={page.ID} control={<Radio />} label={page.Title} />
                ))}
            </RadioGroup>
        </FormControl>
        </div>
    );
}

export default NotionPageSelector;


/*
Add to <project name>
Add to recent project1
Add to recent project2
Add to => list of [projects]
*/


/*
Add to project name
Add to recent project 1
Add to recent project 2
--
Add to -> chrome ext popup
*/


/*
Add to project name
Add to recent project 1
Add to recent project 2
Add to more -> list[projects (3-4)]
*/

/*
Add to project name
*/