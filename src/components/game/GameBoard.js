// This file describes the functionality and the appearance of the playable game area
// This page is accessed by either clicking the "New Game" button for the classic game mode
// or by creating a new custom game and then clicking "save settings" button. 

import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { CustomGameContext } from "../customGame/CustomGameProvider.js"
import { CardContext } from "../card/CardProvider.js"
import { CardHTML } from "../card/Card.js"
import { ClassicGameResultsContext } from "./ClassicGameProvider.js"
import "./Game.css"

export const GameBoard = (props) => {

    const { getCustomGameByGameId } = useContext(CustomGameContext)
    const { cards, getCardsByGameId, getCardsByGameIdAndType } = useContext(CardContext)
    //const { getBestResultsByUserId, updateBestResults} = useContext(ClassicGameResultsContext)

    const [currentGame, setCurrentGame] = useState({})
    const [gameResults, setGameResults] = useState()

    const [ filteredCards, setFilteredCards] = useState({
        charCards: [],
        weaponCards: [],
        roomCards: []
    }); 

    const [charCardArr, setCharCardArr] = useState([])
    const [weaponCardArr, setWeaponCardArr] = useState([])
    const [roomCardArr, setRoomCardArr] = useState([])


    // access the filtered cards as an object containing three properties
    // each property is an array of cards, where the property name is the type of card

    const {customGameId} = useParams();


    useEffect(() => {
        //console.log("useEffect--1--GameBoard");
        if(customGameId){
            // User is going to play a custom game
            getCustomGameByGameId(customGameId)
            .then(game => {
                setCurrentGame(game[0])
                getCardsByGameIdAndType(game[0].id, "character") // sets the 'cards' variable with cards with gameId = game[0].id
                .then(setCharCardArr)

                getCardsByGameIdAndType(game[0].id, "weapon")
                .then(setWeaponCardArr)

                getCardsByGameIdAndType(game[0].id, "room")
                .then(setRoomCardArr)
            })
        }
        else{
            // User is going to play a classic game, 
            // create new object to hold the game results
            // fetch the classic game cards
            getCardsByGameIdAndType(0, "character") // sets the 'cards' variable with cards with gameId = 0
            .then(setCharCardArr)

            getCardsByGameIdAndType(0, "weapon")
            .then(setWeaponCardArr)

            getCardsByGameIdAndType(0, "room")
            .then(setRoomCardArr)
        }
    }, [])


    // If the params in the url include '/play/:customGameId(\d+)',
    // load the settings of the custom game with that customGameId

    // If no id is given, the user is playing a classic game

    //console.log("currentCustomGame: ", currentGame.user);

    const filterCardsByType = () => {
        debugger;
        console.log("---------- filterCardsByType()");
        // ---- Original plan for filtering ----
        const charSubset = cards.filter(card => {
            //console.log("CharCard?");
            return (card.type === "character")
        })
        const weaponSubset = cards.filter(card => {
            return (card.type === "weapon")
        })
        const roomSubset = cards.filter(card => {
            //console.log("roomCard? : ", card);
            return (card.type === "room")
        })
        // ---- New plan to potentially fix bug ----
        // const charSubset = cards.filter(checkCharType).map(card => {
        //     return <CardHTML key={card.id} cardObj={card} />
        // })
        // const weaponSubset = cards.filter(checkWepnType).map(card => {
        //     return <CardHTML key={card.id} cardObj={card} />
        // })
        // const roomSubset = cards.filter(checkRoomType).map(card => {
        //     return <CardHTML key={card.id} cardObj={card} />
        // })
        setFilteredCards({
            charCards: charSubset,
            weaponCards: weaponSubset,
            roomCards: roomSubset
        })
    }

    /*
    const checkCharType = (typeStr) => {
        console.log("typeStr: ", typeStr);
        return typeStr === "character"
    }

    const checkWepnType = (typeStr) => {
        console.log("typeStr: ", typeStr);
        return typeStr === "weapon"
    }

    const checkRoomType = (typeStr) => {
        console.log("typeStr: ", typeStr);
        return typeStr === "room"
    }
    */

    //console.log("cards: ", cards);
    //console.log("filteredCards: ", filteredCards);
    //filterCardsByType()

    return (
        <>
            <h1 className="gameboard-title">
                {customGameId ? `Game: ${customGameId}` : "Classic Game"}
            </h1>

            <section className="gameboard-gameInformation">
                <div className="gameboard-gameName">{customGameId ? `Name: ${currentGame.gameName}` : <></>}</div>
                <div className="gameboard-gameId">{customGameId ? `Creator Id: ${currentGame.user}` : <></>}</div>
                <section className="gameboard-cardList">
                    {/* {
                        cards.map(card => {
                            return <CardHTML key={card.id} cardObj={card} />
                        })
                    } */}
                    {/* {filterCardsByType()} */}
                    {/* <div className="charCardList">
                        {cards.filter(card => {
                                //console.log("CharCard?");
                                if(card.type === "character"){
                                    return <CardHTML key={card.id} cardObj={card} />
                                }
                            })
                        }
                    </div> 
                    
                    <div className="weaponCardList">
                        {filteredCards.weaponCards}
                    </div>
                    <div className="roomCardList">
                        {filteredCards.roomCards}
                    </div>*/}
                    <div className="cardList charCardList">
                        <h3 className="charList-title">Characters</h3>
                        {charCardArr.map(card => {
                            return <CardHTML key={card.id} cardObj={card} />
                        })}
                    </div>
                    <div className="cardList weaponCardList">
                        <h3 className="weaponList-title">Weapons</h3>
                        {weaponCardArr.map(card => {
                            return <CardHTML key={card.id} cardObj={card} />
                        })}
                    </div>
                    <div className="cardList roomCardList">
                        <h3 className="roomList-title">Rooms</h3>
                        {roomCardArr.map(card => {
                            return <CardHTML key={card.id} cardObj={card} />
                        })}
                    </div>
                </section>
            </section>
        </>
    )
}