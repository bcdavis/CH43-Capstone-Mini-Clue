import React from "react"
import { Link, useParams } from "react-router-dom"
import "./NavBar.css"

export const NavBar = (props) => {

    const userId = sessionStorage.getItem("activeUser");
    // const {profileId} = useParams();
    // console.log(useParams());
    // console.log(props);
    // console.log("profileId: ", profileId);


    return (
        <>
            <ul className="navbar">
                <li className="navbar__item active">
                    <Link className="navbar__link" to="/">Home</Link>
                </li>
                <li className="navbar__item">
                    <Link className="navbar__link" to="/how-to-play">How to Play</Link>
                </li>
                {/* <li className="navbar__item">
                    <Link className="navbar__link" to={`/profile/${userId}`}>Profile</Link>
                </li> */}
            </ul>
        </>
    )
}