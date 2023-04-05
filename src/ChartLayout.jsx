import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import {
    PieChart,
    Pie,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
    Cell, 
    ResponsiveContainer
  } from "recharts";


const ChartLayout = () =>{
    const [accessToken, searchInput, setSearchInput, initialAlbumsData, setInitialAlbumsData, artistData, setArtistData] = useOutletContext();

    const [lineData, setLineData] = useState(null);

    const [pieData, setPieData] = useState(null);

    const [maxTrack, setMaxTrack] = useState(0);

    const [minTrack, setMinTrack] = useState(0);

    const [COLORS, setCOLORS] = useState(null);

    const sortByReleasedDate = (albums) => {
        albums.sort(function(a, b) {
          return new Date(a.release_date) - new Date(b.release_date);
        });
        return albums;
      }

    const getFilteredLineData = () =>{
        var workingArray = JSON.parse(JSON.stringify(initialAlbumsData));
        let returnData = [];
        workingArray.filter((checkData) => {
            let tempData = null
            if (returnData.length > 0){
                tempData = returnData.find((potentialMatchdata, idx) => {
                        if (checkData.release_date.slice(0, 4) === potentialMatchdata.release_date.slice(0, 4)){
                            returnData[idx].total_tracks += checkData.total_tracks
                            return potentialMatchdata
                        }})
                if (!tempData){
                    returnData.push(checkData)
                }
            } else {
                returnData.push(checkData)
            }
        })

        setMaxTrack(getMaxTrackCount(returnData))

        setMinTrack(getMinTrackCount(returnData))

        return sortByReleasedDate(returnData).map((data) => {
            return {name: data.release_date.slice(0, 4), "Total Tracks Released vs Published Year": data.total_tracks}
        })
    }

    const getFilteredPieData = () => {
        try {
        const genresLength = artistData.genres.length
        const baseDivideFactor = (genresLength + 1) * genresLength / 2
        let returnData = artistData.genres.map((genre, idx) => {
            let multiplyFactor = genresLength - idx
            let percentile = 100 / baseDivideFactor * multiplyFactor
            return {
                "name": genre.toUpperCase(),
                "Total Percentile of Genre": percentile 
            }
        })
        console.log(returnData)
        return returnData
        } catch {
            return null
        }
    }

    const getPieInfoString = () => {
        let returnString = `${artistData.name.toUpperCase()}'s songs can be categoried into ${artistData.genres.length} mainstream genres.`
        if (pieData){
            pieData.map((data) => {
                returnString += ` ${data.name},`
            })
            return returnString
        }
        return ""
    }

    const renderLabel = (entry) => {
        return entry.name;
    }

    const randomColorPicker = () => {
        var color = "hsl(" + Math.random() * 360 + ", 75%, 75%)";
        return color;
    }
    

    const getMaxTrackCount = (data) => {
        const maxCount = data.reduce(
          (acc, next) => {
            return next.total_tracks > acc ?  next.total_tracks: acc}, -Infinity
        )
        return maxCount;
      }

      const getMinTrackCount = (data) => {
        const minCount = data.reduce(
          (acc, next) => {
            return next.total_tracks < acc ?  next.total_tracks: acc}, Infinity
        )
        return minCount;
      }

    useEffect(() => {
        console.log(artistData)
        setLineData(getFilteredLineData())
        setPieData(getFilteredPieData())
        setCOLORS(initialAlbumsData.map(() => randomColorPicker()));
    }, [])

    return (
            <div className="chart-layout">
                <div className="info-block">
                    {lineData && <LineChart width={700} height={400} data={lineData}>
                        <Line type="monotone" dataKey="Total Tracks Released vs Published Year" stroke="rgb(189, 147, 219)" strokeWidth={7} />
                        <CartesianGrid stroke="rgb(218, 205, 205)" />
                        <XAxis dataKey="name" stroke="rgb(218, 205, 205)"/>
                        <YAxis stroke="rgb(218, 205, 205)"/>
                        <Tooltip />
                        <Legend />
                    </LineChart>}
                    {artistData && <div className='container stats-container'>
                            <div className="stat-card">{artistData ? `${artistData.name.toUpperCase()} has released a maximum of ` + maxTrack + " and a minimum of " + minTrack +" tracks in a calender year" : ""}</div>
                    </div>}
                </div>
                <div className="info-block">
                    {pieData && <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={600} height={600}>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="55%"
                            outerRadius={230}
                            fill="#8884d8"
                            dataKey="Total Percentile of Genre"
                            label={renderLabel}
                        >
                            {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>}

                    {artistData && <div className='container stats-container'>
                            <div className="stat-card">{artistData ? getPieInfoString(): ""}</div>
                    </div>}
                </div>
            </div>
        )
}

export default ChartLayout;