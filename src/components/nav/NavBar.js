import React from "react"
import { Link, useHistory} from "react-router-dom"
//import "./NavBar.css"

export const NavBar = (props) => {

    const history = useHistory();
    const userId = sessionStorage.getItem("activeUser");
    const logout = () => {
        sessionStorage.clear(userId);
        history.push("/");
    }

    return (
        <ul className="navbar">
            <li className="navbar__item active">
                <Link className="navbar__link" to="/">Home</Link>
            </li>
            <li className="navbar__item">
                <Link className="navbar__link" to="/how-to-play">How to Play</Link>
            </li>
            <li className="navbar__item">
                <Link className="navbar__link" to={`/profile/${userId}`}>Profile</Link>
            </li>
            <li className="navbar__item">
                <button className="logout-btn" onClick={logout}>Log Out</button>
            </li>
        </ul>
    )
}