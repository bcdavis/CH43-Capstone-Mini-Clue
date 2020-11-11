import React from "react"
import { Route, Redirect, useHistory, useParams, Link } from "react-router-dom"
import { ApplicationViews } from "./ApplicationViews"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import { Header } from "./Header"
import "./Header.css"


export const MainApp = () => {
    const history = useHistory();
    const params = useParams();

    const navHome = () => {
        if(sessionStorage.getItem("activeUser")) {
            return "/"
        }
        else{
            return "/login"
        }
    }

    return( 
    <>
        <Route render={() => {
            if (sessionStorage.getItem("activeUser")) {
                return (
                    <>
                        <div className="header-nav-logout">
                            <Header />
                        </div>
                        <ApplicationViews />  
                    </>
                )
            } else {
                return <Redirect to="/login" />
            }
        }} />

        <Route path="/login">
            <Login />
        </Route>
        <Route path="/register">
            <Register />
        </Route>
        <footer className="footer">
                <div className="footer-links">
                    <div className="homeIcon footer-item">
                        {sessionStorage.getItem("activeUser") ? <Link className="homeBtn" to="/">CLUE</Link> : <div className="homeBtn">CLUE</div>}
                    </div>
                    <div className="footer-right">
                        <div className="repositoryLink footer-item"> 
                            <a href="https://github.com/bcdavis/CH43-Capstone-Mini-Clue">
                                <h3>View Code</h3>
                            </a>
                        </div>
                        <div className="profileLink footer-item"> 
                        <h3>Created by:</h3>
                            <a href="https://github.com/bcdavis">
                                Ben Davis
                            </a>
                        </div>
                    </div>
                    
                    
                </div>
        </footer>
    </>
    )
}
