// This file describes what the home page will look like and how it will function

import React from "react"
//import "./Home.css"
import { PlayClassicGame } from "./ClassicGame.js"
//import { PlayCustomGame } from "./CustomGame.js"

export const Home = () => (
    <>
        <div className="homeContainer">
           <section className="classicGameContainer">
               <PlayClassicGame />
           </section>
           {/* <section className="customGameContainer">
               <PlayCustomGame />
           </section> */}
        </div>

    </>
)