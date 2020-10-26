import React from "react"
import { useHistory } from "react-router-dom"
import { Button } from "reactstrap"
import { NavBar } from "./nav/NavBar"
import "./Header.css"

export const Header = () => {

    const history = useHistory();
    const userId = sessionStorage.getItem("activeUser");
    const logout = () => {
        sessionStorage.clear(userId);
        history.push("/");
    }
        
    return (
        <>
            
            <h2 className="header-title">CLUE</h2>
            <NavBar />
            <div className="logoutBtn-container">
                <Button className="logout-btn" onClick={logout}>Log Out</Button>
            </div>
            
        </>
    )
}