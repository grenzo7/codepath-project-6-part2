import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Card = (props) => {
    const [albumInfo, setAlbumInfo] = useState(null);
    useEffect(() => {
        let searchParameters = {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              'Authorization': 'Bearer ' + props.accessToken
            },
          }
        fetch('https://api.spotify.com/v1/albums/' + props.data.id, searchParameters).then(response => response.json()).then(data => {
            setAlbumInfo({...data})
        })
    }, [])

    return (
    <div className='album-card'>
        <h2>{props.idx + 1}. {props.data.name.toUpperCase()}</h2>
        <i className='date'>Released: {props.data.release_date}</i>
        <img src={props.data.images[0].url} />
        <span>Total tracks: {props.data.total_tracks}</span>
        <Link className="button form-submit" to={`/albums/${props.data.id}`} state={{ albumInfo: albumInfo }}> Learn More</Link>
    </div>
    )
}

export default Card;