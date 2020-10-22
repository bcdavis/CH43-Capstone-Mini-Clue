// Render the part of the home page with the Custom Game

import React from "react"
import { useHistory } from 'react-router-dom';

export const PlayCustomGame = () => {
    const history = useHistory();

    const navToGameCreator = () => {
        history.push("/createCustom")
    }

    return (
        <>
            <h1 className="customGame-home--title">Custom</h1>
            <div className="playCustomBtn--container">
                <button type="button" className="playCustomBtn" onClick={navToGameCreator}>Create Game</button>
            </div>
        </>
    )
}