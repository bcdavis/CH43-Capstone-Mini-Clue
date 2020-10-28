// This file describes the functionality and the appearance of the playable game area
// This page is accessed by either clicking the "New Game" button for the classic game mode
// or by creating a new custom game and then clicking "save settings" button. 

import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { CustomGameContext } from "../customGame/CustomGameProvider.js"
import { CardContext } from "../card/CardProvider.js"
import { CardHTML } from "../card/Card.js"

export const GameBoard = (props) => {

    const { getCustomGameByGameId } = useContext(CustomGameContext)
    const { cards, getCardsByGameId } = useContext(CardContext)

    const [currentCustomGame, setCurrentCustomGame] = useState({})
    const {customGameId} = useParams();

    useEffect(() => {
        if(customGameId){
            getCustomGameByGameId(customGameId)
            .then(currentGame => {
                setCurrentCustomGame(currentGame[0])
                getCardsByGameId(currentGame[0].id)
            })
        }
    }, [])

    // If the params in the url include '/play/:customGameId(\d+)',
    // load the settings of the custom game with that customGameId

    // If no id is given, the user is playing a classic game

    console.log("currentCustomGame: ", currentCustomGame.user);

    return (
        <>
            <h1 className="gameboard-title">
                {`Game: ${customGameId}`}
            </h1>

            <section className="gameboard-gameInformation">
                <div className="gameboard-gameName">{`Name: ${currentCustomGame.gameName}`}</div>
                <div className="gameboard-gameId">{`Creator Id: ${currentCustomGame.user}`}</div>
                <section className="gameboard-cardList">
                    {
                        cards.map(card => {
                            return <CardHTML key={card.id} cardObj={card} />
                        })
                    }
                </section>
            </section>
        </>
    )
}