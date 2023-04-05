import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import './App.css';

const CLIENT_ID = '5f01868cfc3243c1892a7972f7a501a6';
const CLIENT_CODE = '903c93c9e868460285af50f14375e1d3';

function App() {
    const [accessToken, setAccessToken] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [initialAlbumsData, setInitialAlbumsData] = useState([]);
    const [artistData, setArtistData] = useState(null);
 
    useEffect(() => {
      // API Accces parameters provided by Spotify
      let authParameters = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_CODE
      }
      fetch('https://accounts.spotify.com/api/token', authParameters).then(result => result.json()).then(data => setAccessToken(data.access_token)) 
    }, [])

    return (
        <div className="app-container">
            <NavBar />
            <Outlet context={[accessToken, searchInput, setSearchInput, initialAlbumsData, setInitialAlbumsData, artistData, setArtistData]} />
        </div>
    )
}

export default App;