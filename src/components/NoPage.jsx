import React from "react";
import { Link } from "react-router-dom";

const NoPage = () => {
    return (
    <div className="no-page-info">
        <Link className="link" to={"/"}>404: Page Not Found</Link>
    </div>)
}

export default NoPage;