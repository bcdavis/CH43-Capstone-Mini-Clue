// Render the part of the home page with Classic Game
// This has a title, a button, and the leaderboard

import React from "react"
import { useHistory } from 'react-router-dom';

export const PlayClassicGame = () => {

    const history = useHistory();

    const navToPlayGame = () => {
        history.push("/play")
    }


    return (
        <>
            <h1 className="classicGame-home--title">Classic</h1>
            <div className="playClassicBtn--container">
                <button type="button" className="playClassicBtn" onClick={navToPlayGame}>New Game</button>
            </div>
        </>
    )
}