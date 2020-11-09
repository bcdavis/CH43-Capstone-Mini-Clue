// This file describes what the home page will look like and how it will function

import React from "react"
//import "./Home.css"
import { PlayClassicGame } from "./ClassicGame.js"
import { PlayCustomGame } from "./CustomGame.js"
import { LeaderboardList } from "../leaderboard/LeaderboardList.js"

export const Home = () => (
    <>
        <div className="homeContainer">
            <section className="classicGameContainer">
                <PlayClassicGame />
            </section>
            {/* <section className="customGameContainer">
                <PlayCustomGame />
            </section> */}
            <section id="leaderboard">
                <h2>Leaderboard</h2>
                <LeaderboardList />
            </section>
        </div>

    </>
)