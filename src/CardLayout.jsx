import './App.css';
import {useState, useEffect} from 'react';
import { useOutletContext } from 'react-router-dom';
import Input from './components/Input';
import Card from './components/Card'

function CardLayout() {
  const [accessToken, searchInput, setSearchInput, initialAlbumsData, setInitialAlbumsData, artistData, setArtistData] = useOutletContext();
  const [albums, setAlbums] = useState([])
  const [lowerBound, setLowerBound] = useState(0);
  const [upperBound, setUpperBound] = useState(0);
  const [minCount, setMinCount] = useState(0);
  const [maxCount, setMaxCount] = useState(0);
  const [currentSort, setCurrentSort] = useState("none");

  useEffect(() => {
    // reset max song count
    setMaxCount(maxTrackCount());
    // reset min song count
    setMinCount(minTrackCount());
    // reset upper bound
    setUpperBound(maxTrackCount());
    // reset lower bound
    setLowerBound(minTrackCount());
  }, [initialAlbumsData])


  useEffect(() => {
    handleSortOptionChange(currentSort);
  }, [albums])

  useEffect(() => {
    filterBySongs()
  }, [upperBound, lowerBound])

   // helper function to find maximum number of tracks
   const maxTrackCount = () => {
    const maxCount = initialAlbumsData.reduce(
      (acc, next) => {
        return next.total_tracks > acc ?  next.total_tracks: acc}, -Infinity
    )
    return maxCount;
  }

  // helper function to find maximum number of tracks
  const minTrackCount = () => {
    const minCount = initialAlbumsData.reduce(
      (acc, next) => {
        return next.total_tracks < acc ?  next.total_tracks: acc}, Infinity
    )
    return minCount;
  }

  // helper function to make search for an album based on the artist name
  const search = async (e) => {
    // avoid refreshing of page on button or enter click
    e.preventDefault();
    // search paramaters authorization provided by Spotify
    let searchParameters = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
    }
     // get artist data associated to the given artist
    let data = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters).then(response => response.json()).then(data => {return data.artists.items[0]})
    // set the artist data
    setArtistData(data)
    // get all the albums of the given artist
    let albumsInfo = await fetch('https://api.spotify.com/v1/artists/' + data.id + '/albums', searchParameters).then(response => response.json()).then(data => {return data.items})
    // update albums to show all the albums data
    setAlbums([...albumsInfo]);
    // store initial albums state
    setInitialAlbumsData([...albumsInfo]);
    // reset the search Input
    setSearchInput("");
  }

  const filterBySongs = () => {
    // from initial albums data filter out albums which are not in current upper-lower bound range
    const filteredData = initialAlbumsData.filter((album) => album.total_tracks >= lowerBound && album.total_tracks <= upperBound)
    // reset current albums data
    setAlbums([...filteredData])
  }

  const updateBound = (value, type) => {
    // check if change in value is inside of the max-min range
    if (value >= minCount && value <= maxCount){
      // update lower bound if intended lower bound value will be lesser than equal to current upper bound value
      if (type === 'l' && value <= upperBound){
        console.log("It's here")
        setLowerBound(value) 
      // update upper bound if intended upper bound value will be more than equal to current upper bound value
      } else if (type === 'u' && value >= lowerBound){
        setUpperBound(value) 
      }
    }
  }

  const leftSideChange = (e) => {
    updateBound(Number(e.target.value), 'l');
  }

  const rightSideChange = (e) => {
    updateBound(Number(e.target.value), 'u');
  }

  const getRangeOfTracks = () => {
    // find max and min count
    const maxCount = maxTrackCount();
    const minCount = minTrackCount();
    // return an appropriate response of range
    if (maxCount - minCount > 0){
      return "The range of total tracks is " + minCount + " - " + maxCount + " tracks per album";
    } else {
      return "There are  " + maxCount + " number of tracks in every album";
    }
  }

  // helper function to alphabetically sort the albums based on their title 
  const sortAlphabetically = () =>{
    let currentData = albums;
    currentData.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    setAlbums([...currentData]);
  }

  // helper function to sort albums in ascending order of their number of tracks
  const sortByNoOfTracks = () => {
    let currentData = albums;
    currentData.sort((a, b) => (a.total_tracks > b.total_tracks) ? 1 : -1);
    setAlbums([...currentData]);
  }
  
  // helper function to sort albums on the basis of their release date 
  const sortByReleasedDate = () => {
    let currentData = albums;
    albums.sort(function(a, b) {
      return new Date(a.release_date) - new Date(b.release_date);
    });
    setAlbums([...currentData])
  }

  const handleSortOptionChange = (value) => {
    setCurrentSort(value);
    if (value === "alphabetically"){
      sortAlphabetically();
    } else if (value === "tracks"){
      sortByNoOfTracks();
    } else if (value === "date"){
      sortByReleasedDate();
    }
  }

  return (
    <div className="App">
      <div className='left-panel'>
        <Input searchInput={searchInput} setSearchInput={setSearchInput} search={search} />
        <h1 className='author-title'>{artistData && artistData.name !== "" ? "Artist: " + `${artistData.name.toUpperCase()}` : "" }</h1>
        <h2>Show By</h2>
        <p>Number of Songs / album</p>
        <div className='songs-filter'>
          <input className="button" type="number" value={lowerBound} onChange={leftSideChange} /> to <input className="button" type="number" value={upperBound} onChange={rightSideChange}/>
        </div>
        <div className='sort-by-container'>
          <label htmlfor="sort-value">Sort by</label>
          <select id="sort-value" name="sort-type" defaultValue="none" onChange={(e) => handleSortOptionChange(e.target.value)}>
            <option value="none">None</option>
            <option value="date">Release Date</option>
            <option value="alphabetically">Alphabetically (A-Z)</option>
            <option value="tracks">Number of Tracks</option>
          </select>
        </div>
      </div>
      <div className='middle-panel'>
        <div className='container album-container'>
          {albums.map((album, i) => {
                  return <Card idx={i} data={album} accessToken={accessToken} />;
          })}
        </div>
      </div>
      <div className='right-panel'>
        {artistData && <div className='container stats-container'>
          <div className="stat-card">{artistData ? "This artist has an average of " + artistData.popularity + " rating in Spotify" : ""}</div>
          <div className="stat-card">{albums.length !== 0 ? "This artist has " + initialAlbumsData.length + " listed albums in Spotify" : ""}</div>
          <div className="stat-card">{artistData ? getRangeOfTracks() : ""}</div>
        </div>}
      </div>
    </div>
  ) 
}


export default CardLayout;
