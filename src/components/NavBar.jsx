import React from "react";
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <div className="nav-bar">
            <ul>
                <li>
                    <Link to="/" className="link">Card/Dashboard View</Link>
                </li>
                <li>
                    <Link to="/chartview" className="link">Chart View</Link>
                </li>
            </ul>
        </div>
    )
}

export default NavBar;