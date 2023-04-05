import React from "react";
import { useLocation, useOutletContext} from "react-router-dom";
import {
    Tooltip,
    BarChart,
    XAxis,
    YAxis,
    Legend,
    CartesianGrid,
    Bar,
    Cell
  } from "recharts";

const MoreAlbumInfo = () => {
    const [accessToken, searchInput, setSearchInput, initialAlbumsData, setInitialAlbumsData, artistData, setArtistData] = useOutletContext();
    const location = useLocation();
    const {albumInfo} = location.state;
    
    const data = [
          {
            "name": "Album Popularity",
            "Album Popularity score vs Average Overall Artist Score": albumInfo.popularity,
          },
          {
            "name": "Overall Artist Popularity",
            "Album Popularity score vs Average Overall Artist Score": artistData.popularity,
          },
    ];

    const COLORS = ["#99dbb4", "#6fa4c5"]

    return (<div className="more-info">
                    {albumInfo && <div className='album-card'>
                                    <h2>{albumInfo.name.toUpperCase()}</h2>
                                    <img src={albumInfo.images[0].url} />
                                    <div>
                                        <p><span className="heading">Artists</span> {albumInfo.artists.map((artist) => <span className="info">{artist.name}</span>)}</p>
                                        <p><span className="heading">Copyrights</span> {albumInfo.copyrights.map((copyright) => <span className="info">{copyright.text}</span>)}</p>
                                        <p><span className="heading">Label</span> <span className="info">{albumInfo.label}</span></p>
                                        <p><span className="heading">Popularity</span> <span className="info">{albumInfo.popularity}</span></p>
                                        <p><span className="heading">Release Date</span> <span className="info">{albumInfo.release_date}</span></p>
                                        <p><span className="heading">Total Tracks</span> <span className="info">{albumInfo.total_tracks}</span></p>
                                    </div>
                    </div>}
                <div>
                <BarChart className="bar-diagram" width={650} height={450} data={data} 
                    margin={{
                            top: 5,
                            right: 30,
                            left: 80,
                            bottom: 5,
                        }}
                    barSize={50}>
                        <XAxis
                            dataKey="name"
                            scale="point"
                            padding={{ left: 100, right: 100 }}
                            stroke="rgb(218, 205, 205)"
                        />
                        <YAxis stroke="rgb(218, 205, 205)"/>
                        <Tooltip />
                        <Legend />
                        <CartesianGrid stroke="rgb(218, 205, 205)" />
                        <Bar dataKey="Album Popularity score vs Average Overall Artist Score" fill="rgb(189, 147, 219)">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Bar>
                </BarChart>
                </div>
            </div>
    )
}


export default MoreAlbumInfo;