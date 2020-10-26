import React from "react"
//import {Button} from "reactstrap"
import { Route, Redirect } from "react-router-dom"
import { ApplicationViews } from "./ApplicationViews"
//import { NavBar } from "./nav/NavBar"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import { Header } from "./Header"
import "./Header.css"


export const MainApp = () => (
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
    </>
)
